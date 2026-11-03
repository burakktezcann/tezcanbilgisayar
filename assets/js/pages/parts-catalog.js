const partsGrid = document.getElementById('partsProductGrid');
const partsEmpty = document.getElementById('partsEmpty');
const partsQuery = document.getElementById('searchInput') || document.getElementById('partsQuery');
const partsSort = document.getElementById('partsSort');
const partsCount = document.getElementById('partsResultCount');
const partsPagination = document.getElementById('partsPagination');
const partsCategoryNav = document.getElementById('partsCategories');
const partsFilterFields = document.getElementById('partsFilterFields');
const partsFavoriteCount = document.getElementById('partsFavoriteCount');
const partsCompareTray = document.getElementById('partsCompareTray');
const partsTitle = document.getElementById('partsPageTitle');
const partsBreadcrumb = document.getElementById('partsBreadcrumb');
const componentPartIds = ['cpu', 'motherboard', 'ram', 'gpu', 'disk', 'case', 'cooling', 'psu'];
const otherProductCategories = ['computers', 'peripherals', 'gaming', 'networking', 'office', 'accessories', 'software'];
const partsCategoryIds = [...componentPartIds, ...otherProductCategories];
const guestFavoriteKey = 'tezcan-product-favorites';
const compareStorageKey = 'tezcan-product-compare';
const partsConfig = window.SUPABASE_CONFIG || {};
const partsClient = partsConfig.url && partsConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(partsConfig.url, partsConfig.publishableKey) : null;
const partsCategoryNames = {
  cpu: 'İşlemci', motherboard: 'Anakart', ram: 'RAM', gpu: 'Ekran Kartı', disk: 'Depolama',
  case: 'Kasa', cooling: 'Soğutucu', psu: 'Güç Kaynağı', computers: 'Bilgisayar',
  peripherals: 'Çevre Birimi', gaming: 'Oyun ve Hobi', networking: 'Network', office: 'Ofis Ürünü',
  accessories: 'Aksesuar', software: 'Yazılım'
};
const partsCategoryPluralNames = {
  cpu: 'İşlemciler', motherboard: 'Anakartlar', ram: 'RAM', gpu: 'Ekran Kartları', disk: 'Depolama',
  case: 'Kasalar', cooling: 'Soğutucular', psu: 'Güç Kaynakları', computers: 'Bilgisayar',
  peripherals: 'Çevre Birimleri', gaming: 'Oyun ve Hobi', networking: 'Network', office: 'Ofis Ürünleri',
  accessories: 'Aksesuarlar', software: 'Yazılım'
};
const partsIcons = {
  cpu: 'fa-microchip', motherboard: 'fa-chess-board', ram: 'fa-memory', gpu: 'fa-display',
  disk: 'fa-hard-drive', case: 'fa-server', cooling: 'fa-fan', psu: 'fa-bolt',
  computers: 'fa-laptop', peripherals: 'fa-keyboard', gaming: 'fa-gamepad', networking: 'fa-wifi',
  office: 'fa-print', accessories: 'fa-plug', software: 'fa-gear'
};
const facetsByCategory = {
  cpu: [['brand', 'Marka'], ['attributes.family', 'İşlemci serisi'], ['attributes.socket', 'Soket tipi']],
  motherboard: [['brand', 'Marka'], ['attributes.socket', 'İşlemci soketi'], ['attributes.chipset', 'Yonga seti'], ['attributes.memory_type', 'Bellek türü'], ['attributes.form_factor', 'Anakart boyutu']],
  ram: [['brand', 'Marka'], ['attributes.capacity_gb', 'Kapasite'], ['attributes.memory_type', 'Bellek türü'], ['attributes.speed_mts', 'Bellek hızı'], ['attributes.cas_latency', 'Gecikme değeri']],
  gpu: [['brand', 'Marka'], ['attributes.gpu_chip', 'Grafik işlemci'], ['attributes.memory_type', 'Bellek türü'], ['attributes.memory_gb', 'Ekran kartı belleği'], ['attributes.series', 'Seri']],
  disk: [['brand', 'Marka'], ['attributes.drive_type', 'Depolama türü'], ['attributes.capacity_gb', 'Kapasite'], ['attributes.interface', 'Bağlantı']],
  case: [['brand', 'Marka'], ['attributes.form_factor', 'Kasa boyutu'], ['attributes.board_support', 'Anakart desteği']],
  cooling: [['brand', 'Marka'], ['attributes.cooler_type', 'Soğutma türü'], ['attributes.socket_support', 'Soket desteği']],
  psu: [['brand', 'Marka'], ['attributes.power_w', 'Güç kapasitesi'], ['attributes.efficiency', 'Verimlilik'], ['attributes.modular', 'Kablo yapısı'], ['attributes.form_factor', 'Güç kaynağı boyutu']],
  computers: [['brand', 'Marka'], ['attributes.device_type', 'Bilgisayar türü'], ['attributes.processor', 'İşlemci'], ['attributes.memory_gb', 'Bellek'], ['attributes.storage_gb', 'Depolama']],
  peripherals: [['brand', 'Marka'], ['attributes.device_type', 'Ürün türü'], ['attributes.connection', 'Bağlantı'], ['attributes.screen_size_in', 'Ekran boyutu'], ['attributes.refresh_rate_hz', 'Yenileme hızı']],
  gaming: [['brand', 'Marka'], ['attributes.device_type', 'Ürün türü'], ['attributes.platform', 'Platform'], ['attributes.connection', 'Bağlantı']],
  networking: [['brand', 'Marka'], ['attributes.device_type', 'Ürün türü'], ['attributes.wifi_standard', 'Wi-Fi standardı'], ['attributes.speed_mbps', 'Ağ hızı']],
  office: [['brand', 'Marka'], ['attributes.device_type', 'Ürün türü'], ['attributes.print_type', 'Baskı teknolojisi'], ['attributes.connectivity', 'Bağlantı']],
  accessories: [['brand', 'Marka'], ['attributes.device_type', 'Ürün türü'], ['attributes.interface', 'Bağlantı']],
  software: [['brand', 'Marka'], ['attributes.software_type', 'Yazılım türü'], ['attributes.license_type', 'Lisans türü']]
};
const requestedCategory = new URLSearchParams(location.search).get('category') || 'components';
let selectedPartCategory = ['components', ...partsCategoryIds].includes(requestedCategory) ? requestedCategory : 'components';
let allParts = [];
let favorites = [];
let favoriteKey = guestFavoriteKey;
let currentUser = null;
let remoteFavorites = new Set();
let favoriteCloudReady = false;
let favoriteSyncTimer = 0;
let selectedFacets = new Map();
const PARTS_PAGE_SIZE = 12;
let partsCurrentPage = 1;
let partsResultSignature = '';
let comparedProductIds = readIds(compareStorageKey);

