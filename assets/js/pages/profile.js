const config = window.SUPABASE_CONFIG || {};
const client = config.url && config.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(config.url, config.publishableKey)
  : null;
const loading = document.getElementById('profileLoading');
const content = document.getElementById('profileContent');
const setup = document.getElementById('profileSetup');
const message = document.getElementById('profileMessage');
const profileForm = document.getElementById('profileForm');
const addressForm = document.getElementById('addressForm');
const addressList = document.getElementById('addressList');
const cancelAddressEdit = document.getElementById('cancelAddressEdit');
const changePasswordForm = document.getElementById('changePasswordForm');
const communicationPreferencesForm = document.getElementById('communicationPreferencesForm');
const communicationPreferencesNote = document.getElementById('communicationPreferencesNote');
const emailUpdatesPreference = document.getElementById('emailUpdatesPreference');
const addressEditor = document.getElementById('addressEditor');
const savedSystemList = document.getElementById('savedSystemList');
const systemsLoadNote = document.getElementById('systemsLoadNote');
const ownedDeviceList = document.getElementById('ownedDeviceList');
const ownedDevicesNote = document.getElementById('ownedDevicesNote');
const ownedDeviceForm = document.getElementById('ownedDeviceForm');
const ownedDeviceEditor = document.getElementById('ownedDeviceEditor');
const ownedDeviceType = document.getElementById('ownedDeviceType');
const ownedLaptopFields = document.getElementById('ownedLaptopFields');
const ownedDesktopFields = document.getElementById('ownedDesktopFields');
let savedSystemBuilds = [];
let ownedDevices = [];
let currentUser = null;
let addresses = [];
let defaultAddressFeatureReady = true;
let communicationPreferencesReady = true;

