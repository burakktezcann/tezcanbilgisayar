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
let currentUser = null;
let addresses = [];

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
  const { data: addressRows, error: addressError } = await client
    .from('customer_addresses')
    .select('id, label, recipient_name, phone, address_line, district, city, postal_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (addressError) {
    showSetup();
    return;
  }
  document.getElementById('profileFullName').value = profile.full_name || '';
  document.getElementById('profilePhone').value = profile.phone || '';
  addresses = addressRows || [];
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
  setFormButton(addressForm, true);
  showMessage(addressId ? 'Adres güncelleniyor…' : 'Adres ekleniyor…');
  const result = addressId
    ? await client.from('customer_addresses').update({ ...values, updated_at: new Date().toISOString() }).eq('id', addressId).eq('user_id', currentUser.id)
    : await client.from('customer_addresses').insert({ ...values, user_id: currentUser.id });
  setFormButton(addressForm, false);
  if (result.error) {
    showMessage('Adres kaydedilemedi. Girdiğin bilgileri kontrol edip tekrar dene.', 'error');
    return;
  }
  clearAddressForm();
  await loadAddresses();
  showMessage(addressId ? 'Adresin güncellendi.' : 'Adresin eklendi.', 'success');
});

async function loadAddresses() {
  const { data, error } = await client.from('customer_addresses')
    .select('id, label, recipient_name, phone, address_line, district, city, postal_code, created_at')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (error) {
    showMessage('Adres listesi yenilenemedi. Sayfayı yenileyip tekrar dene.', 'error');
    return;
  }
  addresses = data || [];
  renderAddresses();
}

addressList.addEventListener('click', async event => {
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
    document.getElementById('addressFormTitle').textContent = 'Adresi düzenle';
    document.getElementById('saveAddress').textContent = 'Değişiklikleri kaydet';
    cancelAddressEdit.hidden = false;
    addressForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const deleteButton = event.target.closest('[data-delete-address]');
  if (deleteButton && window.confirm('Bu adresi silmek istiyor musun?')) {
    const { error } = await client.from('customer_addresses').delete()
      .eq('id', deleteButton.dataset.deleteAddress)
      .eq('user_id', currentUser.id);
    if (error) showMessage('Adres silinemedi. Lütfen tekrar dene.', 'error');
    else {
      await loadAddresses();
      showMessage('Adres silindi.', 'success');
    }
  }
});

cancelAddressEdit.addEventListener('click', clearAddressForm);
document.getElementById('profileSignOut').addEventListener('click', async () => {
  const { error } = await client.auth.signOut();
  if (error) showMessage('Çıkış yapılamadı. Lütfen tekrar dene.', 'error');
  else window.location.replace('hesap.html');
});

loadAccount();