function readIds(key) { return window.TezcanCatalogUtils.readStringIds(key); }
function saveFavorites() {
  try { localStorage.setItem(favoriteKey, JSON.stringify(favorites)); } catch {}
  partsFavoriteCount.textContent = String(favorites.length);
  if (favoriteCloudReady) { clearTimeout(favoriteSyncTimer); favoriteSyncTimer = setTimeout(syncFavoriteRows, 350); }
}
async function syncFavoriteRows() {
  if (!favoriteCloudReady || !currentUser || !partsClient) return;
  const desired = new Set(favorites);
  const remove = [...remoteFavorites].filter(id => !desired.has(id));
  const add = [...desired].filter(id => !remoteFavorites.has(id));
  try {
    if (remove.length) {
      const { error } = await partsClient.from('customer_favorites').delete().eq('user_id', currentUser.id).in('product_id', remove);
      if (error) throw error;
    }
    if (add.length) {
      const { error } = await partsClient.from('customer_favorites').upsert(add.map(product_id => ({ user_id: currentUser.id, product_id })), { onConflict: 'user_id,product_id', ignoreDuplicates: true });
      if (error) throw error;
    }
    remoteFavorites = desired;
  } catch (error) { console.warn('Favoriler hesaba eşitlenemedi:', error); favoriteCloudReady = false; }
}
async function activateFavoriteUser(user) {
  currentUser = user || null; favoriteCloudReady = false; remoteFavorites = new Set();
  if (!user) { favoriteKey = guestFavoriteKey; favorites = readIds(favoriteKey); saveFavorites(); return; }
  favoriteKey = `${guestFavoriteKey}-user-${user.id}`;
  const hasAccountFavorites = localStorage.getItem(favoriteKey) !== null;
  const accountFavorites = readIds(favoriteKey);
  const guestFavorites = readIds(guestFavoriteKey);
  try {
    const { data, error } = await partsClient.from('customer_favorites').select('product_id').order('created_at');
    if (error) throw error;
    remoteFavorites = new Set((data || []).map(row => row.product_id));
    favorites = [...new Set([...remoteFavorites, ...accountFavorites])];
    const owner = localStorage.getItem(`${guestFavoriteKey}-guest-owner`);
    if ((!owner || owner === user.id) && !hasAccountFavorites) {
      favorites = [...new Set([...favorites, ...guestFavorites])];
      if (guestFavorites.length) localStorage.setItem(`${guestFavoriteKey}-guest-owner`, user.id);
    }
    favoriteCloudReady = true; saveFavorites();
  } catch (error) {
    console.warn('Favoriler hesaba alınamadı:', error);
    const owner = localStorage.getItem(`${guestFavoriteKey}-guest-owner`);
    favorites = hasAccountFavorites ? accountFavorites : (!owner || owner === user.id ? guestFavorites : []);
    saveFavorites();
  }
}
function normalizeProducts(rows, source = 'db') {
  return (rows || []).map(row => ({
    id: row.id, slug: row.slug, categoryId: source === 'db' ? row.category_id : row.categoryId,
    name: row.name, description: row.description || '', brand: row.brand || '', model: row.model || '', sku: row.sku || '',
    image: source === 'db' ? row.image_path : row.image,
    price: row.price === null || row.price === undefined ? null : Number(row.price), currency: row.currency || 'TRY',
    stock: row.stock, status: row.status, attributes: row.attributes || {}, searchTerms: row.search_terms || row.searchTerms || []
  })).filter(row => row.status === 'active' && partsCategoryIds.includes(row.categoryId));
}
async function loadParts() {
  let live = [];
  if (partsClient) {
    try {
      const { data, error } = await partsClient.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,attributes,search_terms').eq('status', 'active').in('category_id', partsCategoryIds).order('sort_order');
      if (!error && data) live = normalizeProducts(data);
    } catch {}
  }
  let bundled = [];
  try {
    const response = await fetch('assets/data/builder-products.json', { cache: 'no-store' });
    if (response.ok) bundled = normalizeProducts((await response.json()).products, 'bundle');
  } catch {}
  const bundledBySlug = new Map(bundled.map(item => [item.slug, item]));
  const slugs = new Set(live.map(item => item.slug).filter(Boolean));
  const enrichedLive = live.map(item => {
    const bundledItem = bundledBySlug.get(item.slug);
    return bundledItem ? { ...bundledItem, ...item, attributes: { ...bundledItem.attributes, ...item.attributes } } : item;
  });
  allParts = [...enrichedLive, ...bundled.filter(item => !item.slug || !slugs.has(item.slug))];
  renderCategoryButtons(); renderPageHeading(); renderFilters(); renderParts();
}
function renderCategoryButtons() {
  const categories = [{ id: 'components', label: 'Tüm Parçalar', icon: 'fa-layer-group' }, ...componentPartIds.map(id => ({ id, label: partsCategoryPluralNames[id], icon: partsIcons[id] }))];
  partsCategoryNav.replaceChildren(...categories.map(category => {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.partCategory = category.id;
    button.setAttribute('aria-pressed', String(selectedPartCategory === category.id));
    const icon = document.createElement('i'); icon.className = `fa-solid ${category.icon}`; icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span'); label.textContent = category.label;
    button.append(icon, label); return button;
  }));
}
function renderPageHeading() {
  const isComponents = selectedPartCategory === 'components';
  const title = isComponents ? 'Bilgisayar Parçaları' : (partsCategoryPluralNames[selectedPartCategory] || 'Bilgisayar Parçaları');
  partsTitle.replaceChildren(document.createTextNode(isComponents ? 'Bilgisayar ' : ''), (() => { const span = document.createElement('span'); span.textContent = isComponents ? 'Parçaları' : title; return span; })());
  partsBreadcrumb.textContent = isComponents ? 'Bilgisayar Parçaları' : title;
  document.getElementById('partsPageDescription').textContent = isComponents
    ? 'İşlemci, anakart, bellek, ekran kartı ve diğer bileşenleri özelliklerine göre filtrele.'
    : `${title} modellerini teknik özelliklerine göre filtrele ve karşılaştır.`;
}
function categoryProducts() {
  return allParts.filter(item => selectedPartCategory === 'components'
    ? componentPartIds.includes(item.categoryId)
    : item.categoryId === selectedPartCategory);
}
function valueAt(product, path) {
  return path.split('.').reduce((value, key) => value?.[key], product);
}
function facetLabel(value, key) {
  if (key.endsWith('capacity_gb') || key.endsWith('memory_gb')) return `${Number(value) >= 1000 ? `${Number(value) / 1000} TB` : `${value} GB`}`;
  if (key.endsWith('speed_mts')) return `${value} MT/s`;
  if (key.endsWith('_w')) return `${value} W`;
  if (key.endsWith('_hz')) return `${value} Hz`;
  if (key.endsWith('_in')) return `${value} inç`;
  return String(value);
}
function facetToken(value) { return String(value).trim(); }
function addFacetGroup(container, key, label, options) {
  if (!options.length) return;
  const fieldset = document.createElement('fieldset'); fieldset.className = 'parts-filter-group';
  const legend = document.createElement('legend'); legend.textContent = label; fieldset.append(legend);
  const list = document.createElement('div'); list.className = 'parts-filter-options';
  options.forEach(option => {
    const row = document.createElement('label'); row.className = 'parts-filter-option';
    const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.facet = key; input.value = facetToken(option.value);
    input.checked = selectedFacets.get(key)?.has(input.value) || false;
    const text = document.createElement('span'); text.textContent = facetLabel(option.value, key);
    const count = document.createElement('small'); count.textContent = String(option.count);
    row.append(input, text, count); list.append(row);
  });
  fieldset.append(list); container.append(fieldset);
}
function renderFilters() {
  const category = categoryProducts();
  partsFilterFields.replaceChildren();
  if (selectedPartCategory === 'components') {
    const note = document.createElement('p'); note.className = 'parts-filter-hint'; note.textContent = 'Özellik filtrelerini görmek için yukarıdan bir parça türü seç.'; partsFilterFields.append(note);
  } else {
    const definitions = facetsByCategory[selectedPartCategory] || [];
    definitions.forEach(([key, label]) => {
      const counts = new Map();
      category.forEach(product => {
        const value = valueAt(product, key);
        if (value === null || value === undefined || value === '') return;
        const values = Array.isArray(value) ? value : String(value).split(/[,;|]+/).map(part => part.trim()).filter(Boolean);
        values.forEach(item => { const token = facetToken(item); counts.set(token, (counts.get(token) || 0) + 1); });
      });
      const options = [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => {
        const aNum = Number(a.value), bNum = Number(b.value);
        return Number.isFinite(aNum) && Number.isFinite(bNum) ? aNum - bNum : a.value.localeCompare(b.value, 'tr');
      });
      addFacetGroup(partsFilterFields, key, label, options);
    });
  }
  const priced = category.filter(product => Number.isFinite(product.price));
  if (priced.length) {
    const min = Math.min(...priced.map(product => product.price)); const max = Math.max(...priced.map(product => product.price));
    const group = document.createElement('fieldset'); group.className = 'parts-filter-group';
    const legend = document.createElement('legend'); legend.textContent = 'Fiyat aralığı'; group.append(legend);
    const range = document.createElement('div'); range.className = 'parts-price-range';
    [['partsMinPrice', 'En az', min], ['partsMaxPrice', 'En fazla', max]].forEach(([id, label, value]) => {
      const wrapper = document.createElement('label'); wrapper.textContent = label;
      const input = document.createElement('input'); input.type = 'number'; input.id = id; input.min = '0'; input.placeholder = String(Math.round(value)); input.value = selectedFacets.get(id)?.[0] || ''; wrapper.append(input); range.append(wrapper);
    });
    group.append(range); partsFilterFields.append(group);
  }
  if (category.some(product => Number.isFinite(product.stock))) {
    const group = document.createElement('label'); group.className = 'parts-filter-option parts-stock-filter';
    const input = document.createElement('input'); input.type = 'checkbox'; input.id = 'partsInStock'; input.checked = selectedFacets.has('inStock');
    const text = document.createElement('span'); text.textContent = 'Stokta olanlar'; group.append(input, text); partsFilterFields.prepend(group);
  }
  if (!partsFilterFields.children.length) {
    const note = document.createElement('p'); note.className = 'parts-filter-hint'; note.textContent = 'Bu kategoride henüz filtrelenebilir teknik özellik girilmemiş.'; partsFilterFields.append(note);
  }
}
function displayPrice(product) { return window.TezcanCatalogUtils.formatCurrency(product.price, product.currency); }
function comparedProducts() { return comparedProductIds.map(id => allParts.find(item => item.id === id)).filter(Boolean); }
function saveComparedProducts() {
  try { localStorage.setItem(compareStorageKey, JSON.stringify(comparedProductIds)); } catch {}
  renderCompareTray();
}
function renderCompareTray() {
  if (!partsCompareTray) return;
  let products = comparedProducts();
  if (products.length !== comparedProductIds.length) {
    comparedProductIds = products.map(item => item.id);
    try { localStorage.setItem(compareStorageKey, JSON.stringify(comparedProductIds)); } catch {}
  }
  if (products.length && products.some(item => item.categoryId !== products[0].categoryId)) {
    products = products.filter(item => item.categoryId === products[0].categoryId);
    comparedProductIds = products.map(item => item.id);
    try { localStorage.setItem(compareStorageKey, JSON.stringify(comparedProductIds)); } catch {}
  }
  partsCompareTray.hidden = products.length === 0;
  if (!products.length) {
    const toolbarLink = document.getElementById('partsCompareToolbarLink');
    document.getElementById('partsCompareToolbarCount').textContent = '0';
    toolbarLink.setAttribute('aria-disabled', 'true'); toolbarLink.tabIndex = -1; toolbarLink.href = '#partsProductGrid';
    return;
  }
  const count = products.length;
  document.getElementById('partsCompareCount').textContent = `${count} ürün seçildi`;
  document.getElementById('partsCompareHint').textContent = count < 2
    ? 'Karşılaştırmak için aynı kategoriden en az 2 ürün seç.'
    : `${partsCategoryPluralNames[products[0].categoryId] || 'Ürünler'} yan yana incelenmeye hazır.`;
  const openLink = document.getElementById('openComparePage');
  const readyToCompare = count >= 2;
  openLink.setAttribute('aria-disabled', String(!readyToCompare));
  openLink.tabIndex = readyToCompare ? 0 : -1;
  openLink.href = readyToCompare ? 'karsilastir.html' : '#partsProductGrid';
  const toolbarLink = document.getElementById('partsCompareToolbarLink');
  const toolbarCount = document.getElementById('partsCompareToolbarCount');
  toolbarCount.textContent = String(count);
  toolbarLink.setAttribute('aria-disabled', String(!readyToCompare));
  toolbarLink.tabIndex = readyToCompare ? 0 : -1;
  toolbarLink.href = readyToCompare ? 'karsilastir.html' : '#partsProductGrid';
}
function productSpecifications(product) {
  const specs = product.attributes || {};
  const keys = {
    cpu: [['family', 'Seri'], ['socket', 'Soket']],
    motherboard: [['socket', 'Soket'], ['chipset', 'Yonga seti'], ['memory_type', 'Bellek']],
    ram: [['capacity_gb', 'Kapasite', 'GB'], ['memory_type', 'Tür'], ['speed_mts', 'Hız', 'MT/s'], ['cas_latency', 'CL']],
    gpu: [['gpu_chip', 'Grafik işlemci'], ['memory_gb', 'Bellek', 'GB'], ['memory_type', 'Bellek türü']],
    disk: [['drive_type', 'Tür'], ['capacity_gb', 'Kapasite', 'GB'], ['interface', 'Bağlantı']],
    case: [['form_factor', 'Boyut'], ['board_support', 'Anakart']],
    cooling: [['cooler_type', 'Soğutma'], ['socket_support', 'Soket']],
    psu: [['power_w', 'Güç', 'W'], ['efficiency', 'Verimlilik']]
  }[product.categoryId] || [];
  return keys.map(([key, label, unit]) => {
    const value = specs[key];
    return value === undefined || value === null || value === '' ? null : `${label}: ${value}${unit ? ` ${unit}` : ''}`;
  }).filter(Boolean).slice(0, 3);
}
function imageAllowed(path) { return window.TezcanCatalogUtils.validImagePath(path); }
function iconFor(item) {
  const icon = document.createElement('i'); icon.className = `fa-solid ${partsIcons[item.categoryId] || 'fa-box'}`; icon.setAttribute('aria-hidden', 'true'); return icon;
}
function matchesFacets(product) {
  for (const [key, selected] of selectedFacets) {
    if (key === 'inStock') { if (!(Number(product.stock) > 0)) return false; continue; }
    if (key === 'partsMinPrice') { if (!Number.isFinite(product.price) || product.price < Number(selected[0])) return false; continue; }
    if (key === 'partsMaxPrice') { if (!Number.isFinite(product.price) || product.price > Number(selected[0])) return false; continue; }
    const value = valueAt(product, key);
    const productValues = Array.isArray(value) ? value.map(facetToken) : String(value ?? '').split(/[,;|]+/).map(facetToken);
    if (![...selected].some(item => productValues.includes(item))) return false;
  }
  return true;
}
function renderPartsPagination(total, totalPages, startIndex, endIndex) {
  if (!partsPagination) return;
  partsPagination.replaceChildren();
  partsPagination.hidden = totalPages <= 1;
  if (totalPages <= 1) return;
  const makeButton = (label, page, options = {}) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'parts-page-button'; button.textContent = label;
    button.dataset.page = String(page); button.disabled = Boolean(options.disabled);
    if (options.current) { button.classList.add('is-current'); button.setAttribute('aria-current', 'page'); }
    button.setAttribute('aria-label', options.label || `Sayfa ${page}`);
    partsPagination.append(button);
  };
  const summary = document.createElement('span'); summary.className = 'parts-page-summary';
  summary.textContent = `${startIndex + 1}–${endIndex} / ${total} ürün`;
  partsPagination.append(summary);
  makeButton('‹', Math.max(1, partsCurrentPage - 1), { disabled: partsCurrentPage === 1, label: 'Önceki sayfa' });
  const pages = [...new Set([1, partsCurrentPage - 1, partsCurrentPage, partsCurrentPage + 1, totalPages])].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  let previous = 0;
  for (const page of pages) {
    if (previous && page - previous > 1) {
      const dots = document.createElement('span'); dots.className = 'parts-page-dots'; dots.textContent = '…'; partsPagination.append(dots);
    }
    makeButton(String(page), page, { current: page === partsCurrentPage }); previous = page;
  }
  makeButton('›', Math.min(totalPages, partsCurrentPage + 1), { disabled: partsCurrentPage === totalPages, label: 'Sonraki sayfa' });
}

