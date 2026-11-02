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
let currentUser = null;
let addresses = [];
let defaultAddressFeatureReady = true;

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
}
function renderAddresses() {
  addressList.replaceChildren();
  if (!addresses.length) {
    const empty = document.createElement('div');
    empty.className = 'saved-address-empty';
    empty.textContent = 'Henüz kayıtlı adresin yok. Aşağıdaki formdan adres ekleyebilirsin.';
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
  if (addressError) {
    showSetup();
    return;
  }
  document.getElementById('profileFullName').value = profile.full_name || '';
  document.getElementById('profilePhone').value = profile.phone || '';
  addresses = (addressRows || []).map(address => ({ ...address, is_default: Boolean(address.is_default) }));
  document.getElementById('addressIsDefault').checked = defaultAddressFeatureReady && !addresses.some(address => address.is_default);
  renderAddresses();
  loading.hidden = true;
  content.hidden = false;
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
  else showMessage('Kişisel bilgilerin kaydedildi.', 'success');
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
  showMessage(addressId ? 'Adresin güncellendi.' : 'Adresin eklendi.', 'success');
});

async function loadAddresses() {
  const { data, error } = await fetchAddresses(currentUser.id);
  if (error) {
    showMessage('Adres listesi yenilenemedi. Sayfayı yenileyip tekrar dene.', 'error');
    return;
  }
  addresses = (data || []).map(address => ({ ...address, is_default: Boolean(address.is_default) }));
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
