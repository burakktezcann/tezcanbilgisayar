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
const addressEditor = document.getElementById('addressEditor');
const savedSystemList = document.getElementById('savedSystemList');
const systemsLoadNote = document.getElementById('systemsLoadNote');
let savedSystemBuilds = [];
let currentUser = null;
let addresses = [];
let defaultAddressFeatureReady = true;

function openProfilePanel(name, updateHash = true) {
  const panelName = ['overview', 'personal', 'addresses', 'security', 'systems', 'preferences', 'cards', 'iban'].includes(name) ? name : 'overview';
  document.querySelectorAll('[data-profile-panel]').forEach(panel => { panel.hidden = panel.dataset.profilePanel !== panelName; });
  document.querySelectorAll('.profile-nav [data-profile-tab]').forEach(button => {
    if (button.dataset.profileTab === panelName) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (updateHash && location.hash !== `#${panelName}`) history.replaceState(null, '', `#${panelName}`);
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
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError || !profile) {
    showSetup();
    return;
  }
  const { data: addressRows, error: addressError } = await fetchAddresses(user.id);
  await loadSavedSystems();
  if (addressError) {
    showSetup();
    return;
  }
  document.getElementById('profileFullName').value = profile.full_name || '';
  document.getElementById('profilePhone').value = profile.phone || '';
  document.getElementById('emailUpdatesPreference').checked = localStorage.getItem(`tezcan-email-updates-${user.id}`) === 'true';
  document.getElementById('profileGreeting').textContent = (profile.full_name || user.email?.split('@')[0] || 'müşterimiz').split(' ')[0];
  addresses = (addressRows || []).map(address => ({ ...address, is_default: Boolean(address.is_default) }));
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

communicationPreferencesForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!currentUser) return;
  localStorage.setItem(`tezcan-email-updates-${currentUser.id}`, String(document.getElementById('emailUpdatesPreference').checked));
  showMessage('Tercihin bu cihazda kaydedildi.', 'success');
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

loadAccount();