function renderParts() {
  const query = partsQuery.value.trim().toLocaleLowerCase('tr-TR');
  const signature = JSON.stringify({ category: selectedPartCategory, query, sort: partsSort.value, facets: [...selectedFacets].map(([key, values]) => [key, [...values].sort()]) });
  if (signature !== partsResultSignature) { partsCurrentPage = 1; partsResultSignature = signature; }
  let rows = categoryProducts().filter(item => `${item.name} ${item.brand} ${item.model} ${item.sku} ${item.description} ${item.searchTerms.join(' ')} ${JSON.stringify(item.attributes)}`.toLocaleLowerCase('tr-TR').includes(query) && matchesFacets(item));
  if (partsSort.value === 'name') rows.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  if (partsSort.value === 'price') rows.sort((a, b) => (Number.isFinite(b.price) ? 1 : 0) - (Number.isFinite(a.price) ? 1 : 0) || (a.price ?? Infinity) - (b.price ?? Infinity));
  const totalPages = Math.max(1, Math.ceil(rows.length / PARTS_PAGE_SIZE));
  partsCurrentPage = Math.min(partsCurrentPage, totalPages);
  const startIndex = (partsCurrentPage - 1) * PARTS_PAGE_SIZE;
  const pageRows = rows.slice(startIndex, startIndex + PARTS_PAGE_SIZE);
  partsCount.textContent = rows.length ? `${startIndex + 1}–${Math.min(startIndex + PARTS_PAGE_SIZE, rows.length)} / ${rows.length} ürün` : '0 ürün';
  renderPartsPagination(rows.length, totalPages, startIndex, Math.min(startIndex + PARTS_PAGE_SIZE, rows.length));
  partsGrid.replaceChildren(...pageRows.map(item => {
    const card = document.createElement('article'); card.className = 'parts-product-card';
    const art = document.createElement('div'); art.className = 'parts-product-art';
    const detailUrl = `urun.html?slug=${encodeURIComponent(item.slug || '')}`;
    const imageLink = document.createElement('a'); imageLink.className = 'parts-product-image-link'; imageLink.href = detailUrl; imageLink.setAttribute('aria-label', `${item.name} ürün ayrıntıları`);
    const imagePath = imageAllowed(item.image) ? item.image : '';
    if (imagePath) {
      const image = document.createElement('img'); image.src = imagePath; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
      image.addEventListener('error', () => image.replaceWith(iconFor(item)), { once: true }); imageLink.append(image);
    } else imageLink.append(iconFor(item));
    art.append(imageLink);
    const heart = document.createElement('button'); heart.type = 'button'; heart.className = 'parts-product-heart'; heart.dataset.favoriteId = item.id;
    heart.setAttribute('aria-pressed', String(favorites.includes(item.id)));
    heart.setAttribute('aria-label', favorites.includes(item.id) ? `${item.name} favorilerden çıkar` : `${item.name} favorilere ekle`);
    heart.innerHTML = `<i class="fa-${favorites.includes(item.id) ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>`; art.append(heart);
    const body = document.createElement('div'); body.className = 'parts-product-copy';
    const brand = document.createElement('span'); brand.className = 'parts-product-brand'; brand.textContent = item.brand || 'Bilgisayar parçası';
    const title = document.createElement('h2');
    const titleLink = document.createElement('a'); titleLink.className = 'parts-product-detail-link'; titleLink.href = detailUrl; titleLink.textContent = item.name; title.append(titleLink);
    const detail = document.createElement('p'); detail.textContent = item.description || item.model || '';
    const specs = document.createElement('ul'); specs.className = 'parts-product-specs';
    productSpecifications(item).forEach(value => { const line = document.createElement('li'); line.textContent = value; specs.append(line); });
    specs.hidden = !specs.children.length;
    const category = document.createElement('span'); category.className = 'parts-product-category'; category.textContent = partsCategoryNames[item.categoryId] || 'Parça';
    const more = document.createElement('a'); more.className = 'parts-product-more'; more.href = detailUrl; more.innerHTML = 'Ürün ayrıntıları <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    const shoppingButton = document.createElement('button'); shoppingButton.type = 'button'; shoppingButton.className = 'parts-add-shopping-cart'; shoppingButton.dataset.addShoppingCart = item.id;
    shoppingButton.innerHTML = '<i class="fa-solid fa-cart-plus" aria-hidden="true"></i><span>Sepete ekle</span>';
    if (item.stock === 0) { shoppingButton.disabled = true; shoppingButton.title = 'Stokta bulunmuyor'; }
    const compareButton = document.createElement('button'); compareButton.type = 'button'; compareButton.className = 'parts-product-compare';
    compareButton.dataset.compareId = item.id; compareButton.dataset.compareCategory = item.categoryId; compareButton.setAttribute('aria-pressed', 'false');
    const price = document.createElement('strong'); price.className = 'parts-product-price'; price.textContent = displayPrice(item);
    body.append(brand, title, detail, specs, category, price, shoppingButton, compareButton, more); card.append(art, body); return card;
  }));
  partsGrid.querySelectorAll('[data-compare-id]').forEach(button => {
    const selected = comparedProductIds.includes(button.dataset.compareId);
    const selectedProducts = comparedProducts();
    const categoryMismatch = selectedProducts.length > 0 && !selected && selectedProducts[0].categoryId !== button.dataset.compareCategory;
    const maxReached = selectedProducts.length >= 3 && !selected;
    button.setAttribute('aria-pressed', String(selected));
    button.disabled = categoryMismatch || maxReached;
    button.title = categoryMismatch ? 'Yalnızca aynı kategorideki ürünler karşılaştırılabilir.' : maxReached ? 'En fazla üç ürün karşılaştırabilirsin.' : '';
    button.innerHTML = `<i class="fa-solid ${selected ? 'fa-check' : 'fa-scale-balanced'}" aria-hidden="true"></i><span>${selected ? 'Karşılaştırmada' : 'Karşılaştır'}</span>`;
  });
  partsEmpty.hidden = rows.length > 0;
  partsGrid.hidden = rows.length === 0;
  renderCompareTray();
}
partsPagination?.addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (!button || button.disabled) return;
  partsCurrentPage = Number(button.dataset.page);
  renderParts();
  partsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
