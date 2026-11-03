const compareKey = 'tezcan-product-compare';
const compareConfig = window.SUPABASE_CONFIG || {};
const compareClient = compareConfig.url && compareConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(compareConfig.url, compareConfig.publishableKey) : null;
const compareCategoryLabels = {
  cpu: 'İşlemci', motherboard: 'Anakart', ram: 'RAM', gpu: 'Ekran kartı', disk: 'Depolama', case: 'Kasa',
  cooling: 'Soğutucu', psu: 'Güç kaynağı', computers: 'Bilgisayar', peripherals: 'Çevre birimi',
  gaming: 'Oyun ve hobi', networking: 'Network', office: 'Ofis ürünü', accessories: 'Aksesuar', software: 'Yazılım'
};
const compareIcons = {
  cpu: 'fa-microchip', motherboard: 'fa-chess-board', ram: 'fa-memory', gpu: 'fa-display', disk: 'fa-hard-drive',
  case: 'fa-server', cooling: 'fa-fan', psu: 'fa-bolt', computers: 'fa-laptop', peripherals: 'fa-keyboard',
  gaming: 'fa-gamepad', networking: 'fa-wifi', office: 'fa-print', accessories: 'fa-plug', software: 'fa-gear'
};
const compareAttributeLabels = {
  family: 'Ürün serisi', socket: 'İşlemci soketi', chipset: 'Yonga seti', memory_type: 'Bellek türü',
  form_factor: 'Biçim / boyut', capacity_gb: 'Kapasite', speed_mts: 'Bellek hızı', cas_latency: 'Gecikme',
  module_count: 'Modül sayısı', model_code: 'Model kodu', gpu_chip: 'Grafik işlemci', series: 'Seri',
  memory_gb: 'Ekran kartı belleği', recommended_psu_w: 'Önerilen güç kaynağı', drive_type: 'Depolama türü',
  interface: 'Bağlantı', board_support: 'Desteklenen anakartlar', gpu_clearance_mm: 'Ekran kartı alanı',
  cpu_cooler_clearance_mm: 'İşlemci soğutucu alanı', psu_clearance_mm: 'Güç kaynağı alanı', cooler_type: 'Soğutma türü',
  height_mm: 'Soğutucu yüksekliği', radiator_mm: 'Radyatör boyutu', socket_support: 'Soket uyumluluğu',
  power_w: 'Güç', efficiency: 'Verimlilik', length_mm: 'Uzunluk', modular: 'Kablo yapısı', device_type: 'Ürün türü',
  processor: 'İşlemci', storage_gb: 'Depolama kapasitesi', connection: 'Bağlantı', screen_size_in: 'Ekran boyutu',
  refresh_rate_hz: 'Yenileme hızı', platform: 'Platform', wifi_standard: 'Wi-Fi standardı', speed_mbps: 'Ağ hızı',
  print_type: 'Baskı teknolojisi', connectivity: 'Bağlantı türü', software_type: 'Yazılım türü', license_type: 'Lisans türü'
};
const compareLabels = {
  brand: 'Marka', categoryId: 'Kategori', model: 'Model', sku: 'Ürün kodu', price: 'Fiyat', stock: 'Stok durumu'
};
let selectedCompareIds = readCompareIds();
let availableCompareProducts = [];
let compareProducts = [];

