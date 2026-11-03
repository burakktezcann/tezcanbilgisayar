(() => {
  const storageKey = 'tezcan-shopping-cart-v1';
  const maxQuantity = 99;
  let toastTimer = 0;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(value)) return [];
      const unique = new Map();
      value.forEach(row => {
        if (!row || typeof row.id !== 'string' || !row.id) return;
        const quantity = Number(row.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) return;
        unique.set(row.id, Math.min(maxQuantity, (unique.get(row.id) || 0) + quantity));
      });
      return [...unique].map(([id, quantity]) => ({ id, quantity }));
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

  function save(items) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('tezcan:cart-change', { detail: { items } }));
      return true;
    } catch {
      notify('Sepet bu cihazda saklanamadı. Tarayıcı depolama alanını kontrol et.', 'error');
      return false;
    }
  }

  function add(product) {
    if (!product || typeof product.id !== 'string' || product.status !== 'active') {
      notify('Bu ürün şu anda sepete eklenemiyor.', 'error');
      return false;
    }
    const knownStock = Number.isInteger(Number(product.stock)) && product.stock !== null && product.stock !== '';
    const stock = knownStock ? Number(product.stock) : null;
    if (stock === 0) {
      notify('Bu ürün stokta bulunmuyor.', 'error');
      return false;
    }
    const items = read();
    const current = items.find(row => row.id === product.id)?.quantity || 0;
    const limit = stock === null ? maxQuantity : Math.min(maxQuantity, stock);
    if (current >= limit) {
      notify(stock === null ? 'Bu üründen sepete en fazla 99 adet eklenebilir.' : `Stokta yalnızca ${stock} adet bulunuyor.`, 'error');
      return false;
    }
    const next = items.filter(row => row.id !== product.id);
    next.push({ id: product.id, quantity: current + 1 });
    if (!save(next)) return false;
    notify(`${product.name} sepetine eklendi.`);
    return true;
  }

  function setQuantity(id, quantity, product) {
    const items = read();
    if (quantity < 1) return remove(id);
    let limit = maxQuantity;
    if (product && Number.isInteger(Number(product.stock)) && product.stock !== null && product.stock !== '') {
      limit = Math.min(maxQuantity, Math.max(0, Number(product.stock)));
    }
    if (limit === 0) return remove(id);
    const next = items.map(row => row.id === id ? { ...row, quantity: Math.min(limit, Math.max(1, Math.floor(quantity))) } : row);
    return save(next);
  }

  function remove(id) { return save(read().filter(row => row.id !== id)); }
  function clear() { return save([]); }
  function count() { return read().reduce((total, row) => total + row.quantity, 0); }

  window.TezcanShoppingCart = Object.freeze({ storageKey, read, add, setQuantity, remove, clear, count, notify });
})();
