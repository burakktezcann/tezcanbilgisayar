const productDetailRoot = document.getElementById('productDetail');
const productLoading = document.getElementById('productLoading');
const productNotFound = document.getElementById('productNotFound');
const productFavoriteButton = document.getElementById('productFavorite');
const detailQuery = new URLSearchParams(location.search);
const requestedSlug = detailQuery.get('slug') || '';
const favoriteStorageBase = 'tezcan-product-favorites';
const compareStorageKey = 'tezcan-product-compare';
const productCompareButton = document.getElementById('productCompare');
const productCompareStatus = document.getElementById('productCompareStatus');
const detailCategoryNames = {
  cpu: 'İşlemci', motherboard: 'Anakart', ram: 'RAM', gpu: 'Ekran kartı', disk: 'Depolama',
  case: 'Kasa', cooling: 'İşlemci soğutucusu', psu: 'Güç kaynağı', computers: 'Bilgisayar',
  peripherals: 'Çevre birimi', gaming: 'Oyun ve hobi', networking: 'Network', office: 'Ofis ürünü',
  accessories: 'Aksesuar', software: 'Yazılım'
};
const detailCategoryIcons = {
  cpu: 'fa-microchip', motherboard: 'fa-chess-board', ram: 'fa-memory', gpu: 'fa-display',
  disk: 'fa-hard-drive', case: 'fa-server', cooling: 'fa-fan', psu: 'fa-bolt', computers: 'fa-laptop',
  peripherals: 'fa-keyboard', gaming: 'fa-gamepad', networking: 'fa-wifi', office: 'fa-print',
  accessories: 'fa-plug', software: 'fa-gear'
};
const specLabels = {
  family: 'Ürün serisi', socket: 'İşlemci soketi', chipset: 'Yonga seti', memory_type: 'Bellek türü',
  form_factor: 'Biçim / boyut', capacity_gb: 'Kapasite', speed_mts: 'Bellek hızı', cas_latency: 'Gecikme',
  module_count: 'Modül sayısı', model_code: 'Model kodu', gpu_chip: 'Grafik işlemci', series: 'Seri',
  memory_gb: 'Ekran kartı belleği', recommended_psu_w: 'Önerilen güç kaynağı', drive_type: 'Depolama türü',
  interface: 'Bağlantı', board_support: 'Desteklenen anakartlar', gpu_clearance_mm: 'Ekran kartı alanı',
  cpu_cooler_clearance_mm: 'İşlemci soğutucu alanı', psu_clearance_mm: 'Güç kaynağı alanı',
  cooler_type: 'Soğutma türü', height_mm: 'Soğutucu yüksekliği', radiator_mm: 'Radyatör boyutu',
  socket_support: 'Soket uyumluluğu', power_w: 'Güç', efficiency: 'Verimlilik', length_mm: 'Uzunluk',
  modular: 'Kablo yapısı', device_type: 'Ürün türü', processor: 'İşlemci', memory_gb: 'Bellek kapasitesi',
  storage_gb: 'Depolama kapasitesi', connection: 'Bağlantı', screen_size_in: 'Ekran boyutu',
  refresh_rate_hz: 'Yenileme hızı', platform: 'Platform', wifi_standard: 'Wi-Fi standardı',
  speed_mbps: 'Ağ hızı', print_type: 'Baskı teknolojisi', connectivity: 'Bağlantı türü',
  software_type: 'Yazılım türü', license_type: 'Lisans türü'
};
const detailConfig = window.SUPABASE_CONFIG || {};
const detailClient = detailConfig.url && detailConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(detailConfig.url, detailConfig.publishableKey) : null;
let currentProduct = null;
let detailCatalogProducts = [];
let detailFavorites = [];
let detailFavoriteKey = favoriteStorageBase;
let detailFavoriteUser = null;
let remoteFavoriteIds = new Set();
let detailFavoriteSyncReady = false;