function openProfilePanel(name, updateHash = true) {
  const panelName = ['overview', 'personal', 'addresses', 'security', 'systems', 'owned', 'preferences', 'cards', 'iban'].includes(name) ? name : 'overview';
  document.querySelectorAll('[data-profile-panel]').forEach(panel => { panel.hidden = panel.dataset.profilePanel !== panelName; });
  document.querySelectorAll('.profile-nav [data-profile-tab]').forEach(button => {
    if (button.dataset.profileTab === panelName) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (updateHash && location.hash !== `#${panelName}`) history.replaceState(null, '', `#${panelName}`);
}
function updateOverviewStats() {
  const systemCount = savedSystemBuilds.length;
  const addressCount = addresses.length;
  const systemCountEl = document.getElementById('overviewSystemCount');
  const systemDetailEl = document.getElementById('overviewSystemDetail');
  const addressCountEl = document.getElementById('overviewAddressCount');
  const addressDetailEl = document.getElementById('overviewAddressDetail');
  if (systemCountEl) systemCountEl.textContent = `${systemCount} / 3`;
  if (systemDetailEl) systemDetailEl.textContent = systemCount ? `${systemCount} kayıtlı taslak` : 'Kayıtlı sistemin yok';
  if (addressCountEl) addressCountEl.textContent = String(addressCount);
  if (addressDetailEl) addressDetailEl.textContent = addressCount ? `${addressCount} adres hesabında kayıtlı` : 'Henüz adres eklemedin';
}

document.getElementById('profileContent').addEventListener('click', event => {
  const tab = event.target.closest('[data-profile-tab]');
  if (!tab) return;
  openProfilePanel(tab.dataset.profileTab);
  if (tab.id === 'addAddress') openAddressEditor();
});

function openAddressEditor() {
  addressEditor.hidden = false;
  document.getElementById('addAddress').hidden = true;
  cancelAddressEdit.hidden = false;
  addressEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('addressLabel').focus({ preventScroll: true });
}

function closeAddressEditor() {
  addressEditor.hidden = true;
  document.getElementById('addAddress').hidden = false;
}

function isMissingDefaultAddressColumn(error) {
  return error?.code === '42703' || /is_default.*does not exist|column.*is_default/i.test(String(error?.message || ''));
}
function isMissingCommunicationPreferenceColumn(error) {
  return error?.code === '42703' || /email_marketing_opt_in.*does not exist|column.*email_marketing_opt_in/i.test(String(error?.message || ''));
}
async function fetchAddresses(userId) {
  let result = await client.from('customer_addresses')
    .select('id, label, recipient_name, phone, address_line, district, city, postal_code, is_default, created_at')
    .eq('user_id', userId)
    .order('is_default', { ascending: false }).order('created_at', { ascending: false });
  if (isMissingDefaultAddressColumn(result.error)) {
    defaultAddressFeatureReady = false;
    document.querySelector('.default-address-check').hidden = true;
    result = await client.from('customer_addresses')
      .select('id, label, recipient_name, phone, address_line, district, city, postal_code, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }
  return result;
}

function showMessage(text, kind = '') {
  message.textContent = text;
  message.dataset.kind = kind;
}
function setFormButton(form, disabled) {
  form.querySelector('button[type="submit"]').disabled = disabled;
}
function showSetup() {
  loading.hidden = true;
  setup.hidden = false;
}
function clearAddressForm() {
  addressForm.reset();
  document.getElementById('addressId').value = '';
  document.getElementById('addressFormTitle').textContent = 'Yeni adres ekle';
  document.getElementById('saveAddress').textContent = 'Adresi kaydet';
  document.getElementById('addressIsDefault').checked = defaultAddressFeatureReady && !addresses.some(address => address.is_default);
  cancelAddressEdit.hidden = true;
  closeAddressEditor();
}
function renderAddresses() {
  updateOverviewStats();
  addressList.replaceChildren();
  if (!addresses.length) {
    const empty = document.createElement('div');
    empty.className = 'saved-address-empty';
    empty.textContent = 'Henüz kayıtlı adresin yok. Başlamak için “Adres ekle” düğmesine tıkla.';
    addressList.append(empty);
    return;
  }
  addresses.forEach(address => {
    const card = document.createElement('article');
    card.className = 'saved-address';
    const top = document.createElement('div');
    top.className = 'saved-address-top';
    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = address.label;
    if (address.is_default) {
      const badge = document.createElement('span');
      badge.className = 'default-address-badge';
      badge.textContent = 'Varsayılan';
      title.append(' ', badge);
    }
    const recipient = document.createElement('p');
    recipient.textContent = address.recipient_name;
    const addressLine = document.createElement('p');
    addressLine.textContent = [address.address_line, address.district, address.city, address.postal_code].filter(Boolean).join(', ');
    const phone = document.createElement('p');
    phone.textContent = address.phone;
    info.append(title, recipient, addressLine, phone);
    const actions = document.createElement('div');
    actions.className = 'saved-address-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Düzenle';
    edit.dataset.editAddress = address.id;
    if (defaultAddressFeatureReady && !address.is_default) {
      const makeDefault = document.createElement('button');
      makeDefault.type = 'button';
      makeDefault.textContent = 'Varsayılan yap';
      makeDefault.dataset.defaultAddress = address.id;
      actions.append(makeDefault);
    }
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Sil';
    remove.dataset.deleteAddress = address.id;
    actions.append(edit, remove);
    top.append(info, actions);
    card.append(top);
    addressList.append(card);
  });
}

const savedComponentNames = {
  'asus-tuf-b760-plus-wifi': 'ASUS TUF GAMING B760-PLUS WIFI', 'asus-prime-b760m-a-d4': 'ASUS PRIME B760M-A D4', 'msi-mag-b760-tomahawk-wifi': 'MSI MAG B760 TOMAHAWK WIFI',
  'asus-tuf-z890-plus-wifi': 'ASUS TUF GAMING Z890-PLUS WIFI', 'asus-prime-b860m-a-wifi': 'ASUS PRIME B860M-A WIFI', 'msi-pro-z890-s-wifi-pz': 'MSI PRO Z890-S WIFI PZ',
  'asus-tuf-b650-plus-wifi': 'ASUS TUF GAMING B650-PLUS WIFI', 'asus-prime-b650m-a-wifi-ii': 'ASUS PRIME B650M-A WIFI II',
  'kingston-fury-beast-ddr4-16': 'Kingston FURY Beast 16 GB DDR4', 'kingston-fury-beast-ddr4-32': 'Kingston FURY Beast 32 GB DDR4', 'kingston-fury-beast-ddr4-64': 'Kingston FURY Beast 64 GB DDR4',
  'kingston-fury-beast-ddr5-32': 'Kingston FURY Beast 32 GB DDR5', 'corsair-vengeance-ddr5-32': 'CORSAIR VENGEANCE 32 GB DDR5', 'kingston-fury-beast-ddr5-64': 'Kingston FURY Beast 64 GB DDR5',
  'bequiet-pure-rock-3-black': 'be quiet! PURE ROCK 3 Black', 'arctic-liquid-freezer-iii-pro-240': 'ARCTIC Liquid Freezer III Pro 240', 'nzxt-kraken-plus-240': 'NZXT Kraken Plus 240',
  'nzxt-h5-flow': 'NZXT H5 Flow', 'corsair-4000d-airflow': 'CORSAIR 4000D Airflow', 'asus-prime-ap201': 'ASUS Prime AP201', 'cooler-master-q300l': 'Cooler Master MasterBox Q300L',
  'corsair-rm650e': 'CORSAIR RM650e', 'seasonic-focus-gx-750': 'Seasonic FOCUS GX-750', 'corsair-rm750e': 'CORSAIR RM750e', 'msi-mag-a850gl': 'MSI MAG A850GL PCIE5', 'corsair-rm850e': 'CORSAIR RM850e', 'corsair-rm1000e': 'CORSAIR RM1000e',
  'samsung-990-evo-plus-1tb': 'Samsung 990 EVO Plus 1 TB', 'samsung-990-evo-plus-2tb': 'Samsung 990 EVO Plus 2 TB', 'crucial-mx500-1tb': 'Crucial MX500 1 TB', 'samsung-870-evo-1tb': 'Samsung 870 EVO 1 TB', 'wd-blue-1tb': 'WD Blue 1 TB HDD', 'wd-blue-2tb': 'WD Blue 2 TB HDD'
};
function displaySystemComponent(id, payload) {
  if (id === 'cpu') {
    if (!payload.model) return '';
    const familyNames = { i3: 'Core i3', i5: 'Core i5', i7: 'Core i7', i9: 'Core i9', ultra5: 'Core Ultra 5', ultra7: 'Core Ultra 7', ultra9: 'Core Ultra 9', ryzen5: 'Ryzen 5', ryzen7: 'Ryzen 7', ryzen9: 'Ryzen 9' };
    const brand = payload.brand === 'intel' ? 'Intel' : payload.brand === 'amd' ? 'AMD' : '';
    return `${brand} ${familyNames[payload.family] || payload.family || ''} ${payload.model}`.trim();
  }
  const value = payload[id];
  if (!value) return '';
  if (id === 'gpu') {
    if (value.startsWith('geforce-')) return `NVIDIA GeForce ${value.replace('geforce-rtx-', '').replaceAll('-', ' ').toUpperCase()}`;
    if (value.startsWith('radeon-')) return `AMD Radeon ${value.replace('radeon-rx-', 'RX ').replaceAll('-', ' ').toUpperCase()}`;
  }
  if (id === 'motherboard' && savedComponentNames[value]) return savedComponentNames[value];
  return savedComponentNames[value] || value.replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}
function renderSavedSystems() {
  if (!savedSystemList) return;
  updateOverviewStats();
  const buildBySlot = new Map(savedSystemBuilds.map(row => [Number(row.slot), row]));
  savedSystemList.replaceChildren(...[1, 2, 3].map(slot => {
    const row = buildBySlot.get(slot);
    const payload = row?.payload || {};
    const parts = [
      ['cpu', 'İşlemci'], ['motherboard', 'Anakart'], ['ram', 'RAM'], ['gpu', 'Ekran kartı'],
      ['storage', 'Depolama'], ['pcCase', 'Kasa'], ['cooler', 'Soğutucu'], ['psu', 'Güç kaynağı']
    ].map(([key, label]) => [label, displaySystemComponent(key, payload)]).filter(([, value]) => value);
    const card = document.createElement('article'); card.className = `saved-system-card${row ? '' : ' is-empty'}`;
    const top = document.createElement('div'); top.className = 'saved-system-card-top';
    const title = document.createElement('h3'); title.textContent = `${slot}. Sistem`;
    const badge = document.createElement('span'); badge.className = 'saved-system-status'; badge.textContent = row ? (parts.length >= 8 ? 'Tamamlandı' : 'Taslak') : 'Boş';
    top.append(title, badge);
    const summary = document.createElement('p'); summary.className = 'saved-system-summary';
    summary.textContent = row ? (parts.length ? `${parts.length} parça seçildi · ${parts.slice(0, 2).map(([, value]) => value).join(' · ')}` : 'Taslak henüz parça içermiyor.') : 'Yeni bir sistem toplamaya başla.';
    card.append(top, summary);
    if (row && parts.length) {
      const list = document.createElement('ul'); list.className = 'saved-system-parts';
      parts.forEach(([label, value]) => { const li = document.createElement('li'); const key = document.createElement('span'); key.textContent = label; const name = document.createElement('strong'); name.textContent = value; li.append(key, name); list.append(li); });
      card.append(list);
    }
    const link = document.createElement('a'); link.className = 'account-submit account-link-button'; link.href = `sistem-topla.html?system=${slot}`; link.textContent = row ? 'Sistemi düzenle' : 'Sistem oluştur'; card.append(link);
    return card;
  }));
}
async function loadSavedSystems() {
  if (!savedSystemList || !currentUser) return;
  const { data, error } = await client.from('customer_system_builds').select('slot,payload,updated_at').eq('user_id', currentUser.id).order('slot');
  if (error) {
    systemsLoadNote.hidden = false;
    systemsLoadNote.textContent = 'Bulut eşitlemesi için veritabanı güncellemesi gerekiyor. Bu cihazda bulunan taslakların yine burada görünebilir.';
    try {
      const local = JSON.parse(localStorage.getItem(`tezcan-system-builder-cpu-v1-user-${currentUser.id}`) || '{}');
      savedSystemBuilds = [1, 2, 3].filter(slot => local.systems?.[`system-${slot}`]).map(slot => ({ slot, payload: local.systems[`system-${slot}`] }));
    } catch { savedSystemBuilds = []; }
  } else {
    systemsLoadNote.hidden = true;
    savedSystemBuilds = data || [];
  }
  renderSavedSystems();
}

const ownedDesktopFieldsMap = [
  ['cpu', 'İşlemci', 'ownedDesktopCpu', 'ownedDesktopCpuDetail'], ['motherboard', 'Anakart', 'ownedDesktopMotherboard', 'ownedDesktopMotherboardDetail'],
  ['ram', 'RAM', 'ownedDesktopRam', 'ownedDesktopRamDetail'], ['gpu', 'Ekran kartı', 'ownedDesktopGpu', 'ownedDesktopGpuDetail'],
  ['storage', 'SSD / Depolama', 'ownedDesktopStorage', 'ownedDesktopStorageDetail'], ['case', 'Kasa', 'ownedDesktopCase', 'ownedDesktopCaseDetail'],
  ['cooling', 'Soğutucu', 'ownedDesktopCooling', 'ownedDesktopCoolingDetail'], ['psu', 'Güç kaynağı', 'ownedDesktopPsu', 'ownedDesktopPsuDetail']
];
const ownedLaptopFieldsMap = [
  ['brand', 'Marka', 'ownedLaptopBrand'], ['model', 'Model', 'ownedLaptopModel'], ['processor', 'İşlemci', 'ownedLaptopCpu'],
  ['ram', 'RAM', 'ownedLaptopRam'], ['storage', 'Depolama', 'ownedLaptopStorage'], ['graphics', 'Ekran kartı', 'ownedLaptopGpu'],
  ['screen', 'Ekran', 'ownedLaptopScreen'], ['os', 'İşletim sistemi', 'ownedLaptopOs']
];
const ownedDeviceSeries = {
  cpu: {
    Intel: ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core 3', 'Core 5', 'Core 7', 'Core Ultra 5', 'Core Ultra 7', 'Core Ultra 9'],
    AMD: ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'Ryzen Threadripper']
  },
  motherboard: {
    ASUS: ['ROG', 'TUF Gaming', 'PRIME', 'ProArt'], MSI: ['MEG', 'MPG', 'MAG', 'PRO'],
    GIGABYTE: ['AORUS', 'GAMING', 'UD', 'DS3H'], ASRock: ['Taichi', 'Steel Legend', 'Pro RS', 'Pro']
  },
  ram: {
    Kingston: ['FURY Beast', 'FURY Renegade', 'ValueRAM'], CORSAIR: ['VENGEANCE', 'Dominator'],
    Samsung: ['DDR4', 'DDR5'], 'G.SKILL': ['Ripjaws', 'Trident Z'], Crucial: ['Pro', 'Pro Overclocking']
  },
  storage: {
    Samsung: ['990 PRO', '990 EVO', '870 EVO'], Kingston: ['NV3', 'KC3000', 'FURY Renegade'],
    'Western Digital': ['WD_BLACK SN850X', 'WD Blue'], Crucial: ['P3 Plus', 'MX500'],
    Seagate: ['BarraCuda HDD', 'FireCuda SSD'], ADATA: ['LEGEND', 'XPG GAMMIX'], CORSAIR: ['MP600', 'MP700']
  },
  gpu: {
    NVIDIA: ['GeForce RTX 50 Serisi', 'GeForce RTX 40 Serisi', 'GeForce GTX'],
    AMD: ['Radeon RX 9000 Serisi', 'Radeon RX 7000 Serisi', 'Radeon RX 6000 Serisi'],
    ASUS: ['ROG', 'TUF Gaming', 'PRIME', 'Dual'], MSI: ['SUPRIM', 'GAMING', 'VENTUS'],
    GIGABYTE: ['AORUS', 'GAMING OC', 'EAGLE'], Sapphire: ['NITRO+', 'PULSE', 'PURE']
  },
  case: { CORSAIR: ['4000D', '3000D', '5000D'], NZXT: ['H5', 'H6', 'H7'], ASUS: ['Prime', 'TUF Gaming', 'ROG'], 'Cooler Master': ['MasterBox', 'MasterFrame'], 'Lian Li': ['LANCOOL', 'O11'], 'Fractal Design': ['Pop', 'North', 'Meshify'] },
  cooling: { ARCTIC: ['Freezer 36', 'Liquid Freezer'], NZXT: ['Kraken'], CORSAIR: ['iCUE H Series'], DeepCool: ['AK Series', 'LS Series'], 'Cooler Master': ['Hyper', 'MasterLiquid'], Noctua: ['NH Series'] },
  psu: { CORSAIR: ['RM Series', 'RMx Series'], MSI: ['MAG GL', 'MPG A Series'], Seasonic: ['FOCUS GX', 'VERTEX GX'], 'be quiet!': ['Pure Power', 'Straight Power'], FSP: ['Hydro G', 'Vita'], 'Cooler Master': ['MWE Gold', 'V Gold'] }
};
function updateOwnedDeviceDetail(category, selectedValue = '') {
  const row = ownedDesktopFieldsMap.find(([key]) => key === category);
  if (!row) return;
  const [, , brandId, detailId] = row;
  const brand = document.getElementById(brandId).value;
  const detail = document.getElementById(detailId);
  const options = ownedDeviceSeries[category]?.[brand] || (brand ? ['Diğer / bilmiyorum'] : []);
  detail.replaceChildren(new Option(brand ? 'Seri / aile seç' : 'Önce marka seç', ''));
  options.forEach(value => detail.add(new Option(value, value)));
  detail.disabled = !brand;
  detail.value = options.includes(selectedValue) ? selectedValue : '';
}
function resetOwnedDeviceDetails() {
  ownedDesktopFieldsMap.forEach(([key, , , detailId]) => {
    const detail = document.getElementById(detailId);
    detail.replaceChildren(new Option('Önce marka seç', ''));
    detail.disabled = true;
  });
}
ownedDesktopFieldsMap.forEach(([key, , brandId]) => {
  document.getElementById(brandId).addEventListener('change', () => updateOwnedDeviceDetail(key));
});
function updateOwnedDeviceTypeFields() {
  const isLaptop = ownedDeviceType.value === 'laptop';
  ownedLaptopFields.hidden = !isLaptop;
  ownedDesktopFields.hidden = !ownedDeviceType.value || isLaptop;
}
function clearOwnedDeviceForm() {
  ownedDeviceForm.reset();
  resetOwnedDeviceDetails();
  document.getElementById('ownedDeviceId').value = '';
  document.getElementById('ownedDeviceFormTitle').textContent = 'Bilgisayarını ekle';
  document.getElementById('saveOwnedDevice').textContent = 'Cihazı kaydet';
  ownedDeviceEditor.hidden = true;
  updateOwnedDeviceTypeFields();
}
function startOwnedDeviceEdit(device = null) {
  ownedDeviceForm.reset();
  resetOwnedDeviceDetails();
  document.getElementById('ownedDeviceId').value = device?.id || '';
  document.getElementById('ownedDeviceFormTitle').textContent = device ? 'Bilgisayar bilgilerini düzenle' : 'Bilgisayarını ekle';
  document.getElementById('saveOwnedDevice').textContent = device ? 'Değişiklikleri kaydet' : 'Cihazı kaydet';
  ownedDeviceType.value = device?.device_type || '';
  document.getElementById('ownedDeviceName').value = device?.name || '';
  const details = device?.details || {};
  if (device?.device_type === 'laptop') {
    ownedLaptopFieldsMap.forEach(([key, , id]) => { document.getElementById(id).value = details[key] || ''; });
  } else {
    ownedDesktopFieldsMap.forEach(([key, , brandId, detailId]) => {
      document.getElementById(brandId).value = details[key] || '';
      updateOwnedDeviceDetail(key, details[`${key}Detail`] || '');
    });
  }
  updateOwnedDeviceTypeFields();
  ownedDeviceEditor.hidden = false;
  ownedDeviceEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  ownedDeviceType.focus({ preventScroll: true });
}
function renderOwnedDevices() {
  if (!ownedDeviceList) return;
  ownedDeviceList.replaceChildren();
  if (!ownedDevices.length) {
    const empty = document.createElement('div');
    empty.className = 'saved-device-empty';
    const icon = document.createElement('span'); icon.setAttribute('aria-hidden', 'true'); icon.textContent = '▣';
    const title = document.createElement('strong'); title.textContent = 'Henüz bilgisayar eklemedin';
    const description = document.createElement('p'); description.textContent = 'Kullandığın cihazı ekleyerek özelliklerini tek bir yerde saklayabilirsin.';
    empty.append(icon, title, description);
    ownedDeviceList.append(empty);
    return;
  }
  ownedDevices.forEach(device => {
    const details = device.details || {};
    const card = document.createElement('article');
    card.className = 'saved-device-card';
    const top = document.createElement('div'); top.className = 'saved-device-card-top';
    const titleWrap = document.createElement('div');
    const type = document.createElement('span'); type.className = 'saved-device-type'; type.textContent = device.device_type === 'laptop' ? 'DİZÜSTÜ BİLGİSAYAR' : 'MASAÜSTÜ BİLGİSAYAR';
    const title = document.createElement('h3'); title.textContent = device.name || (device.device_type === 'laptop' ? [details.brand, details.model].filter(Boolean).join(' ') || 'Dizüstü bilgisayar' : 'Masaüstü bilgisayar');
    titleWrap.append(type, title);
    const actions = document.createElement('div'); actions.className = 'saved-device-actions';
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'secondary-button'; edit.dataset.editOwnedDevice = device.id; edit.textContent = 'Düzenle';
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'secondary-button'; remove.dataset.deleteOwnedDevice = device.id; remove.textContent = 'Sil';
    actions.append(edit, remove); top.append(titleWrap, actions); card.append(top);
    const rows = device.device_type === 'laptop'
      ? [['Marka', details.brand], ['Model', details.model], ['İşlemci', details.processor], ['RAM', details.ram], ['Depolama', details.storage], ['Ekran kartı', details.graphics], ['Ekran', details.screen], ['İşletim sistemi', details.os]]
      : ownedDesktopFieldsMap.map(([key, label]) => [label, [details[key], details[`${key}Detail`]].filter(Boolean).join(' · ')]);
    const list = document.createElement('dl'); list.className = 'saved-device-details';
    rows.filter(([, value]) => value).forEach(([label, value]) => { const item = document.createElement('div'); const key = document.createElement('dt'); key.textContent = label; const val = document.createElement('dd'); val.textContent = value; item.append(key, val); list.append(item); });
    if (!list.children.length) { const empty = document.createElement('p'); empty.className = 'saved-device-no-details'; empty.textContent = 'Henüz özellik eklenmemiş.'; card.append(empty); }
    else card.append(list);
    ownedDeviceList.append(card);
  });
}
async function loadOwnedDevices() {
  if (!currentUser || !ownedDeviceList) return;
  const { data, error } = await client.from('customer_owned_devices').select('id,device_type,name,details,created_at,updated_at').eq('user_id', currentUser.id).order('created_at', { ascending: false });
  if (error) {
    ownedDevicesNote.hidden = false;
    ownedDevicesNote.textContent = 'Cihaz kayıtlarını etkinleştirmek için yeni veritabanı güncellemesi uygulanmalı.';
    ownedDevices = [];
  } else {
    ownedDevicesNote.hidden = true;
    ownedDevices = data || [];
  }
  renderOwnedDevices();
}

async function loadAccount() {
  if (!client) {
    showSetup();
    return;
  }
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) {
    window.location.replace('hesap.html?next=hesabim');
    return;
  }
  currentUser = user;
  document.getElementById('profileEmail').textContent = user.email || '';
  document.dispatchEvent(new CustomEvent('account:ready', { detail: { user, name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Hesabım' } }));
  let profileResult = await client.from('profiles')
    .select('full_name, phone, email_marketing_opt_in')
    .eq('id', user.id)
    .maybeSingle();
  if (isMissingCommunicationPreferenceColumn(profileResult.error)) {
    communicationPreferencesReady = false;
    communicationPreferencesNote.hidden = false;
    emailUpdatesPreference.disabled = true;
    communicationPreferencesForm.querySelector('button[type="submit"]').disabled = true;
    profileResult = await client.from('profiles').select('full_name, phone').eq('id', user.id).maybeSingle();
  }
  const { data: profile, error: profileError } = profileResult;
  if (profileError || !profile) {
    showSetup();
    return;
  }
  const { data: addressRows, error: addressError } = await fetchAddresses(user.id);
  await loadSavedSystems();
  await loadOwnedDevices();
  if (addressError) {
    showSetup();
    return;
  }
  document.getElementById('profileFullName').value = profile.full_name || '';
  document.getElementById('profilePhone').value = profile.phone || '';
  emailUpdatesPreference.checked = communicationPreferencesReady && Boolean(profile.email_marketing_opt_in);
  document.getElementById('profileGreeting').textContent = (profile.full_name || user.email?.split('@')[0] || 'müşterimiz').split(' ')[0];
  addresses = (addressRows || []).map(address => ({ ...address, is_default: Boolean(address.is_default) }));
  updateOverviewStats();
  document.getElementById('addressSummary').textContent = addresses.length ? `${addresses.length} kayıtlı adres` : 'Henüz adres eklemedin';
  document.getElementById('addressIsDefault').checked = defaultAddressFeatureReady && !addresses.some(address => address.is_default);
  renderAddresses();
  loading.hidden = true;
  content.hidden = false;
  openProfilePanel(location.hash.slice(1) || 'overview', false);
}

profileForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || !currentUser) return;
  const form = new FormData(profileForm);
  const fullName = String(form.get('fullName') || '').trim();
  if (!fullName) {
    showMessage('Ad soyadını kontrol et.', 'error');
    return;
  }
  setFormButton(profileForm, true);
  showMessage('Bilgilerin kaydediliyor…');
  const { error } = await client.from('profiles').update({
    full_name: fullName,
    phone: String(form.get('phone') || '').trim() || null,
    updated_at: new Date().toISOString()
  }).eq('id', currentUser.id);
  setFormButton(profileForm, false);
  if (error) showMessage('Bilgiler kaydedilemedi. Lütfen tekrar dene.', 'error');
  else {
    await client.auth.updateUser({ data: { full_name: fullName } });
    document.getElementById('profileGreeting').textContent = fullName.split(' ')[0];
    document.dispatchEvent(new CustomEvent('account:profile-updated', { detail: { name: fullName } }));
    showMessage('Kişisel bilgilerin kaydedildi.', 'success');
  }
});

communicationPreferencesForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || !currentUser || !communicationPreferencesReady) return;
  setFormButton(communicationPreferencesForm, true);
  showMessage('Tercihin hesabına kaydediliyor…');
  const { error } = await client.from('profiles').update({ email_marketing_opt_in: emailUpdatesPreference.checked }).eq('id', currentUser.id);
  setFormButton(communicationPreferencesForm, false);
  if (error) showMessage('Tercihin kaydedilemedi. Lütfen tekrar dene.', 'error');
  else showMessage('İletişim tercihin hesabına kaydedildi.', 'success');
});

addressForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || !currentUser) return;
  const form = new FormData(addressForm);
  const addressId = String(form.get('addressId') || '');
  const values = {
    label: String(form.get('label') || '').trim(),
    recipient_name: String(form.get('recipientName') || '').trim(),
    phone: String(form.get('phone') || '').trim(),
    address_line: String(form.get('addressLine') || '').trim(),
    district: String(form.get('district') || '').trim(),
    city: String(form.get('city') || '').trim(),
    postal_code: String(form.get('postalCode') || '').trim() || null
  };
  const previousDefault = addresses.find(address => address.is_default);
  const wantsDefault = defaultAddressFeatureReady && (document.getElementById('addressIsDefault').checked || (!addressId && !addresses.length));
  setFormButton(addressForm, true);
  showMessage(addressId ? 'Adres güncelleniyor…' : 'Adres ekleniyor…');
  let result;
  if (wantsDefault) {
    const clearResult = await client.from('customer_addresses').update({ is_default: false }).eq('user_id', currentUser.id);
    if (clearResult.error) {
      setFormButton(addressForm, false);
      showMessage('Varsayılan adres değiştirilemedi. Tekrar dene.', 'error');
      return;
    }
  }
  result = addressId
    ? await client.from('customer_addresses').update({ ...values, ...(defaultAddressFeatureReady ? { is_default: wantsDefault || addresses.find(address => address.id === addressId)?.is_default || false } : {}), updated_at: new Date().toISOString() }).eq('id', addressId).eq('user_id', currentUser.id)
    : await client.from('customer_addresses').insert({ ...values, user_id: currentUser.id, ...(defaultAddressFeatureReady ? { is_default: wantsDefault } : {}) });
  if (result.error && wantsDefault && previousDefault) {
    await client.from('customer_addresses').update({ is_default: true }).eq('id', previousDefault.id).eq('user_id', currentUser.id);
  }
  setFormButton(addressForm, false);
  if (result.error) {
    showMessage('Adres kaydedilemedi. Girdiğin bilgileri kontrol edip tekrar dene.', 'error');
    return;
  }
  await loadAddresses();
  clearAddressForm();
  document.getElementById('addressSummary').textContent = addresses.length ? `${addresses.length} kayıtlı adres` : 'Henüz adres eklemedin';
  showMessage(addressId ? 'Adresin güncellendi.' : 'Adresin eklendi.', 'success');
});

