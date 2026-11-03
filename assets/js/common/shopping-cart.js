(() => {
  const storageKey = 'tezcan-shopping-cart-v1';
  const maxQuantity = 99;
  const userCartKey = userId => `${storageKey}-user-${userId}`;
  let activeStorageKey = storageKey;
  let activeUser = null;
  let client = null;
  let toastTimer = 0;
  let syncTimer = 0;
  let syncInProgress = false;
  let syncRequestedAgain = false;

  function readStorage(key = activeStorageKey) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(value)) return [];
      const unique = new Map();
      value.forEach(row => {
        if (!row || typeof row.id !== 'string' || !row.id) return;
        const quantity = Number(row.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) return;
        const slug = typeof row.slug === 'string' && /^[a-z0-9-]+$/.test(row.slug) ? row.slug : '';
        unique.set(row.id, {
          id: row.id,
          slug,
          quantity: Math.min(maxQuantity, (unique.get(row.id)?.quantity || 0) + quantity),
          updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : ''
        });
      });
      return [...unique.values()];
    } catch { return []; }
  }

  function notify(message, kind = 'success') {
    let toast = document.getElementById('shoppingCartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shoppingCartToast';
      toast.className = 'shopping-cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.append(toast);
    }
    toast.dataset.kind = kind;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function emitChange(items = read()) {
    document.dispatchEvent(new CustomEvent('tezcan:cart-change', { detail: { items, storageKey: activeStorageKey } }));
  }

  function writeStorage(items, { scheduleSync = true } = {}) {
    try {
      const normalized = items.map(row => ({
        id: row.id,
        ...(row.slug ? { slug: row.slug } : {}),
        quantity: Math.min(maxQuantity, Math.max(1, Math.floor(Number(row.quantity) || 1))),
        updatedAt: row.updatedAt || new Date().toISOString()
      }));
      localStorage.setItem(activeStorageKey, JSON.stringify(normalized));
      emitChange(normalized);
      if (scheduleSync && activeUser && client) queueRemoteSync();
      return true;
    } catch {
      notify('Sepet bu cihazda saklanamadı. Tarayıcı depolama alanını kontrol et.', 'error');
      return false;
    }
  }

  function mergeRows(...groups) {
    const merged = new Map();
    groups.flat().forEach(row => {
      const key = row.slug ? `slug:${row.slug}` : `id:${row.id}`;
      const existing = merged.get(key);
      if (!existing) { merged.set(key, { ...row }); return; }
      merged.set(key, {
        ...existing,
        ...row,
        id: row.slug ? (existing.slug === row.slug ? (existing.id || row.id) : row.id) : existing.id,
        slug: row.slug || existing.slug,
        quantity: Math.min(maxQuantity, existing.quantity + row.quantity),
        updatedAt: new Date().toISOString()
      });
    });
    return [...merged.values()];
  }

  function mergeLatestRows(localRows, remoteRows) {
    const merged = new Map();
    [...remoteRows, ...localRows].forEach(row => {
      const key = row.slug ? `slug:${row.slug}` : `id:${row.id}`;
      const current = merged.get(key);
      const nextTime = Date.parse(row.updatedAt || '') || 0;
      const currentTime = Date.parse(current?.updatedAt || '') || 0;
      if (!current || nextTime >= currentTime) merged.set(key, { ...row });
    });
    return [...merged.values()];
  }

  async function resolveSlugs(items) {
    const unresolved = items.filter(row => !row.slug);
    if (!unresolved.length || !client) return items;
    const resolved = new Map();
    const uuidRows = unresolved.filter(row => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(row.id));
    const slugRows = unresolved.filter(row => !uuidRows.includes(row) && /^[a-z0-9-]+$/.test(row.id));
    try {
      if (uuidRows.length) {
        const { data } = await client.from('catalog_products').select('id,slug').in('id', uuidRows.map(row => row.id));
        (data || []).forEach(row => resolved.set(row.id, row.slug));
      }
      if (slugRows.length) {
        const { data } = await client.from('catalog_products').select('id,slug').in('slug', slugRows.map(row => row.id));
        (data || []).forEach(row => resolved.set(row.id, row.slug));
      }
    } catch { /* Preserve local-only items when they are not in the live catalog. */ }
    return items.map(row => ({ ...row, slug: row.slug || resolved.get(row.id) || '' }));
  }

  async function syncRemoteCart() {
    if (!activeUser || !client) return false;
    const user = activeUser;
    const rows = await resolveSlugs(read());
    if (activeUser?.id !== user.id) return false;
    const slugs = [...new Set(rows.map(row => row.slug).filter(Boolean))];
    let activeSlugs = new Set();
    if (slugs.length) {
      const { data, error } = await client.from('catalog_products').select('slug').eq('status', 'active').in('slug', slugs);
      if (error) { console.warn('Sepet ürünleri eşitlenemedi:', error); return false; }
      activeSlugs = new Set((data || []).map(row => row.slug));
    }
    const desired = rows.filter(row => row.slug && activeSlugs.has(row.slug));
    const { data: remoteRows, error: readError } = await client.from('customer_cart_items')
      .select('product_slug,quantity,updated_at').eq('user_id', user.id);
    if (readError) { console.warn('Hesap sepeti okunamadı:', readError); return false; }
    const desiredSlugs = new Set(desired.map(row => row.slug));
    const removeSlugs = (remoteRows || []).map(row => row.product_slug).filter(slug => !desiredSlugs.has(slug));
    if (removeSlugs.length) {
      const { error } = await client.from('customer_cart_items').delete().eq('user_id', user.id).in('product_slug', removeSlugs);
      if (error) { console.warn('Hesap sepetinden kaldırma başarısız:', error); return false; }
    }
    if (desired.length) {
      const timestamp = new Date().toISOString();
      const { error } = await client.from('customer_cart_items').upsert(
        desired.map(row => ({ user_id: user.id, product_slug: row.slug, quantity: row.quantity, updated_at: timestamp })),
        { onConflict: 'user_id,product_slug' }
      );
      if (error) { console.warn('Hesap sepeti kaydedilemedi:', error); return false; }
    }
    return true;
  }

  function queueRemoteSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      if (syncInProgress) { syncRequestedAgain = true; return; }
      syncInProgress = true;
      try { await syncRemoteCart(); }
      finally {
        syncInProgress = false;
        if (syncRequestedAgain) { syncRequestedAgain = false; queueRemoteSync(); }
      }
    }, 450);
  }

  async function connectUser(user) {
    if (!user) {
      activeUser = null;
      activeStorageKey = storageKey;
      emitChange(read());
      return;
    }
    if (activeUser?.id === user.id && activeStorageKey === userCartKey(user.id)) return;
    const accountKey = userCartKey(user.id);
    const hadAccountCart = localStorage.getItem(accountKey) !== null;
    const accountRows = readStorage(accountKey);
    const guestRows = readStorage(storageKey);
    activeUser = user;
    activeStorageKey = accountKey;

    const localCart = mergeRows(accountRows, guestRows);
    writeStorage(localCart, { scheduleSync: false });
    try { localStorage.removeItem(storageKey); } catch {}

    try {
      const { data, error } = await client.from('customer_cart_items')
        .select('product_slug,quantity,updated_at').eq('user_id', user.id);
      if (error) throw error;
      if (activeUser?.id !== user.id) return;
      const remoteCart = (data || []).map(row => ({
        id: row.product_slug, slug: row.product_slug, quantity: Number(row.quantity), updatedAt: row.updated_at || ''
      }));
      const resolvedLocal = await resolveSlugs(readStorage(accountKey));
      if (activeUser?.id !== user.id) return;
      // A first sign-in combines a guest basket with the saved account basket;
      // later visits treat the most recently changed copy as authoritative.
      const merged = !hadAccountCart && guestRows.length
        ? mergeRows(remoteCart, resolvedLocal)
        : mergeLatestRows(resolvedLocal, remoteCart);
      writeStorage(merged, { scheduleSync: false });
      emitChange(merged);
      await syncRemoteCart();
    } catch (error) {
      console.warn('Sepet hesaba eşitlenemedi; bu cihazdaki sepet saklanıyor:', error);
      emitChange(readStorage(accountKey));
      queueRemoteSync();
    }
  }

  function add(product) {
    if (!product || typeof product.id !== 'string' || product.status !== 'active') {
      notify('Bu ürün şu anda sepete eklenemiyor.', 'error');
      return false;
    }
    const stockKnown = product.stock !== null && product.stock !== undefined && product.stock !== '' && Number.isInteger(Number(product.stock));
    const stock = stockKnown ? Number(product.stock) : null;
    if (stock === 0) { notify('Bu ürün stokta bulunmuyor.', 'error'); return false; }
    const items = read();
    const current = items.find(row => row.id === product.id || (product.slug && row.slug === product.slug))?.quantity || 0;
    const limit = stock === null ? maxQuantity : Math.min(maxQuantity, stock);
    if (current >= limit) {
      notify(stock === null ? 'Bu üründen sepete en fazla 99 adet eklenebilir.' : `Stokta yalnızca ${stock} adet bulunuyor.`, 'error');
      return false;
    }
    const next = items.filter(row => row.id !== product.id && (!product.slug || row.slug !== product.slug));
    next.push({ id: product.id, slug: product.slug || '', quantity: current + 1, updatedAt: new Date().toISOString() });
    if (!writeStorage(next)) return false;
    notify(`${product.name} sepetine eklendi.`);
    return true;
  }

  function setQuantity(id, quantity, product) {
    const items = read();
    if (quantity < 1) return remove(id);
    let limit = maxQuantity;
    if (product && product.stock !== null && product.stock !== undefined && product.stock !== '' && Number.isInteger(Number(product.stock))) {
      limit = Math.min(maxQuantity, Math.max(0, Number(product.stock)));
    }
    if (limit === 0) return remove(id);
    const next = items.map(row => row.id === id ? { ...row, quantity: Math.min(limit, Math.max(1, Math.floor(quantity))), updatedAt: new Date().toISOString() } : row);
    return writeStorage(next);
  }

  function remove(id) { return writeStorage(read().filter(row => row.id !== id)); }
  function clear() { return writeStorage([]); }
  function count() { return read().reduce((total, row) => total + row.quantity, 0); }

  const config = window.SUPABASE_CONFIG || {};
  if (config.url && config.publishableKey && window.supabase?.createClient) {
    client = window.supabase.createClient(config.url, config.publishableKey);
    client.auth.getSession().then(({ data }) => connectUser(data?.session?.user || null)).catch(() => {});
    client.auth.onAuthStateChange((_event, session) => setTimeout(() => connectUser(session?.user || null), 0));
  }
  window.addEventListener('storage', event => {
    if (event.key === activeStorageKey) {
      emitChange(read());
      if (activeUser && client) queueRemoteSync();
    }
  });

  window.TezcanShoppingCart = Object.freeze({
    storageKey, get activeStorageKey() { return activeStorageKey; }, read, add, setQuantity, remove, clear, count, notify
  });
})();