function readFavoriteIds(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter(id => typeof id === 'string') : [];
  } catch { return []; }
}
function writeFavoriteIds() {
  try { localStorage.setItem(detailFavoriteKey, JSON.stringify(detailFavorites)); } catch {}
  renderFavoriteButton();
  if (detailFavoriteSyncReady) syncDetailFavorites();
}
function renderFavoriteButton() {
  if (!currentProduct) return;
  const active = detailFavorites.includes(currentProduct.id);
  productFavoriteButton.setAttribute('aria-pressed', String(active));
  productFavoriteButton.innerHTML = `<i class="fa-${active ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i><span>${active ? 'Favorilerimden çıkar' : 'Favorilerime ekle'}</span>`;
}
function readComparedIds() {
  try { const ids = JSON.parse(localStorage.getItem(compareStorageKey) || '[]'); return Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : []; }
  catch { return []; }
}
function renderProductCompareButton() {
  if (!currentProduct) return;
  const ids = readComparedIds();
  const selected = ids.includes(currentProduct.id);
  const products = ids.map(id => detailCatalogProducts.find(item => item.id === id)).filter(Boolean);
  const categoryMismatch = products.some(item => item.categoryId !== currentProduct.categoryId);
  const maxReached = products.length >= 3 && !selected;
  productCompareButton.setAttribute('aria-pressed', String(selected));
  productCompareButton.disabled = categoryMismatch || maxReached;
  productCompareButton.innerHTML = `<i class="fa-solid ${selected ? 'fa-check' : 'fa-scale-balanced'}" aria-hidden="true"></i><span>${selected ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}</span>`;
  productCompareStatus.hidden = !(categoryMismatch || maxReached);
  productCompareStatus.textContent = categoryMismatch
    ? 'Karşılaştırma listen başka bir ürün kategorisi içeriyor. Önce karşılaştırma sayfasından listenizi temizleyin.'
    : maxReached ? 'En fazla üç ürün karşılaştırabilirsin.' : '';
  document.getElementById('productCompareOpen').hidden = products.length < 2;
}
async function syncDetailFavorites() {
  if (!detailClient || !detailFavoriteUser || !detailFavoriteSyncReady) return;
  const desired = new Set(detailFavorites);
  const remove = [...remoteFavoriteIds].filter(id => !desired.has(id));
  const add = [...desired].filter(id => !remoteFavoriteIds.has(id));
  try {
    if (remove.length) {
      const { error } = await detailClient.from('customer_favorites').delete().eq('user_id', detailFavoriteUser.id).in('product_id', remove);
      if (error) throw error;
    }
    if (add.length) {
      const { error } = await detailClient.from('customer_favorites').upsert(add.map(product_id => ({ user_id: detailFavoriteUser.id, product_id })), { onConflict: 'user_id,product_id', ignoreDuplicates: true });
      if (error) throw error;
    }
    remoteFavoriteIds = desired;
  } catch (error) {
    console.warn('Ürün favorileri hesaba eşitlenemedi:', error);
    detailFavoriteSyncReady = false;
  }
}
async function activateFavoriteAccount(user) {
  detailFavoriteUser = user || null;
  detailFavoriteSyncReady = false;
  remoteFavoriteIds = new Set();
  if (!user) {
    detailFavoriteKey = favoriteStorageBase;
    detailFavorites = readFavoriteIds(detailFavoriteKey);
    renderFavoriteButton();
    return;
  }
  detailFavoriteKey = `${favoriteStorageBase}-user-${user.id}`;
  const accountHasSavedFavorites = localStorage.getItem(detailFavoriteKey) !== null;
  const accountFavorites = readFavoriteIds(detailFavoriteKey);
  const guestFavorites = readFavoriteIds(favoriteStorageBase);
  try {
    const { data, error } = await detailClient.from('customer_favorites').select('product_id').eq('user_id', user.id);
    if (error) throw error;
    remoteFavoriteIds = new Set((data || []).map(row => row.product_id));
    detailFavorites = [...new Set([...remoteFavoriteIds, ...accountFavorites])];
    const guestOwner = localStorage.getItem(`${favoriteStorageBase}-guest-owner`);
    if ((!guestOwner || guestOwner === user.id) && !accountHasSavedFavorites) {
      detailFavorites = [...new Set([...detailFavorites, ...guestFavorites])];
      if (guestFavorites.length) localStorage.setItem(`${favoriteStorageBase}-guest-owner`, user.id);
    }
    detailFavoriteSyncReady = true;
    writeFavoriteIds();
  } catch (error) {
    console.warn('Ürün favorileri yüklenemedi:', error);
    const guestOwner = localStorage.getItem(`${favoriteStorageBase}-guest-owner`);
    detailFavorites = accountHasSavedFavorites ? accountFavorites : (!guestOwner || guestOwner === user.id ? guestFavorites : []);
    renderFavoriteButton();
  }
}
function normalizeDetailProduct(row, source = 'db') {
  if (!row) return null;
  return {
    id: row.id, slug: row.slug, categoryId: source === 'db' ? row.category_id : row.categoryId,
    name: row.name, description: row.description || '', brand: row.brand || '', model: row.model || '', sku: row.sku || '',
    image: source === 'db' ? row.image_path : row.image, price: row.price === null || row.price === undefined ? null : Number(row.price),
    currency: row.currency || 'TRY', stock: row.stock, status: row.status, attributes: row.attributes || {}, searchTerms: row.search_terms || row.searchTerms || []
  };
}
function safeProductImage(path) {
  return typeof path === 'string' && ((/^assets\/products\/[A-Za-z0-9._/-]+$/.test(path) && !path.includes('..'))
    || /^https:\/\/[A-Za-z0-9.-]+\/storage\/v1\/object\/public\/product-images\/[A-Za-z0-9._/-]+$/.test(path));
}
function formatPrice(product) {
  return Number.isFinite(product.price)
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: /^[A-Z]{3}$/.test(product.currency || '') ? product.currency : 'TRY' }).format(product.price)
    : 'Fiyat bilgisi hazırlanıyor';
}
function displaySpecValue(key, value) {
  if (value === null || value === undefined || value === '') return '';
  if (key.endsWith('_gb') || key === 'capacity_gb' || key === 'memory_gb' || key === 'storage_gb') {
    const amount = Number(value);
    if (Number.isFinite(amount)) return amount >= 1000 && amount % 1000 === 0 ? `${amount / 1000} TB` : `${amount} GB`;
  }
  if (key.endsWith('_mts')) return `${value} MT/s`;
  if (key.endsWith('_w')) return `${value} W`;
  if (key.endsWith('_mm')) return `${value} mm`;
  if (key.endsWith('_hz')) return `${value} Hz`;
  if (key.endsWith('_in')) return `${value} inç`;
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}
function labelForSpec(key) {
  return specLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toLocaleUpperCase('tr-TR'));
}
function renderProductSpecs(product) {
  const rows = Object.entries(product.attributes || {}).filter(([, value]) => value !== null && value !== undefined && value !== '');
  const list = document.getElementById('productSpecs');
  list.replaceChildren(...rows.map(([key, value]) => {
    const row = document.createElement('div'); row.className = 'product-spec-row';
    const label = document.createElement('dt'); label.textContent = labelForSpec(key);
    const detail = document.createElement('dd'); detail.textContent = displaySpecValue(key, value);
    row.append(label, detail); return row;
  }));
  document.getElementById('productSpecCount').textContent = rows.length ? `${rows.length} özellik` : '';
  document.getElementById('productNoSpecs').hidden = rows.length > 0;
}
function setMeta(selector, attribute, value) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attribute, value);
}
function setStructuredData(product) {
  const data = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name,
    description: product.description || product.name, category: detailCategoryNames[product.categoryId] || product.categoryId,
    ...(product.sku ? { sku: product.sku } : {}), ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(safeProductImage(product.image) ? { image: new URL(product.image, location.href).href } : {}),
    ...(Number.isFinite(product.price) ? { offers: {
      '@type': 'Offer', price: product.price, priceCurrency: /^[A-Z]{3}$/.test(product.currency || '') ? product.currency : 'TRY',
      url: new URL(`urun.html?slug=${encodeURIComponent(product.slug || '')}`, 'https://www.tezcanbilgisayar.com/').href,
      ...(product.stock !== null && product.stock !== undefined && product.stock !== '' ? { availability: Number(product.stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } : {})
    } } : {})
  };
  const script = document.createElement('script'); script.type = 'application/ld+json'; script.id = 'productStructuredData'; script.textContent = JSON.stringify(data);
  document.getElementById('productStructuredData')?.remove(); document.head.append(script);
}
function renderRelatedProducts(product, products) {
  const related = products.filter(item => item.id !== product.id && item.categoryId === product.categoryId && item.status === 'active').slice(0, 4);
  const section = document.getElementById('relatedProductsSection');
  section.hidden = !related.length;
  if (!related.length) return;
  const categoryHref = `bilgisayar-parcalari.html?category=${encodeURIComponent(product.categoryId)}`;
  document.getElementById('relatedCategoryLink').href = categoryHref;
  const icons = detailCategoryIcons;
  document.getElementById('relatedProducts').replaceChildren(...related.map(item => {
    const link = document.createElement('a'); link.className = 'related-product-card'; link.href = `urun.html?slug=${encodeURIComponent(item.slug || '')}`;
    const icon = document.createElement('span'); icon.className = 'related-product-icon';
    const glyph = document.createElement('i'); glyph.className = `fa-solid ${icons[item.categoryId] || 'fa-box'}`; glyph.setAttribute('aria-hidden', 'true'); icon.append(glyph);
    const copy = document.createElement('span'); copy.className = 'related-product-copy';
    const name = document.createElement('strong'); name.textContent = item.name;
    const price = document.createElement('small'); price.textContent = formatPrice(item);
    copy.append(name, price); link.append(icon, copy); return link;
  }));
}
function renderProduct(product, products) {
  currentProduct = product;
  detailCatalogProducts = products;
  const categoryName = detailCategoryNames[product.categoryId] || 'Ürün';
  document.getElementById('productBreadcrumb').textContent = product.name;
  document.getElementById('productBrand').textContent = product.brand || categoryName;
  document.getElementById('productCategory').textContent = categoryName;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productModel').textContent = product.model ? `Model: ${product.model}` : '';
  document.getElementById('productModel').hidden = !product.model;
  document.getElementById('productDescription').textContent = product.description || 'Bu ürün için açıklama henüz eklenmemiş.';
  document.getElementById('productPrice').textContent = formatPrice(product);
  const stock = document.getElementById('productStock');
  if (product.stock !== null && product.stock !== undefined && product.stock !== '' && Number.isFinite(Number(product.stock))) {
    if (Number(product.stock) > 0) { stock.className = 'in-stock'; stock.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Stokta'; }
    else { stock.className = 'out-of-stock'; stock.innerHTML = '<i class="fa-solid fa-circle-info" aria-hidden="true"></i> Stokta yok'; }
  } else { stock.className = ''; stock.innerHTML = '<i class="fa-regular fa-clock" aria-hidden="true"></i> Stok bilgisi hazırlanıyor'; }
  document.getElementById('productSku').textContent = product.sku || 'Belirtilmemiş';
  document.getElementById('productBrandReference').textContent = product.brand || '—';
  document.getElementById('productCategoryReference').textContent = categoryName;
  const fallbackIcon = document.getElementById('productFallbackIcon');
  fallbackIcon.className = `fa-solid ${detailCategoryIcons[product.categoryId] || 'fa-box'}`;
  if (safeProductImage(product.image)) {
    const image = document.createElement('img'); image.src = product.image; image.alt = product.name; image.loading = 'eager';
    image.addEventListener('error', () => image.replaceWith(fallbackIcon), { once: true });
    document.getElementById('productImageFrame').replaceChildren(image);
  }
  renderProductSpecs(product);
  renderRelatedProducts(product, products);
  renderFavoriteButton();
  renderProductCompareButton();
  const title = `${product.name} özellikleri ve ürün bilgileri | Tezcan Bilgisayar`;
  const description = `${product.name}${product.description ? ` — ${product.description}` : ''}. Teknik özellikleri ve ürün bilgilerini Tezcan Bilgisayar'da inceleyin.`.slice(0, 300);
  const canonical = new URL(`urun.html?slug=${encodeURIComponent(product.slug || '')}`, 'https://www.tezcanbilgisayar.com/').href;
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title); setMeta('meta[property="og:description"]', 'content', description); setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[name="twitter:title"]', 'content', title); setMeta('meta[name="twitter:description"]', 'content', description);
  if (safeProductImage(product.image)) {
    const imageUrl = new URL(product.image, location.href).href;
    setMeta('meta[property="og:image"]', 'content', imageUrl); setMeta('meta[name="twitter:image"]', 'content', imageUrl);
  }
  const canonicalLink = document.querySelector('link[rel="canonical"]'); if (canonicalLink) canonicalLink.href = canonical;
  setStructuredData(product);
  productLoading.hidden = true; productNotFound.hidden = true; productDetailRoot.hidden = false;
}
async function loadProduct() {
  if (!requestedSlug || requestedSlug.length > 180) { productLoading.hidden = true; productNotFound.hidden = false; return; }
  let bundledProducts = [];
  try {
    const response = await fetch('assets/data/builder-products.json', { cache: 'no-store' });
    if (response.ok) bundledProducts = (await response.json()).products || [];
  } catch {}
  try {
    const response = await fetch('assets/data/catalog.json', { cache: 'no-store' });
    if (response.ok) bundledProducts = [...bundledProducts, ...((await response.json()).products || [])];
  } catch {}
  const bundledRow = bundledProducts.find(item => item.slug === requestedSlug && item.status === 'active');
  let liveProduct = null;
  if (detailClient) {
    try {
      const { data, error } = await detailClient.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,attributes,search_terms').eq('slug', requestedSlug).eq('status', 'active').maybeSingle();
      if (!error && data) liveProduct = normalizeDetailProduct(data);
    } catch {}
  }
  const product = liveProduct && bundledRow
    ? { ...normalizeDetailProduct(bundledRow, 'bundle'), ...liveProduct, attributes: { ...bundledRow.attributes, ...liveProduct.attributes } }
    : liveProduct || (bundledRow ? normalizeDetailProduct(bundledRow, 'bundle') : null);
  if (!product) { productLoading.hidden = true; productNotFound.hidden = false; return; }
  const related = bundledProducts.map(item => normalizeDetailProduct(item, 'bundle'));
  if (liveProduct) related.push(liveProduct);
  renderProduct(product, related);
}