async function loadAddresses() {
  const { data, error } = await fetchAddresses(currentUser.id);
  if (error) {
    showMessage('Adres listesi yenilenemedi. Sayfayı yenileyip tekrar dene.', 'error');
    return;
  }
  addresses = (data || []).map(address => ({ ...address, is_default: Boolean(address.is_default) }));
  document.getElementById('addressSummary').textContent = addresses.length ? `${addresses.length} kayıtlı adres` : 'Henüz adres eklemedin';
  renderAddresses();
}

addressList.addEventListener('click', async event => {
  const defaultButton = event.target.closest('[data-default-address]');
  if (defaultButton) {
    defaultButton.disabled = true;
    const previousDefault = addresses.find(address => address.is_default);
    const clearResult = await client.from('customer_addresses').update({ is_default: false }).eq('user_id', currentUser.id);
    const setResult = clearResult.error ? clearResult : await client.from('customer_addresses').update({ is_default: true, updated_at: new Date().toISOString() }).eq('id', defaultButton.dataset.defaultAddress).eq('user_id', currentUser.id);
    if (setResult.error) {
      if (previousDefault) await client.from('customer_addresses').update({ is_default: true }).eq('id', previousDefault.id).eq('user_id', currentUser.id);
      showMessage('Varsayılan adres güncellenemedi. Tekrar dene.', 'error');
      defaultButton.disabled = false;
    }
    else { await loadAddresses(); showMessage('Varsayılan adresin güncellendi.', 'success'); }
    return;
  }
  const editButton = event.target.closest('[data-edit-address]');
  if (editButton) {
    const address = addresses.find(item => item.id === editButton.dataset.editAddress);
    if (!address) return;
    document.getElementById('addressId').value = address.id;
    document.getElementById('addressLabel').value = address.label;
    document.getElementById('recipientName').value = address.recipient_name;
    document.getElementById('addressPhone').value = address.phone;
    document.getElementById('addressLine').value = address.address_line;
    document.getElementById('addressDistrict').value = address.district;
    document.getElementById('addressCity').value = address.city;
    document.getElementById('postalCode').value = address.postal_code || '';
    document.getElementById('addressIsDefault').checked = Boolean(address.is_default);
    document.getElementById('addressFormTitle').textContent = 'Adresi düzenle';
    document.getElementById('saveAddress').textContent = 'Değişiklikleri kaydet';
    cancelAddressEdit.hidden = false;
    openProfilePanel('addresses');
    openAddressEditor();
    addressForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const deleteButton = event.target.closest('[data-delete-address]');
  if (deleteButton && window.confirm('Bu adresi silmek istiyor musun?')) {
    const deletedAddress = addresses.find(address => address.id === deleteButton.dataset.deleteAddress);
    const { error } = await client.from('customer_addresses').delete()
      .eq('id', deleteButton.dataset.deleteAddress)
      .eq('user_id', currentUser.id);
    if (error) showMessage('Adres silinemedi. Lütfen tekrar dene.', 'error');
    else {
      if (deletedAddress?.is_default) {
        const replacement = addresses.find(address => address.id !== deletedAddress.id);
        if (replacement) await client.from('customer_addresses').update({ is_default: true, updated_at: new Date().toISOString() }).eq('id', replacement.id).eq('user_id', currentUser.id);
      }
      await loadAddresses();
      showMessage('Adres silindi.', 'success');
    }
  }
});

document.getElementById('addAddress').addEventListener('click', () => {
  clearAddressForm();
  openProfilePanel('addresses');
  openAddressEditor();
});
cancelAddressEdit.addEventListener('click', clearAddressForm);
changePasswordForm.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(changePasswordForm);
  const password = String(form.get('password') || '');
  if (password.length < 10 || password !== String(form.get('passwordConfirm') || '')) {
    showMessage('Şifreler eşleşmeli ve en az 10 karakter olmalı.', 'error');
    return;
  }
  setFormButton(changePasswordForm, true);
  showMessage('Şifren güncelleniyor…');
  const { error } = await client.auth.updateUser({ password });
  setFormButton(changePasswordForm, false);
  if (error) showMessage('Şifre güncellenemedi. Biraz sonra tekrar dene.', 'error');
  else { changePasswordForm.reset(); showMessage('Şifren başarıyla güncellendi.', 'success'); }
});
document.getElementById('profileSignOut').addEventListener('click', async () => {
  const { error } = await client.auth.signOut();
  if (error) showMessage('Çıkış yapılamadı. Lütfen tekrar dene.', 'error');
  else window.location.replace('hesap.html');
});