function readCompareIds() {
  try { const ids = JSON.parse(localStorage.getItem(compareKey) || '[]'); return Array.isArray(ids) ? ids.filter(id => typeof id === 'string').slice(0, 3) : []; }
  catch { return []; }
}
function persistCompareIds() {
  try { localStorage.setItem(compareKey, JSON.stringify(selectedCompareIds)); } catch {}
}
function normalizedProduct(row, source = 'db') {
  if (!row) return null;
  return {
    id: row.id, slug: row.slug, categoryId: source === 'db' ? row.category_id : row.categoryId,
    name: row.name, description: row.description || '', brand: row.brand || '', model: row.model || '', sku: row.sku || '',
    image: source === 'db' ? row.image_path : row.image, price: row.price === null || row.price === undefined ? null : Number(row.price),
    currency: row.currency || 'TRY', stock: row.stock, status: row.status, attributes: row.attributes || {}
  };
}
function priceLabel(product) {
  return Number.isFinite(product.price)
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: /^[A-Z]{3}$/.test(product.currency || '') ? product.currency : 'TRY' }).format(product.price)
    : 'Fiyat bilgisi hazırlanıyor';
}
function formatAttribute(key, value) {
  if (value === null || value === undefined || value === '') return 'Belirtilmemiş';
  if (Array.isArray(value)) return value.join(', ');
  if (key.endsWith('_gb') || key === 'capacity_gb' || key === 'memory_gb' || key === 'storage_gb') {
    const amount = Number(value);
    if (Number.isFinite(amount)) return amount >= 1000 && amount % 1000 === 0 ? `${amount / 1000} TB` : `${amount} GB`;
  }
  if (key.endsWith('_mts')) return `${value} MT/s`;
  if (key.endsWith('_w')) return `${value} W`;
  if (key.endsWith('_mm')) return `${value} mm`;
  if (key.endsWith('_hz')) return `${value} Hz`;
  if (key.endsWith('_in')) return `${value} inç`;
  return String(value);
}
function valueFor(product, key) {
  if (key === 'brand') return product.brand || 'Belirtilmemiş';
  if (key === 'categoryId') return compareCategoryLabels[product.categoryId] || product.categoryId;
  if (key === 'model') return product.model || 'Belirtilmemiş';
  if (key === 'sku') return product.sku || 'Belirtilmemiş';
  if (key === 'price') return priceLabel(product);
  if (key === 'stock') {
    if (product.stock === null || product.stock === undefined || product.stock === '') return 'Stok bilgisi hazırlanıyor';
    return Number(product.stock) > 0 ? `Stokta (${product.stock} adet)` : 'Stokta yok';
  }
  return formatAttribute(key, product.attributes?.[key]);
}
function imageIsSafe(path) {
  return typeof path === 'string' && ((/^assets\/products\/[A-Za-z0-9._/-]+$/.test(path) && !path.includes('..'))
    || /^https:\/\/[A-Za-z0-9.-]+\/storage\/v1\/object\/public\/product-images\/[A-Za-z0-9._/-]+$/.test(path));
}
function removeComparedProduct(id) {
  selectedCompareIds = selectedCompareIds.filter(value => value !== id);
  persistCompareIds();
  renderComparePage();
}
function renderProductCards() {
  const container = document.getElementById('compareProductCards');
  container.replaceChildren(...compareProducts.map(product => {
    const card = document.createElement('article'); card.className = 'compare-product-card';
    const picture = document.createElement('span'); picture.className = 'compare-product-picture';
    if (imageIsSafe(product.image)) {
      const image = document.createElement('img'); image.src = product.image; image.alt = ''; image.loading = 'lazy';
      const icon = document.createElement('i'); icon.className = `fa-solid ${compareIcons[product.categoryId] || 'fa-box'}`; icon.setAttribute('aria-hidden', 'true');
      image.addEventListener('error', () => image.replaceWith(icon), { once: true }); picture.append(image);
    } else {
      const icon = document.createElement('i'); icon.className = `fa-solid ${compareIcons[product.categoryId] || 'fa-box'}`; icon.setAttribute('aria-hidden', 'true'); picture.append(icon);
    }
    const info = document.createElement('div'); info.className = 'compare-product-info';
    const brand = document.createElement('small'); brand.textContent = product.brand || compareCategoryLabels[product.categoryId] || 'Ürün';
    const name = document.createElement('a'); name.href = `urun.html?slug=${encodeURIComponent(product.slug || '')}`; name.textContent = product.name;
    const price = document.createElement('em'); price.textContent = priceLabel(product);
    info.append(brand, name, price);
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'compare-remove-product'; remove.dataset.removeCompared = product.id; remove.setAttribute('aria-label', `${product.name} karşılaştırmadan çıkar`); remove.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    card.append(picture, info, remove); return card;
  }));
}
function buildCompareRows() {
  const baseRows = Object.entries(compareLabels).map(([key, label]) => ({ key, label, section: 'Temel bilgiler' }));
  const attributeKeys = [...new Set(compareProducts.flatMap(product => Object.keys(product.attributes || {})))].sort((a, b) => (compareAttributeLabels[a] || a).localeCompare(compareAttributeLabels[b] || b, 'tr'));
  return [...baseRows, ...attributeKeys.map(key => ({ key: `attributes.${key}`, attributeKey: key, label: compareAttributeLabels[key] || key.replace(/_/g, ' '), section: 'Teknik özellikler' }))];
}
function rowValue(product, row) {
  return row.attributeKey ? formatAttribute(row.attributeKey, product.attributes?.[row.attributeKey]) : valueFor(product, row.key);
}
function renderCompareTable() {
  const workspace = document.getElementById('compareWorkspace');
  const tableScroll = document.querySelector('.compare-table-scroll');
  const toolbar = document.querySelector('.compare-table-toolbar');
  const enoughProducts = compareProducts.length >= 2;
  tableScroll.hidden = !enoughProducts; toolbar.hidden = !enoughProducts;
  if (!enoughProducts) return;
  const head = document.getElementById('compareTableHead');
  const firstColumnWidth = '22%';
  const productColumnWidth = `${78 / compareProducts.length}%`;
  const headerRow = document.createElement('tr');
  const empty = document.createElement('th'); empty.scope = 'col'; empty.textContent = 'Özellik'; empty.style.width = firstColumnWidth; headerRow.append(empty);
  compareProducts.forEach(product => { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = product.name; cell.style.width = productColumnWidth; headerRow.append(cell); });
  head.replaceChildren(headerRow);
  const rows = buildCompareRows();
  const rowData = rows.map(row => ({ ...row, values: compareProducts.map(product => rowValue(product, row)) }));
  const differentRows = rowData.filter(row => new Set(row.values).size > 1);
  document.getElementById('compareDifferenceCount').textContent = `${differentRows.length} farklı özellik`;
  const differentOnly = document.getElementById('showDifferencesOnly').checked;
  let currentSection = '';
  const bodyRows = [];
  rowData.forEach(row => {
    if (differentOnly && new Set(row.values).size <= 1) return;
    if (row.section !== currentSection) {
      currentSection = row.section;
      const sectionRow = document.createElement('tr'); sectionRow.className = 'compare-section-row';
      const heading = document.createElement('th'); heading.scope = 'rowgroup'; heading.textContent = row.section; heading.style.width = firstColumnWidth; sectionRow.append(heading);
      compareProducts.forEach(() => { const emptyCell = document.createElement('td'); emptyCell.style.width = productColumnWidth; emptyCell.setAttribute('aria-hidden', 'true'); sectionRow.append(emptyCell); });
      bodyRows.push(sectionRow);
    }
    const tr = document.createElement('tr');
    const label = document.createElement('th'); label.scope = 'row'; label.textContent = row.label; label.style.width = firstColumnWidth; tr.append(label);
    const isDifferent = new Set(row.values).size > 1;
    row.values.forEach(value => {
      const cell = document.createElement('td'); cell.textContent = value;
      cell.style.width = productColumnWidth;
      if (isDifferent) cell.classList.add('compare-cell-different');
      if (value === 'Belirtilmemiş' || value === 'Stok bilgisi hazırlanıyor' || value === 'Fiyat bilgisi hazırlanıyor') cell.classList.add('compare-cell-empty');
      tr.append(cell);
    });
    bodyRows.push(tr);
  });
  document.getElementById('compareTableBody').replaceChildren(...bodyRows);
}
function renderComparePage() {
  const seen = new Set();
  compareProducts = selectedCompareIds.map(id => availableCompareProducts.find(product => product.id === id)).filter(product => {
    if (!product || seen.has(product.id)) return false;
    seen.add(product.id); return true;
  });
  if (compareProducts.length !== selectedCompareIds.length) {
    selectedCompareIds = compareProducts.map(product => product.id); persistCompareIds();
  }
  if (compareProducts.length && compareProducts.some(product => product.categoryId !== compareProducts[0].categoryId)) {
    const categoryId = compareProducts[0].categoryId;
    compareProducts = compareProducts.filter(product => product.categoryId === categoryId);
    selectedCompareIds = compareProducts.map(product => product.id); persistCompareIds();
  }
  const isEmpty = compareProducts.length === 0;
  document.getElementById('compareEmpty').hidden = !isEmpty;
  document.getElementById('compareWorkspace').hidden = isEmpty;
  document.getElementById('clearAllCompared').disabled = isEmpty;
  const status = document.getElementById('compareStatus');
  status.textContent = isEmpty
    ? 'Henüz ürün seçilmedi.'
    : compareProducts.length === 1
      ? 'Karşılaştırmayı tamamlamak için aynı kategoriden bir ürün daha ekle.'
      : `${compareProducts.length} ${compareCategoryLabels[compareProducts[0].categoryId] || 'ürün'} yan yana karşılaştırılıyor.`;
  document.getElementById('compareCategoryHint').textContent = compareProducts.length
    ? `${compareCategoryLabels[compareProducts[0].categoryId] || 'Aynı kategorideki ürünlerden'} · En fazla 3 ürün`
    : 'Aynı kategoriden en fazla üç ürünü özellikleriyle yan yana incele.';
  if (isEmpty) return;
  renderProductCards(); renderCompareTable();
}
async function loadCompareProducts() {
  let bundled = [];
  try {
    const response = await fetch('assets/data/builder-products.json', { cache: 'no-store' });
    if (response.ok) bundled = (await response.json()).products || [];
  } catch {}
  try {
    const response = await fetch('assets/data/catalog.json', { cache: 'no-store' });
    if (response.ok) bundled = [...bundled, ...((await response.json()).products || [])];
  } catch {}
  const byId = new Map(bundled.map(item => [item.id, normalizedProduct(item, 'bundle')]).filter(([, item]) => item?.status === 'active'));
  if (compareClient && selectedCompareIds.length) {
    try {
      const { data, error } = await compareClient.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,attributes').in('id', selectedCompareIds).eq('status', 'active');
      if (!error) for (const row of data || []) {
        const product = normalizedProduct(row);
        const bundledProduct = byId.get(product.id);
        byId.set(product.id, bundledProduct ? { ...bundledProduct, ...product, attributes: { ...bundledProduct.attributes, ...product.attributes } } : product);
      }
    } catch {}
  }
  availableCompareProducts = [...byId.values()];
  document.getElementById('compareStatus').textContent = 'Karşılaştırma listen hazırlanıyor…';
  renderComparePage();
}

document.getElementById('compareProductCards').addEventListener('click', event => {
  const button = event.target.closest('[data-remove-compared]');
  if (button) removeComparedProduct(button.dataset.removeCompared);
});
document.getElementById('clearAllCompared').addEventListener('click', () => {
  selectedCompareIds = []; persistCompareIds(); renderComparePage();
});
document.getElementById('showDifferencesOnly').addEventListener('change', renderCompareTable);
document.getElementById('currentYear').textContent = String(new Date().getFullYear());
window.addEventListener('storage', event => {
  if (event.key === compareKey) { selectedCompareIds = readCompareIds(); loadCompareProducts(); }
});
loadCompareProducts();