partsCategoryNav.addEventListener('click', event => {
  const button = event.target.closest('[data-part-category]'); if (!button) return;
  selectedPartCategory = button.dataset.partCategory; selectedFacets.clear();
  partsCategoryNav.querySelectorAll('[data-part-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderPageHeading(); renderFilters(); renderParts();
});
partsFilterFields.addEventListener('change', event => {
  const input = event.target;
  if (input.matches('[data-facet]')) {
    const key = input.dataset.facet; const selected = selectedFacets.get(key) || new Set();
    if (input.checked) selected.add(input.value); else selected.delete(input.value);
    if (selected.size) selectedFacets.set(key, selected); else selectedFacets.delete(key);
  } else if (input.id === 'partsInStock') {
    if (input.checked) selectedFacets.set('inStock', new Set(['true'])); else selectedFacets.delete('inStock');
  } else if (input.id === 'partsMinPrice' || input.id === 'partsMaxPrice') {
    if (input.value && Number(input.value) >= 0) selectedFacets.set(input.id, [Number(input.value)]); else selectedFacets.delete(input.id);
  }
  renderParts();
});
document.getElementById('clearPartsFilters').addEventListener('click', () => { selectedFacets.clear(); renderFilters(); renderParts(); });
partsGrid.addEventListener('click', event => {
  const shoppingButton = event.target.closest('[data-add-shopping-cart]');
  if (shoppingButton) {
    const product = allParts.find(item => item.id === shoppingButton.dataset.addShoppingCart);
    if (product) window.TezcanShoppingCart?.add(product);
    return;
  }
  const compareButton = event.target.closest('[data-compare-id]');
  if (compareButton) {
    const id = compareButton.dataset.compareId;
    const product = allParts.find(item => item.id === id);
    if (!product) return;
    const selected = comparedProducts();
    if (comparedProductIds.includes(id)) comparedProductIds = comparedProductIds.filter(value => value !== id);
    else if (selected.length >= 3) return;
    else if (selected.length && selected[0].categoryId !== product.categoryId) {
      document.getElementById('partsCompareHint').textContent = 'Birlikte karşılaştırmak için aynı kategoriden ürün seç.';
      return;
    } else comparedProductIds = [...comparedProductIds, id];
    saveComparedProducts(); renderParts(); return;
  }
  const button = event.target.closest('[data-favorite-id]'); if (!button) return;
  const id = button.dataset.favoriteId; favorites = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id]; saveFavorites(); renderParts();
});
document.getElementById('clearCompareSelection')?.addEventListener('click', () => { comparedProductIds = []; saveComparedProducts(); renderParts(); });
partsQuery.value = new URLSearchParams(location.search).get('q') || '';
partsQuery.addEventListener('input', renderParts);
partsSort.addEventListener('change', renderParts);
(document.getElementById('partsSearch') || document.getElementById('siteSearch')).addEventListener('submit', event => { event.preventDefault(); renderParts(); });
const yearElement = document.getElementById('currentYear');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());
if (partsClient) {
  partsClient.auth.getSession().then(({ data }) => activateFavoriteUser(data?.session?.user || null)).catch(() => activateFavoriteUser(null));
  partsClient.auth.onAuthStateChange((_event, session) => setTimeout(() => activateFavoriteUser(session?.user || null), 0));
} else { favorites = readIds(guestFavoriteKey); saveFavorites(); }
window.addEventListener('storage', event => {
  if (event.key === favoriteKey) { favorites = readIds(favoriteKey); partsFavoriteCount.textContent = String(favorites.length); renderParts(); }
  if (event.key === compareStorageKey) { comparedProductIds = readIds(compareStorageKey); renderCompareTray(); renderParts(); }
});
loadParts();