productFavoriteButton.addEventListener('click', () => {
  if (!currentProduct) return;
  detailFavorites = detailFavorites.includes(currentProduct.id)
    ? detailFavorites.filter(id => id !== currentProduct.id) : [...detailFavorites, currentProduct.id];
  writeFavoriteIds();
});
productCompareButton.addEventListener('click', () => {
  if (!currentProduct) return;
  let ids = readComparedIds();
  if (ids.includes(currentProduct.id)) ids = ids.filter(id => id !== currentProduct.id);
  else {
    const selected = ids.map(id => detailCatalogProducts.find(item => item.id === id)).filter(Boolean);
    ids = selected.map(item => item.id);
    if (selected.length >= 3 || selected.some(item => item.categoryId !== currentProduct.categoryId)) { renderProductCompareButton(); return; }
    ids = [...ids, currentProduct.id];
  }
  try { localStorage.setItem(compareStorageKey, JSON.stringify(ids)); } catch {}
  renderProductCompareButton();
});
document.getElementById('productShare').addEventListener('click', async event => {
  const button = event.currentTarget;
  const original = button.innerHTML;
  try {
    if (navigator.share) await navigator.share({ title: document.title, url: location.href });
    else { await navigator.clipboard.writeText(location.href); button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i><span>Bağlantı kopyalandı</span>'; setTimeout(() => { button.innerHTML = original; }, 1800); }
  } catch {}
});
document.getElementById('currentYear').textContent = String(new Date().getFullYear());
window.addEventListener('storage', event => { if (event.key === compareStorageKey) renderProductCompareButton(); });
if (detailClient) {
  detailClient.auth.getSession().then(({ data }) => activateFavoriteAccount(data?.session?.user || null)).catch(() => activateFavoriteAccount(null));
  detailClient.auth.onAuthStateChange((_event, session) => setTimeout(() => activateFavoriteAccount(session?.user || null), 0));
} else activateFavoriteAccount(null);
loadProduct();
