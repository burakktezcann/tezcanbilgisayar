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

const storageKey = 'tezcan-system-builder-cpu-v1';
const brandStep = document.getElementById('brandStep');
const familyStep = document.getElementById('familyStep');
const modelStep = document.getElementById('modelStep');
const motherboardStep = document.getElementById('motherboardStep');
const ramStep = document.getElementById('ramStep');
const familyChoices = document.getElementById('familyChoices');
const modelChoices = document.getElementById('modelChoices');
const motherboardChoices = document.getElementById('motherboardChoices');
const ramChoices = document.getElementById('ramChoices');
const modelSearch = document.getElementById('modelSearch');
const motherboardSearch = document.getElementById('motherboardSearch');
const ramSearch = document.getElementById('ramSearch');
const message = document.getElementById('builderMessage');
let selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };

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
  document.getElementById('selectionTitle').textContent = stage === 'brand' ? 'İşlemci markanı seç' : stage === 'family' ? 'İşlemci ailesini seç' : stage === 'model' ? 'İşlemci modelini seç' : stage === 'motherboard' ? 'Anakartını seç' : 'Belleğini seç';
  document.getElementById('selectionDescription').textContent = stage === 'brand'
    ? 'AMD ve Intel işlemcileri arasından tercih yap.'
    : stage === 'family'
      ? 'Seçtiğin markanın işlemci ailesini belirle.'
      : stage === 'model'
        ? 'Resmi model adını seç; fiyat ve stok bilgisi kataloğa eklendiğinde bağlanacak.'
        : stage === 'motherboard' ? 'Seçtiğin işlemcinin soketine uyan anakart modelleri gösteriliyor.' : 'Seçtiğin anakartın desteklediği bellek türü ve gerçek kit modelleri listeleniyor.';
  document.getElementById('selectionEyebrow').textContent = stage === 'brand' ? 'ADIM 1 · İŞLEMCİ MARKASI' : stage === 'family' ? 'ADIM 1 · İŞLEMCİ AİLESİ' : stage === 'model' ? 'ADIM 1 · İŞLEMCİ MODELİ' : stage === 'motherboard' ? 'ADIM 2 · ANAKART' : 'ADIM 3 · BELLEK (RAM)';
  const cpuButton = document.getElementById('cpuStepButton');
  const boardButton = document.getElementById('motherboardStepButton');
  const ramButton = document.getElementById('ramStepButton');
  const cpuCurrent = stage !== 'motherboard';
  const boardCurrent = stage === 'motherboard';
  const ramCurrent = stage === 'ram';
  cpuButton.classList.toggle('is-current', cpuCurrent);
  boardButton.classList.toggle('is-current', boardCurrent);
  ramButton.classList.toggle('is-current', ramCurrent);
  if (cpuCurrent) cpuButton.setAttribute('aria-current', 'step'); else cpuButton.removeAttribute('aria-current');
  if (boardCurrent) boardButton.setAttribute('aria-current', 'step'); else boardButton.removeAttribute('aria-current');
  if (ramCurrent) ramButton.setAttribute('aria-current', 'step'); else ramButton.removeAttribute('aria-current');
}
function updateSummary() {
  const family = getFamily();
  const hasModel = Boolean(family && family.models.includes(selection.model));
  if (!hasModel) selection.model = '';
  let board = getMotherboard();
  if (board && (!hasModel || board.socket && board.socket !== family.socket)) { selection.motherboard = ''; board = null; }
  const ram = getRamKit();
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
  const completed = Number(hasModel) + Number(Boolean(board)) + Number(Boolean(ram));
  document.getElementById('progressCount').innerHTML = `${completed} <small>/ 7</small>`;
  document.getElementById('stepCount').textContent = `${completed} / 7`;
  document.getElementById('summaryProgress').textContent = `${completed} / 7`;
  document.getElementById('progressCaption').textContent = ram ? 'İşlemci, anakart ve RAM seçildi · ekran kartı sırada' : board ? 'İşlemci ve anakart seçildi · RAM sırada' : hasModel ? 'İşlemcin seçildi · uyumlu anakart seç' : 'İşlemci seçimi bekleniyor';
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
updateStage();