document.getElementById('addOwnedDevice').addEventListener('click', () => startOwnedDeviceEdit());
document.getElementById('cancelOwnedDevice').addEventListener('click', clearOwnedDeviceForm);
ownedDeviceType.addEventListener('change', updateOwnedDeviceTypeFields);
ownedDeviceForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || !currentUser) return;
  const type = ownedDeviceType.value;
  if (!['laptop', 'desktop'].includes(type)) { showMessage('Önce bilgisayar türünü seç.', 'error'); return; }
  let details = {};
  if (type === 'laptop') {
    details = Object.fromEntries(ownedLaptopFieldsMap.map(([key, , id]) => [key, String(document.getElementById(id).value || '').trim()]).filter(([, value]) => value));
  } else {
    ownedDesktopFieldsMap.forEach(([key, , brandId, detailId]) => {
      const brand = String(document.getElementById(brandId).value || '').trim();
      const series = String(document.getElementById(detailId).value || '').trim();
      if (brand) details[key] = brand;
      if (series) details[`${key}Detail`] = series;
    });
  }
  if (type === 'laptop' && (!details.brand || !details.model)) { showMessage('Dizüstü bilgisayar için marka ve model bilgisi gerekli.', 'error'); return; }
  const nameInput = String(document.getElementById('ownedDeviceName').value || '').trim();
  const deviceName = nameInput || (type === 'laptop' ? `${details.brand} ${details.model}`.trim() : 'Masaüstü bilgisayar');
  const deviceId = document.getElementById('ownedDeviceId').value;
  const payload = { device_type: type, name: deviceName, details, updated_at: new Date().toISOString() };
  const button = document.getElementById('saveOwnedDevice'); button.disabled = true; button.textContent = 'Kaydediliyor…';
  const result = deviceId
    ? await client.from('customer_owned_devices').update(payload).eq('id', deviceId).eq('user_id', currentUser.id).select('id,device_type,name,details,created_at,updated_at').single()
    : await client.from('customer_owned_devices').insert({ ...payload, user_id: currentUser.id }).select('id,device_type,name,details,created_at,updated_at').single();
  button.disabled = false; button.textContent = deviceId ? 'Değişiklikleri kaydet' : 'Cihazı kaydet';
  if (result.error) { showMessage('Bilgisayarın kaydedilemedi. Biraz sonra tekrar dene.', 'error'); return; }
  if (deviceId) ownedDevices = ownedDevices.map(device => device.id === deviceId ? result.data : device);
  else ownedDevices = [result.data, ...ownedDevices];
  clearOwnedDeviceForm(); renderOwnedDevices(); showMessage('Bilgisayarın hesabına kaydedildi.', 'success');
});
ownedDeviceList.addEventListener('click', async event => {
  const edit = event.target.closest('[data-edit-owned-device]');
  if (edit) { const device = ownedDevices.find(row => row.id === edit.dataset.editOwnedDevice); if (device) startOwnedDeviceEdit(device); return; }
  const remove = event.target.closest('[data-delete-owned-device]');
  if (!remove || !window.confirm('Bu bilgisayar kaydını silmek istiyor musun?')) return;
  remove.disabled = true;
  const { error } = await client.from('customer_owned_devices').delete().eq('id', remove.dataset.deleteOwnedDevice).eq('user_id', currentUser.id);
  if (error) { remove.disabled = false; showMessage('Bilgisayar kaydı silinemedi. Lütfen tekrar dene.', 'error'); return; }
  ownedDevices = ownedDevices.filter(row => row.id !== remove.dataset.deleteOwnedDevice); renderOwnedDevices(); showMessage('Bilgisayar kaydı silindi.', 'success');
});

loadAccount();
