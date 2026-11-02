const processorFamilies = {
  intel: [
    { id: 'i3', name: 'Core i3', note: 'Günlük kullanım', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i3-14100', 'i3-14100F', 'i3-13100', 'i3-13100F', 'i3-12100', 'i3-12100F'] },
    { id: 'i5', name: 'Core i5', note: 'Oyun ve çok yönlü kullanım', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i5-14600K', 'i5-14600KF', 'i5-14500', 'i5-14400', 'i5-14400F', 'i5-13600K', 'i5-13600KF', 'i5-13400F', 'i5-12600K', 'i5-12400F'] },
    { id: 'i7', name: 'Core i7', note: 'Yüksek performans', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i7-14700K', 'i7-14700KF', 'i7-14700F', 'i7-13700K', 'i7-13700KF', 'i7-12700K', 'i7-12700F'] },
    { id: 'i9', name: 'Core i9', note: 'Üst seviye performans', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i9-14900K', 'i9-14900KF', 'i9-14900F', 'i9-13900K', 'i9-13900KF', 'i9-12900K', 'i9-12900KF'] },
    { id: 'ultra5', name: 'Core Ultra 5', note: 'Yeni nesil masaüstü', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['250K Plus', '250KF Plus', '245K', '245KF', '225', '225F'] },
    { id: 'ultra7', name: 'Core Ultra 7', note: 'Yeni nesil yüksek performans', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['270K Plus', '265K', '265KF'] },
    { id: 'ultra9', name: 'Core Ultra 9', note: 'Yeni nesil üst seviye', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['285K', '285'] }
  ],
  amd: [
    { id: 'ryzen5', name: 'Ryzen 5', note: 'Oyun ve çok yönlü kullanım', generation: 'Ryzen 9000 / 8000G · AM5', socket: 'AM5', models: ['9600X', '9600', '9500F', '8600G', '8500G'] },
    { id: 'ryzen7', name: 'Ryzen 7', note: 'Yüksek performans', generation: 'Ryzen 9000 / 8000G · AM5', socket: 'AM5', models: ['9850X3D', '9800X3D', '9700X', '9700F', '8700G'] },
    { id: 'ryzen9', name: 'Ryzen 9', note: 'Üst seviye performans', generation: 'Ryzen 9000 · AM5', socket: 'AM5', models: ['9950X3D2 Dual Edition', '9950X3D', '9950X', '9900X3D', '9900X'] }
  ]
};

const motherboardsBySocket = {
  LGA1700: [
    { id: 'asus-tuf-b760-plus-wifi', name: 'ASUS TUF GAMING B760-PLUS WIFI', chipset: 'Intel B760', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b760-plus-wifi/techspec/' },
    { id: 'asus-prime-b760m-a-d4', name: 'ASUS PRIME B760M-A D4', chipset: 'Intel B760', memory: 'DDR4', form: 'Micro-ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/prime/prime-b760m-a-d4/techspec/' },
    { id: 'msi-mag-b760-tomahawk-wifi', name: 'MSI MAG B760 TOMAHAWK WIFI', chipset: 'Intel B760', memory: 'DDR5', form: 'ATX', url: 'https://us.msi.com/Motherboard/MAG-B760-TOMAHAWK-WIFI/Specification' }
  ],
  LGA1851: [
    { id: 'asus-tuf-z890-plus-wifi', name: 'ASUS TUF GAMING Z890-PLUS WIFI', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-z890-plus-wifi/techspec/' },
    { id: 'asus-prime-b860m-a-wifi', name: 'ASUS PRIME B860M-A WIFI', chipset: 'Intel B860', memory: 'DDR5', form: 'Micro-ATX', url: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b860m-a-wifi/' },
    { id: 'msi-pro-z890-s-wifi-pz', name: 'MSI PRO Z890-S WIFI PZ', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX', url: 'https://storage-asset.msi.com/datasheet/mb/in/PRO-Z890-S-WIFI-PZ.pdf' }
  ],
  AM5: [
    { id: 'asus-tuf-b650-plus-wifi', name: 'ASUS TUF GAMING B650-PLUS WIFI', chipset: 'AMD B650', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/techspec/' },
    { id: 'asus-prime-b650m-a-wifi-ii', name: 'ASUS PRIME B650M-A WIFI II', chipset: 'AMD B650', memory: 'DDR5', form: 'Micro-ATX', url: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b650m-a-wifi-ii/' }
  ]
};

const ramKitsByType = {
  DDR4: [
    { id: 'kingston-fury-beast-ddr4-16', name: 'Kingston FURY Beast 16GB (2×8GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 16, code: 'KF432C16BBK2/16', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F16' },
    { id: 'kingston-fury-beast-ddr4-32', name: 'Kingston FURY Beast 32GB (2×16GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 32, code: 'KF432C16BBK2/32', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F32' },
    { id: 'kingston-fury-beast-ddr4-64', name: 'Kingston FURY Beast 64GB (2×32GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 64, code: 'KF432C16BBK2/64', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F64' }
  ],
  DDR5: [
    { id: 'kingston-fury-beast-ddr5-32', name: 'Kingston FURY Beast 32GB (2×16GB)', spec: 'DDR5-6000 · CL30 · AMD EXPO', capacity: 32, code: 'KF560C30BBEK2-32', url: 'https://www.kingston.com/en/memory/search?partid=KF560C30BBEK2-32' },
    { id: 'corsair-vengeance-ddr5-32', name: 'CORSAIR VENGEANCE 32GB (2×16GB)', spec: 'DDR5-6000 · CL36', capacity: 32, code: 'CMK32GX5M2E6000C36', url: 'https://www.corsair.com/us/en/p/memory/cmk32gx5m2e6000c36/vengeance-32gb-2x16gb-ddr5-dram-6000mt-s-c36-memory-kit-black-cmk32gx5m2e6000c36' },
    { id: 'kingston-fury-beast-ddr5-64', name: 'Kingston FURY Beast 64GB (2×32GB)', spec: 'DDR5-6000 · CL30 · AMD EXPO', capacity: 64, code: 'KF560C30BBEK2-64', url: 'https://www.kingston.com/en/memory/search?partid=KF560C30BBEK2-64' }
  ]
};

const graphicsCards = {
  NVIDIA: [
    { id: 'geforce-rtx-5090', name: 'NVIDIA GeForce RTX 5090', series: 'GeForce RTX 50 · Blackwell', psuMin: 1000 },
    { id: 'geforce-rtx-5080', name: 'NVIDIA GeForce RTX 5080', series: 'GeForce RTX 50 · Blackwell', psuMin: 850 },
    { id: 'geforce-rtx-5070-ti', name: 'NVIDIA GeForce RTX 5070 Ti', series: 'GeForce RTX 50 · Blackwell', psuMin: 750 },
    { id: 'geforce-rtx-5070', name: 'NVIDIA GeForce RTX 5070', series: 'GeForce RTX 50 · Blackwell', psuMin: 650 },
    { id: 'geforce-rtx-5060-ti', name: 'NVIDIA GeForce RTX 5060 Ti', series: 'GeForce RTX 50 · Blackwell', psuMin: 600 },
    { id: 'geforce-rtx-5060', name: 'NVIDIA GeForce RTX 5060', series: 'GeForce RTX 50 · Blackwell', psuMin: 550 },
    { id: 'geforce-rtx-5050', name: 'NVIDIA GeForce RTX 5050', series: 'GeForce RTX 50 · Blackwell', psuMin: 550 }
  ],
  AMD: [
    { id: 'radeon-rx-9070-xt', name: 'AMD Radeon RX 9070 XT', series: 'Radeon RX 9000 · RDNA 4', psuMin: 750 },
    { id: 'radeon-rx-9070', name: 'AMD Radeon RX 9070', series: 'Radeon RX 9000 · RDNA 4', psuMin: 650 },
    { id: 'radeon-rx-9070-gre', name: 'AMD Radeon RX 9070 GRE', series: 'Radeon RX 9000 · RDNA 4', psuMin: 750 },
    { id: 'radeon-rx-9060-xt', name: 'AMD Radeon RX 9060 XT', series: 'Radeon RX 9000 · RDNA 4', psuMin: 650 },
    { id: 'radeon-rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', series: 'Radeon RX 7000 · RDNA 3', psuMin: 800 },
    { id: 'radeon-rx-7900-xt', name: 'AMD Radeon RX 7900 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 750 },
    { id: 'radeon-rx-7800-xt', name: 'AMD Radeon RX 7800 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 700 },
    { id: 'radeon-rx-7700-xt', name: 'AMD Radeon RX 7700 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 700 }
  ]
};

const storageProducts = {
  nvme: [
    { id: 'samsung-990-evo-plus-1tb', name: 'Samsung 990 EVO Plus 1TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4 / 5.0 x2', capacity: '1 TB', code: 'MZ-V9S1T0BW', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/990-evo-plus/' },
    { id: 'samsung-990-evo-plus-2tb', name: 'Samsung 990 EVO Plus 2TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4 / 5.0 x2', capacity: '2 TB', code: 'MZ-V9S2T0BW', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/990-evo-plus/' }
  ],
  sata: [
    { id: 'crucial-mx500-1tb', name: 'Crucial MX500 1TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '1 TB', code: 'CT1000MX500SSD1', url: 'https://www.crucial.com/ssd/mx500/ct1000mx500ssd1' },
    { id: 'samsung-870-evo-1tb', name: 'Samsung 870 EVO 1TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '1 TB', code: 'MZ-77E1T0', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/870-evo/' }
  ],
  hdd: [
    { id: 'wd-blue-1tb', name: 'WD Blue 1TB Desktop HDD', spec: '3.5 inç · SATA · 7200 RPM · 64 MB önbellek', capacity: '1 TB', code: 'WD10EZEX', url: 'https://www.wd.com/content/store/en-in/products/internal-drives/wd-blue-desktop-sata-hdd.html' },
    { id: 'wd-blue-2tb', name: 'WD Blue 2TB Desktop HDD', spec: '3.5 inç · SATA · 7200 RPM · 256 MB önbellek', capacity: '2 TB', code: 'WD20EZBX', url: 'https://www.wd.com/content/store/en-in/products/internal-drives/wd-blue-desktop-sata-hdd.html' }
  ]
};

const pcCases = [
  { id: 'nzxt-h5-flow', name: 'NZXT H5 Flow', supports: ['ATX', 'Micro-ATX'], gpu: 410, cooler: 170, psu: 200, note: 'Mid-tower · hava akışlı ön panel', url: 'https://nzxt.com/products/h5-flow' },
  { id: 'corsair-4000d-airflow', name: 'CORSAIR 4000D Airflow', supports: ['ATX', 'Micro-ATX'], gpu: 360, cooler: 170, psu: 220, note: 'Mid-tower · mesh ön panel', url: 'https://www.corsair.com/us/en/p/pc-cases/cc-9011200-ww/4000d-airflow-tempered-glass-mid-tower-atx-case-black-cc-9011200-ww' },
  { id: 'asus-prime-ap201', name: 'ASUS Prime AP201', supports: ['Micro-ATX'], gpu: 338, cooler: 170, psu: 180, note: 'Kompakt kasa · Micro-ATX / Mini-ITX', url: 'https://www.asus.com/us/motherboards-components/cases/prime/asus-prime-ap201-microatx-case/techspec/' },
  { id: 'cooler-master-q300l', name: 'Cooler Master MasterBox Q300L', supports: ['Micro-ATX'], gpu: 360, cooler: 159, psu: 160, note: 'Mini tower · Micro-ATX / Mini-ITX', url: 'https://www.coolermaster.com/en-us/products/masterbox-q300l.html' }
];

const powerSupplies = [
  { id: 'corsair-rm650e', name: 'CORSAIR RM650e (2025)', watts: 650, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020302-na/rme-series-rm650e-fully-modular-low-noise-atx-power-supply-cp-9020302-na' },
  { id: 'seasonic-focus-gx-750', name: 'Seasonic FOCUS GX-750', watts: 750, length: 140, spec: '80 PLUS Gold · tam modüler', url: 'https://seasonic.com/focus-gx/' },
  { id: 'corsair-rm750e', name: 'CORSAIR RM750e (2025)', watts: 750, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/explorer/diy-builder/power-supply-units/corsair-rme-series-2025/' },
  { id: 'msi-mag-a850gl', name: 'MSI MAG A850GL PCIE5', watts: 850, length: 140, spec: '80 PLUS Gold · PCIe 5.0 · tam modüler', url: 'https://www.msi.com/Power-Supply/MAG-A850GL-PCIE5/Specification' },
  { id: 'corsair-rm850e', name: 'CORSAIR RM850e (2025)', watts: 850, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020336-na/rm850e-atx-3-1-low-noise-atx-power-supply-with-thermalprotect-12v-2x6-cable-cp-9020336-na' },
  { id: 'corsair-rm1000e', name: 'CORSAIR RM1000e (2025)', watts: 1000, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020337-na/rm1000e-atx-3-1-low-noise-atx-power-supply-with-thermalprotect-12v-2x6-cable-cp-9020337-na' }
];

const storageKey = 'tezcan-system-builder-cpu-v1';
const brandStep = document.getElementById('brandStep');
const familyStep = document.getElementById('familyStep');
const modelStep = document.getElementById('modelStep');
const motherboardStep = document.getElementById('motherboardStep');
const ramStep = document.getElementById('ramStep');
const gpuStep = document.getElementById('gpuStep');
const storageStep = document.getElementById('storageStep');
const caseStep = document.getElementById('caseStep');
const psuStep = document.getElementById('psuStep');
const familyChoices = document.getElementById('familyChoices');
const modelChoices = document.getElementById('modelChoices');
const motherboardChoices = document.getElementById('motherboardChoices');
const ramChoices = document.getElementById('ramChoices');
const gpuChoices = document.getElementById('gpuChoices');
const storageChoices = document.getElementById('storageChoices');
const caseChoices = document.getElementById('caseChoices');
const psuChoices = document.getElementById('psuChoices');
const modelSearch = document.getElementById('modelSearch');
const motherboardSearch = document.getElementById('motherboardSearch');
const ramSearch = document.getElementById('ramSearch');
const gpuSearch = document.getElementById('gpuSearch');
const storageSearch = document.getElementById('storageSearch');
const caseSearch = document.getElementById('caseSearch');
const psuSearch = document.getElementById('psuSearch');
const message = document.getElementById('builderMessage');
let selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32, gpuBrand: '', gpu: '', storageType: '', storage: '', pcCase: '', psu: '' };

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object') selection = { ...selection, ...saved };
} catch { /* Continue with an empty build if local storage is unavailable. */ }

function getFamily() {
  return (processorFamilies[selection.brand] || []).find(family => family.id === selection.family) || null;
}
function getMotherboard() {
  const family = getFamily();
  const boards = family ? motherboardsBySocket[family.socket] || [] : [];
  const board = boards.find(item => item.id === selection.motherboard) || null;
  if (selection.motherboard && !board) selection.motherboard = '';
  return board ? { ...board, socket: family.socket } : null;
}
function getRamKit() {
  const board = getMotherboard();
  const kits = board ? ramKitsByType[board.memory] || [] : [];
  const kit = kits.find(item => item.id === selection.ram) || null;
  if (selection.ram && !kit) selection.ram = '';
  return kit;
}
function getCase() {
  const board = getMotherboard();
  const compatibleCases = board ? pcCases.filter(item => item.supports.includes(board.form)) : [];
  const selectedCase = compatibleCases.find(item => item.id === selection.pcCase) || null;
  if (selection.pcCase && !selectedCase) selection.pcCase = '';
  return selectedCase;
}
function getGraphicsCard() {
  return (graphicsCards[selection.gpuBrand] || []).find(item => item.id === selection.gpu) || null;
}
function getPowerSupply() {
  const selectedCase = getCase();
  const gpu = getGraphicsCard();
  const validChoices = selectedCase && gpu ? powerSupplies.filter(item => item.watts >= gpu.psuMin && item.length <= selectedCase.psu) : [];
  const psu = validChoices.find(item => item.id === selection.psu) || null;
  if (selection.psu && !psu) selection.psu = '';
  return psu;
}
function modelLabel(family, model) {
  return selection.brand === 'intel'
    ? family.id.startsWith('ultra') ? `Intel ${family.name} ${model}` : `Intel Core ${model}`
    : `AMD ${family.name} ${model}`;
}
function saveSelection() {
  try { localStorage.setItem(storageKey, JSON.stringify(selection)); } catch { /* The current selection still works for this visit. */ }
}
function showStage(stage) {
  brandStep.hidden = stage !== 'brand';
  familyStep.hidden = stage !== 'family';
  modelStep.hidden = stage !== 'model';
  motherboardStep.hidden = stage !== 'motherboard';
  ramStep.hidden = stage !== 'ram';
  gpuStep.hidden = stage !== 'gpu';
  storageStep.hidden = stage !== 'storage';
  caseStep.hidden = stage !== 'case';
  psuStep.hidden = stage !== 'psu';
  document.getElementById('selectionTitle').textContent = stage === 'brand' ? 'İşlemci markanı seç' : stage === 'family' ? 'İşlemci ailesini seç' : stage === 'model' ? 'İşlemci modelini seç' : stage === 'motherboard' ? 'Anakartını seç' : stage === 'ram' ? 'Belleğini seç' : stage === 'gpu' ? 'Ekran kartını seç' : stage === 'storage' ? 'Depolama seç' : stage === 'case' ? 'Kasana karar ver' : 'Güç kaynağını seç';
  document.getElementById('selectionDescription').textContent = stage === 'brand'
    ? 'AMD ve Intel işlemcileri arasından tercih yap.'
    : stage === 'family'
      ? 'Seçtiğin markanın işlemci ailesini belirle.'
      : stage === 'model'
        ? 'Resmi model adını seç; fiyat ve stok bilgisi kataloğa eklendiğinde bağlanacak.'
        : stage === 'motherboard' ? 'Seçtiğin işlemcinin soketine uyan anakart modelleri gösteriliyor.' : stage === 'ram' ? 'Seçtiğin anakartın desteklediği bellek türü ve gerçek kit modelleri listeleniyor.' : stage === 'gpu' ? 'NVIDIA GeForce ve AMD Radeon modelleri arasından seç.' : stage === 'storage' ? 'NVMe SSD, SATA SSD veya HDD türünü ve modelini seç.' : stage === 'case' ? 'Anakart boyutuna uyan kasa seçeneklerini karşılaştır.' : 'Ekran kartının güç gereksinimini ve kasanın PSU boşluğunu karşılayan ürünleri seç.';
  document.getElementById('selectionEyebrow').textContent = stage === 'brand' ? 'ADIM 1 · İŞLEMCİ MARKASI' : stage === 'family' ? 'ADIM 1 · İŞLEMCİ AİLESİ' : stage === 'model' ? 'ADIM 1 · İŞLEMCİ MODELİ' : stage === 'motherboard' ? 'ADIM 2 · ANAKART' : stage === 'ram' ? 'ADIM 3 · BELLEK (RAM)' : stage === 'gpu' ? 'ADIM 4 · EKRAN KARTI' : stage === 'storage' ? 'ADIM 5 · DEPOLAMA' : stage === 'case' ? 'ADIM 6 · KASA' : 'ADIM 7 · GÜÇ KAYNAĞI';
  const cpuButton = document.getElementById('cpuStepButton');
  const boardButton = document.getElementById('motherboardStepButton');
  const ramButton = document.getElementById('ramStepButton');
  const gpuButton = document.getElementById('gpuStepButton');
  const storageButton = document.getElementById('storageStepButton');
  const caseButton = document.getElementById('caseStepButton');
  const psuButton = document.getElementById('psuStepButton');
  const cpuCurrent = ['brand', 'family', 'model'].includes(stage);
  const boardCurrent = stage === 'motherboard';
  const ramCurrent = stage === 'ram';
  const gpuCurrent = stage === 'gpu';
  const storageCurrent = stage === 'storage';
  const caseCurrent = stage === 'case';
  const psuCurrent = stage === 'psu';
  cpuButton.classList.toggle('is-current', cpuCurrent);
  boardButton.classList.toggle('is-current', boardCurrent);
  ramButton.classList.toggle('is-current', ramCurrent);
  gpuButton.classList.toggle('is-current', gpuCurrent);
  storageButton.classList.toggle('is-current', storageCurrent);
  caseButton.classList.toggle('is-current', caseCurrent);
  psuButton.classList.toggle('is-current', psuCurrent);
  if (cpuCurrent) cpuButton.setAttribute('aria-current', 'step'); else cpuButton.removeAttribute('aria-current');
  if (boardCurrent) boardButton.setAttribute('aria-current', 'step'); else boardButton.removeAttribute('aria-current');
  if (ramCurrent) ramButton.setAttribute('aria-current', 'step'); else ramButton.removeAttribute('aria-current');
  if (gpuCurrent) gpuButton.setAttribute('aria-current', 'step'); else gpuButton.removeAttribute('aria-current');
  if (storageCurrent) storageButton.setAttribute('aria-current', 'step'); else storageButton.removeAttribute('aria-current');
  if (caseCurrent) caseButton.setAttribute('aria-current', 'step'); else caseButton.removeAttribute('aria-current');
  if (psuCurrent) psuButton.setAttribute('aria-current', 'step'); else psuButton.removeAttribute('aria-current');
}
function updateSummary() {
  const family = getFamily();
  const hasModel = Boolean(family && family.models.includes(selection.model));
  if (!hasModel) selection.model = '';
  let board = getMotherboard();
  if (board && (!hasModel || board.socket && board.socket !== family.socket)) { selection.motherboard = ''; board = null; }
  const ram = getRamKit();
  const gpu = getGraphicsCard();
  if (selection.gpu && !gpu) selection.gpu = '';
  const storage = (storageProducts[selection.storageType] || []).find(item => item.id === selection.storage) || null;
  if (selection.storage && !storage) selection.storage = '';
  const selectedCase = getCase();
  const psu = getPowerSupply();
  document.getElementById('summaryCpu').textContent = hasModel ? modelLabel(family, selection.model) : 'Henüz seçilmedi';
  document.getElementById('summaryCpuDetail').textContent = hasModel ? family.generation : selection.brand ? `${selection.brand === 'intel' ? 'Intel' : 'AMD'} · model bekleniyor` : 'AMD veya Intel seç';
  document.getElementById('cpuStepStatus').textContent = hasModel ? modelLabel(family, selection.model) : 'Seçim bekliyor';
  document.getElementById('cpuStepCheck').textContent = hasModel ? '✓' : '○';
  document.querySelector('.build-step').classList.toggle('is-complete', hasModel);
  document.getElementById('editCpu').hidden = !hasModel;
  document.getElementById('summaryMotherboard').textContent = board ? board.name : 'Sonraki adım';
  document.getElementById('summaryMotherboardDetail').textContent = board ? `${board.socket} · ${board.memory}` : hasModel ? `${family.socket} · uyumlu modeller` : 'İşlemcini seç';
  document.getElementById('editMotherboard').hidden = !board;
  const cpuStepButton = document.getElementById('cpuStepButton');
  const boardStepButton = document.getElementById('motherboardStepButton');
  cpuStepButton.classList.toggle('is-complete', hasModel);
  boardStepButton.disabled = !hasModel;
  boardStepButton.classList.toggle('is-complete', Boolean(board));
  boardStepButton.classList.toggle('is-next', !hasModel);
  document.getElementById('motherboardStepStatus').textContent = board ? board.name : hasModel ? 'Uyumlu kart seç' : 'İşlemciden sonra';
  document.getElementById('motherboardStepCheck').textContent = board ? '✓' : hasModel ? '○' : '—';
  const ramStepButton = document.getElementById('ramStepButton');
  ramStepButton.disabled = !board;
  ramStepButton.classList.toggle('is-complete', Boolean(ram));
  ramStepButton.classList.toggle('is-next', !board);
  document.getElementById('ramStepStatus').textContent = ram ? `${ram.capacity} GB · ${board.memory}` : board ? `${board.memory} seç` : 'Anakarttan sonra';
  document.getElementById('ramStepCheck').textContent = ram ? '✓' : board ? '○' : '—';
  document.getElementById('summaryRam').textContent = ram ? `${ram.capacity} GB · ${ram.name.split(' ').slice(0, 3).join(' ')}` : 'Sonraki adım';
  document.getElementById('summaryRamDetail').textContent = ram ? `${board.memory} · ${ram.spec}` : board ? `${board.memory} bellek seç` : 'Anakartını seç';
  document.getElementById('editRam').hidden = !ram;
  const gpuStepButton = document.getElementById('gpuStepButton');
  gpuStepButton.disabled = !ram;
  gpuStepButton.classList.toggle('is-complete', Boolean(gpu));
  gpuStepButton.classList.toggle('is-next', !ram);
  document.getElementById('gpuStepStatus').textContent = gpu ? gpu.name.replace(/^NVIDIA GeForce |^AMD Radeon /, '') : ram ? 'Marka ve model seç' : "RAM'den sonra";
  document.getElementById('gpuStepCheck').textContent = gpu ? '✓' : ram ? '○' : '—';
  document.getElementById('summaryGpu').textContent = gpu ? gpu.name : 'Sonraki adım';
  document.getElementById('summaryGpuDetail').textContent = gpu ? gpu.series : 'RAM’ini seç';
  document.getElementById('editGpu').hidden = !gpu;
  const storageStepButton = document.getElementById('storageStepButton');
  storageStepButton.disabled = !gpu;
  storageStepButton.classList.toggle('is-complete', Boolean(storage));
  storageStepButton.classList.toggle('is-next', !gpu);
  document.getElementById('storageStepStatus').textContent = storage ? `${storage.capacity} · ${storage.name.split(' ')[0]}` : gpu ? 'Tür ve model seç' : 'Ekran kartından sonra';
  document.getElementById('storageStepCheck').textContent = storage ? '✓' : gpu ? '○' : '—';
  document.getElementById('summaryStorage').textContent = storage ? storage.name : 'Sonraki adım';
  document.getElementById('summaryStorageDetail').textContent = storage ? `${storage.capacity} · ${storage.spec}` : 'Ekran kartını seç';
  document.getElementById('editStorage').hidden = !storage;
  const caseStepButton = document.getElementById('caseStepButton');
  caseStepButton.disabled = !storage;
  caseStepButton.classList.toggle('is-complete', Boolean(selectedCase));
  caseStepButton.classList.toggle('is-next', !storage);
  document.getElementById('caseStepStatus').textContent = selectedCase ? selectedCase.name : storage && board ? `${board.form} uyumlu kasa seç` : 'Depolamadan sonra';
  document.getElementById('caseStepCheck').textContent = selectedCase ? '✓' : storage && board ? '○' : '—';
  document.getElementById('caseBoardLabel').textContent = board ? `${board.name} · ${board.form}` : 'Anakart seçilmedi';
  document.getElementById('summaryCase').textContent = selectedCase ? selectedCase.name : 'Sonraki adım';
  document.getElementById('summaryCaseDetail').textContent = selectedCase ? `${board.form} · ekran kartı boşluğu ${selectedCase.gpu} mm` : 'Depolamayı seç';
  document.getElementById('editCase').hidden = !selectedCase;
  const psuStepButton = document.getElementById('psuStepButton');
  psuStepButton.disabled = !selectedCase || !gpu;
  psuStepButton.classList.toggle('is-complete', Boolean(psu));
  psuStepButton.classList.toggle('is-next', !selectedCase);
  document.getElementById('psuStepStatus').textContent = psu ? `${psu.watts} W · ${psu.name.split(' ')[0]}` : gpu && selectedCase ? `${gpu.psuMin} W ve üzeri` : 'Kasadan sonra';
  document.getElementById('psuStepCheck').textContent = psu ? '✓' : gpu && selectedCase ? '○' : '—';
  document.getElementById('psuGpuLabel').textContent = gpu ? `${gpu.name} · min. ${gpu.psuMin} W` : 'Ekran kartı seçilmedi';
  document.getElementById('psuCount').textContent = gpu && selectedCase ? `${gpu.psuMin} W ve üzeri · kasa sınırı ${selectedCase.psu} mm` : 'Ekran kartı ve kasa seçilmelidir';
  document.getElementById('summaryPsu').textContent = psu ? `${psu.name} · ${psu.watts} W` : 'Sonraki adım';
  document.getElementById('summaryPsuDetail').textContent = psu ? `${psu.spec} · ${psu.length} mm` : 'Kasayı seç';
  document.getElementById('editPsu').hidden = !psu;
  const completed = Number(hasModel) + Number(Boolean(board)) + Number(Boolean(ram)) + Number(Boolean(gpu)) + Number(Boolean(storage)) + Number(Boolean(selectedCase)) + Number(Boolean(psu));
  document.getElementById('progressCount').innerHTML = `${completed} <small>/ 7</small>`;
  document.getElementById('stepCount').textContent = `${completed} / 7`;
  document.getElementById('summaryProgress').textContent = `${completed} / 7`;
  document.getElementById('progressCaption').textContent = psu ? 'Temel sistem parçaları seçildi · sistemin hazır' : selectedCase ? 'Kasa seçildi · güç kaynağı sırada' : storage ? 'Depolama seçildi · anakartına uygun kasa seç' : gpu ? 'Ekran kartı seçildi · depolama sırada' : ram ? 'İşlemci, anakart ve RAM seçildi · ekran kartı sırada' : board ? 'İşlemci ve anakart seçildi · RAM sırada' : hasModel ? 'İşlemcin seçildi · uyumlu anakart seç' : 'İşlemci seçimi bekleniyor';
  document.getElementById('progressBar').style.width = `${completed / 7 * 100}%`;
  saveSelection();
}
function showFamilies() {
  const list = processorFamilies[selection.brand] || [];
  document.getElementById('selectedBrandLabel').textContent = selection.brand === 'intel' ? 'Intel' : 'AMD';
  familyChoices.replaceChildren(...list.map(family => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'family-choice';
    button.dataset.family = family.id;
    button.setAttribute('aria-pressed', String(selection.family === family.id));
    const copy = document.createElement('strong'); copy.textContent = family.name;
    const note = document.createElement('span'); note.textContent = family.note;
    button.append(copy, note);
    return button;
  }));
}
function renderModels() {
  const family = getFamily();
  if (!family) return;
  document.getElementById('selectedFamilyLabel').textContent = `${selection.brand === 'intel' ? 'Intel' : 'AMD'} · ${family.name}`;
  document.getElementById('modelCount').textContent = `${family.models.length} model · ${family.generation}`;
  const query = modelSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = family.models.filter(model => modelLabel(family, model).toLocaleLowerCase('tr-TR').includes(query));
  modelChoices.replaceChildren(...matches.map(model => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.model = model;
    button.setAttribute('aria-pressed', String(selection.model === model));
    const name = document.createElement('strong'); name.textContent = modelLabel(family, model);
    const detail = document.createElement('span'); detail.textContent = `${family.generation} · Üretici model adı`;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = selection.brand === 'intel' ? family.id.startsWith('ultra') ? 'Intel Core Ultra' : 'Intel Core' : 'AMD Ryzen';
    button.append(name, detail, chip);
    return button;
  }));
  document.getElementById('noModels').hidden = matches.length > 0;
}
function renderMotherboards() {
  const family = getFamily();
  if (!family || !selection.model) return;
  const allBoards = (motherboardsBySocket[family.socket] || []).map(board => ({ ...board, socket: family.socket }));
  const query = motherboardSearch.value.trim().toLocaleLowerCase('tr-TR');
  const boards = allBoards.filter(board => `${board.name} ${board.chipset} ${board.memory} ${board.form}`.toLocaleLowerCase('tr-TR').includes(query));
  document.getElementById('motherboardSocketLabel').textContent = `${modelLabel(family, selection.model)} · ${family.socket}`;
  document.getElementById('motherboardCount').textContent = `${boards.length} uyumlu örnek model · ${family.socket}`;
  motherboardChoices.replaceChildren(...boards.map(board => {
    const article = document.createElement('article');
    article.className = 'motherboard-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'motherboard-choice';
    button.dataset.motherboard = board.id;
    button.setAttribute('aria-pressed', String(selection.motherboard === board.id));
    const heading = document.createElement('span'); heading.className = 'motherboard-name'; heading.textContent = board.name;
    const badges = document.createElement('span'); badges.className = 'motherboard-badges';
    [board.memory, board.form].forEach(label => { const badge = document.createElement('span'); badge.textContent = label; badges.append(badge); });
    const specs = document.createElement('span'); specs.className = 'motherboard-specs';
    specs.textContent = `${board.chipset} · ${board.socket}`;
    const note = document.createElement('span'); note.className = 'motherboard-note'; note.textContent = board.note || 'Bu anakart soketi seçtiğin işlemci ailesiyle eşleşiyor.';
    button.append(heading, badges, specs, note);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = board.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noMotherboards').hidden = boards.length > 0;
}
function renderRamKits() {
  const board = getMotherboard();
  if (!board) return;
  const allKits = ramKitsByType[board.memory] || [];
  const capacities = [...new Set(allKits.map(kit => kit.capacity))].sort((a, b) => a - b);
  if (!capacities.includes(Number(selection.ramCapacity))) selection.ramCapacity = capacities.includes(32) ? 32 : capacities[0];
  document.getElementById('ramTypeLabel').textContent = `${board.name} · ${board.memory}`;
  document.getElementById('ramCount').textContent = `${allKits.length} örnek kit · anakart bellek türü: ${board.memory}`;
  document.querySelectorAll('[data-ram-capacity]').forEach(button => {
    const capacity = Number(button.dataset.ramCapacity);
    button.hidden = !capacities.includes(capacity);
    button.setAttribute('aria-pressed', String(capacity === Number(selection.ramCapacity)));
  });
  const query = ramSearch.value.trim().toLocaleLowerCase('tr-TR');
  const kits = allKits.filter(kit => kit.capacity === Number(selection.ramCapacity) && `${kit.name} ${kit.spec} ${kit.code}`.toLocaleLowerCase('tr-TR').includes(query));
  ramChoices.replaceChildren(...kits.map(kit => {
    const article = document.createElement('article');
    article.className = 'ram-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ram-choice';
    button.dataset.ram = kit.id;
    button.setAttribute('aria-pressed', String(selection.ram === kit.id));
    const name = document.createElement('strong'); name.textContent = kit.name;
    const spec = document.createElement('span'); spec.className = 'ram-spec'; spec.textContent = kit.spec;
    const code = document.createElement('small'); code.textContent = `Ürün kodu: ${kit.code}`;
    button.append(name, spec, code);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = kit.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici ürün sayfası ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noRam').hidden = kits.length > 0;
}
function renderGraphicsCards() {
  const cards = graphicsCards[selection.gpuBrand] || [];
  document.getElementById('gpuModelArea').hidden = !selection.gpuBrand;
  document.getElementById('gpuBrandLabel').textContent = selection.gpuBrand || 'Marka seçilmedi';
  document.querySelectorAll('[data-gpu-brand]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.gpuBrand === selection.gpuBrand)));
  document.getElementById('gpuCount').textContent = `${cards.length} örnek model · ${selection.gpuBrand === 'NVIDIA' ? 'GeForce RTX' : 'Radeon RX'} ürün ailesi`;
  const query = gpuSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = cards.filter(card => `${card.name} ${card.series}`.toLocaleLowerCase('tr-TR').includes(query));
  gpuChoices.replaceChildren(...matches.map(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.gpu = card.id;
    button.setAttribute('aria-pressed', String(selection.gpu === card.id));
    const name = document.createElement('strong'); name.textContent = card.name;
    const series = document.createElement('span'); series.textContent = `${card.series} · üretici model ailesi`;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = selection.gpuBrand;
    button.append(name, series, chip);
    return button;
  }));
  document.getElementById('noGpu').hidden = matches.length > 0 || !selection.gpuBrand;
}
function renderStorageProducts() {
  const products = storageProducts[selection.storageType] || [];
  document.getElementById('storageModelArea').hidden = !selection.storageType;
  document.querySelectorAll('[data-storage-type]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.storageType === selection.storageType)));
  const typeNames = { nvme: 'NVMe M.2 SSD', sata: 'SATA SSD', hdd: 'HDD' };
  document.getElementById('storageTypeLabel').textContent = typeNames[selection.storageType] || 'Depolama';
  document.getElementById('storageCount').textContent = `${products.length} örnek model · ${typeNames[selection.storageType] || 'Önce depolama türü seç'}`;
  const query = storageSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = products.filter(product => `${product.name} ${product.spec} ${product.code}`.toLocaleLowerCase('tr-TR').includes(query));
  storageChoices.replaceChildren(...matches.map(product => {
    const article = document.createElement('article');
    article.className = 'storage-product-entry';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.storage = product.id;
    button.setAttribute('aria-pressed', String(selection.storage === product.id));
    const name = document.createElement('strong'); name.textContent = product.name;
    const spec = document.createElement('span'); spec.textContent = product.spec;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = `${product.capacity} · ${product.code}`;
    button.append(name, spec, chip);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = product.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici ürün bilgisi ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noStorage').hidden = matches.length > 0 || !selection.storageType;
}
function renderCases() {
  const board = getMotherboard();
  if (!board) return;
  const compatible = pcCases.filter(item => item.supports.includes(board.form));
  document.getElementById('caseBoardLabel').textContent = `${board.name} · ${board.form}`;
  document.getElementById('caseCount').textContent = `${compatible.length} uyumlu örnek kasa · ${board.form} anakart desteği`;
  const query = caseSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = compatible.filter(item => `${item.name} ${item.note} ${item.supports.join(' ')}`.toLocaleLowerCase('tr-TR').includes(query));
  caseChoices.replaceChildren(...matches.map(item => {
    const article = document.createElement('article');
    article.className = 'case-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-choice';
    button.dataset.case = item.id;
    button.setAttribute('aria-pressed', String(selection.pcCase === item.id));
    const name = document.createElement('strong'); name.className = 'case-name'; name.textContent = item.name;
    const note = document.createElement('span'); note.className = 'case-note'; note.textContent = item.note;
    const tags = document.createElement('span'); tags.className = 'motherboard-badges';
    [`GPU ${item.gpu} mm`, `Soğutucu ${item.cooler} mm`, `PSU ${item.psu} mm`].forEach(label => { const tag = document.createElement('span'); tag.textContent = label; tags.append(tag); });
    const support = document.createElement('span'); support.className = 'case-note'; support.textContent = `Anakart desteği: ${item.supports.join(' · ')}`;
    button.append(name, note, tags, support);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noCases').hidden = matches.length > 0;
}
function renderPowerSupplies() {
  const gpu = getGraphicsCard();
  const selectedCase = getCase();
  if (!gpu || !selectedCase) return;
  const compatible = powerSupplies.filter(item => item.watts >= gpu.psuMin && item.length <= selectedCase.psu);
  document.getElementById('psuGpuLabel').textContent = `${gpu.name} · üretici önerisi en az ${gpu.psuMin} W`;
  document.getElementById('psuCount').textContent = `${compatible.length} uygun örnek · ${gpu.psuMin} W ve üzeri · kasa PSU sınırı ${selectedCase.psu} mm`;
  const query = psuSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = compatible.filter(item => `${item.name} ${item.spec} ${item.watts} W`.toLocaleLowerCase('tr-TR').includes(query));
  psuChoices.replaceChildren(...matches.map(item => {
    const article = document.createElement('article');
    article.className = 'psu-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'psu-choice';
    button.dataset.psu = item.id;
    button.setAttribute('aria-pressed', String(selection.psu === item.id));
    const name = document.createElement('strong'); name.className = 'psu-name'; name.textContent = item.name;
    const watts = document.createElement('span'); watts.className = 'psu-watts'; watts.textContent = `${item.watts} W · ${item.length} mm uzunluk`;
    const spec = document.createElement('span'); spec.className = 'psu-spec'; spec.textContent = item.spec;
    button.append(name, watts, spec);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noPsu').hidden = matches.length > 0;
}
function updateStage() {
  updateSummary();
  if (!selection.brand) { showStage('brand'); return; }
  showFamilies();
  if (!selection.family || !getFamily()) { showStage('family'); return; }
  showStage('model');
  renderModels();
  if (!selection.model) return;
  showStage('motherboard');
  renderMotherboards();
  if (!selection.motherboard) return;
  showStage('ram');
  renderRamKits();
  if (!selection.ram) return;
  showStage('gpu');
  renderGraphicsCards();
  if (!selection.gpu) return;
  showStage('storage');
  renderStorageProducts();
  if (!selection.storage) return;
  showStage('case');
  renderCases();
  if (!selection.pcCase) return;
  showStage('psu');
  renderPowerSupplies();
}

document.querySelectorAll('[data-brand]').forEach(button => button.addEventListener('click', () => {
  selection = { brand: button.dataset.brand, family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  message.textContent = '';
  updateStage();
}));
familyChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-family]');
  if (!button) return;
  const oldSocket = getFamily()?.socket;
  const newSocket = (processorFamilies[selection.brand] || []).find(family => family.id === button.dataset.family)?.socket;
  if (oldSocket && newSocket !== oldSocket) { selection.motherboard = ''; selection.ram = ''; }
  selection.family = button.dataset.family;
  selection.model = '';
  modelSearch.value = '';
  message.textContent = '';
  updateStage();
});
modelChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-model]');
  if (!button) return;
  selection.model = button.dataset.model;
  updateStage();
  message.textContent = 'İşlemcin kaydedildi. Şimdi yalnızca bu soketle uyumlu anakartları seçebilirsin.';
});
modelSearch.addEventListener('input', renderModels);
document.getElementById('backToBrand').addEventListener('click', () => {
  selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  updateStage();
});
document.getElementById('backToFamily').addEventListener('click', () => {
  selection.family = '';
  selection.model = '';
  selection.motherboard = '';
  updateStage();
});
document.getElementById('editCpu').addEventListener('click', () => {
  showStage(selection.family ? 'model' : selection.brand ? 'family' : 'brand');
  if (selection.family) renderModels();
});
document.getElementById('resetBuilder').addEventListener('click', () => {
  selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  modelSearch.value = '';
  message.textContent = '';
  updateStage();
});
document.getElementById('motherboardStepButton').addEventListener('click', () => {
  if (!selection.model) return;
  showStage('motherboard');
  updateSummary();
  renderMotherboards();
});
document.getElementById('ramStepButton').addEventListener('click', () => {
  if (!selection.motherboard) return;
  showStage('ram'); updateSummary(); renderRamKits();
});
document.getElementById('cpuStepButton').addEventListener('click', () => {
  if (!selection.brand) { showStage('brand'); return; }
  if (!selection.family) { showFamilies(); showStage('family'); return; }
  showStage('model'); renderModels();
});
document.getElementById('backToCpuModels').addEventListener('click', () => {
  showStage('model'); renderModels();
});
motherboardSearch.addEventListener('input', renderMotherboards);
motherboardChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-motherboard]');
  if (!button) return;
  const previousBoard = getMotherboard();
  const selectedBoard = (motherboardsBySocket[getFamily()?.socket] || []).find(board => board.id === button.dataset.motherboard);
  if (previousBoard?.memory !== selectedBoard?.memory) selection.ram = '';
  selection.motherboard = button.dataset.motherboard;
  updateStage();
  message.textContent = 'Anakart seçildi. Şimdi uygun bellek türü ve kit kapasitesini seçebilirsin.';
});
document.getElementById('editMotherboard').addEventListener('click', () => {
  showStage('motherboard'); updateSummary(); renderMotherboards();
});
document.getElementById('backToMotherboard').addEventListener('click', () => {
  showStage('motherboard'); renderMotherboards();
});
document.querySelectorAll('[data-ram-capacity]').forEach(button => button.addEventListener('click', () => {
  selection.ramCapacity = Number(button.dataset.ramCapacity);
  message.textContent = '';
  renderRamKits();
}));
ramSearch.addEventListener('input', renderRamKits);
ramChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-ram]');
  if (!button) return;
  selection.ram = button.dataset.ram;
  updateStage();
  message.textContent = 'RAM seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editRam').addEventListener('click', () => {
  showStage('ram'); updateSummary(); renderRamKits();
});
document.getElementById('gpuStepButton').addEventListener('click', () => {
  if (!selection.ram) return;
  showStage('gpu'); renderGraphicsCards();
});
document.getElementById('backToRam').addEventListener('click', () => {
  showStage('ram'); renderRamKits();
});
document.querySelectorAll('[data-gpu-brand]').forEach(button => button.addEventListener('click', () => {
  if (selection.gpuBrand !== button.dataset.gpuBrand) selection.gpu = '';
  selection.gpuBrand = button.dataset.gpuBrand;
  gpuSearch.value = '';
  updateSummary(); renderGraphicsCards();
  message.textContent = '';
}));
gpuSearch.addEventListener('input', renderGraphicsCards);
gpuChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-gpu]');
  if (!button) return;
  selection.gpu = button.dataset.gpu;
  updateStage();
  message.textContent = 'Ekran kartı seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editGpu').addEventListener('click', () => {
  showStage('gpu'); renderGraphicsCards();
});
document.getElementById('storageStepButton').addEventListener('click', () => {
  if (!selection.gpu) return;
  showStage('storage'); renderStorageProducts();
});
document.getElementById('backToGpu').addEventListener('click', () => {
  showStage('gpu'); renderGraphicsCards();
});
document.querySelectorAll('[data-storage-type]').forEach(button => button.addEventListener('click', () => {
  if (selection.storageType !== button.dataset.storageType) selection.storage = '';
  selection.storageType = button.dataset.storageType;
  storageSearch.value = '';
  updateSummary(); renderStorageProducts();
  message.textContent = '';
}));
storageSearch.addEventListener('input', renderStorageProducts);
storageChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-storage]');
  if (!button) return;
  selection.storage = button.dataset.storage;
  updateStage();
  message.textContent = 'Depolama seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editStorage').addEventListener('click', () => {
  showStage('storage'); renderStorageProducts();
});
document.getElementById('caseStepButton').addEventListener('click', () => {
  if (!selection.storage) return;
  showStage('case'); renderCases();
});
document.getElementById('backToStorage').addEventListener('click', () => {
  showStage('storage'); renderStorageProducts();
});
caseSearch.addEventListener('input', renderCases);
caseChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-case]');
  if (!button) return;
  selection.pcCase = button.dataset.case;
  updateStage();
  message.textContent = 'Kasan anakart boyutunla uyumlu ve sistem özetine eklendi.';
});
document.getElementById('editCase').addEventListener('click', () => {
  showStage('case'); renderCases();
});
document.getElementById('psuStepButton').addEventListener('click', () => {
  if (!selection.pcCase || !selection.gpu) return;
  showStage('psu'); renderPowerSupplies();
});
document.getElementById('backToCase').addEventListener('click', () => {
  showStage('case'); renderCases();
});
psuSearch.addEventListener('input', renderPowerSupplies);
psuChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-psu]');
  if (!button) return;
  selection.psu = button.dataset.psu;
  updateStage();
  message.textContent = 'Güç kaynağı seçimin ekran kartı gereksinimine ve kasa uzunluk sınırına uyuyor.';
});
document.getElementById('editPsu').addEventListener('click', () => {
  showStage('psu'); renderPowerSupplies();
});
updateStage();
