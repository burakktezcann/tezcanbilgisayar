const config = window.SUPABASE_CONFIG || {};
const status = document.getElementById('accountMessage');
const setupNotice = document.getElementById('accountSetup');
const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');
const formsView = document.getElementById('accountForms');
const sessionView = document.getElementById('accountSession');
const passwordUpdateForm = document.getElementById('passwordUpdateForm');
const tabs = [...document.querySelectorAll('[data-account-tab]')];
const panels = [...document.querySelectorAll('[data-account-panel]')];
let client = null;
let recoverySession = false;

function showMessage(message, kind = '') {
  status.textContent = message;
  status.dataset.kind = kind;
}
function setTab(name) {
  tabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.accountTab === name)));
  panels.forEach(panel => { panel.hidden = panel.dataset.accountPanel !== name; });
  showMessage('');
}
function showSession(user) {
  formsView.hidden = Boolean(user) || recoverySession;
  sessionView.hidden = !user || recoverySession;
  passwordUpdateForm.hidden = !recoverySession;
  if (user) document.getElementById('signedInEmail').textContent = user.email || '';
}
function setBusy(form, busy) { form.querySelector('button[type="submit"]').disabled = busy; }
function value(form, name) {
  const raw = String(new FormData(form).get(name) || '');
  return /password/i.test(name) ? raw : raw.trim();
}
function authErrorText(error, action) {
  const code = String(error?.code || '');
  const text = String(error?.message || '').toLowerCase();
  if (code === 'email_address_not_authorized' || text.includes('email address not authorized')) {
    return 'Doğrulama e-postası bu adrese gönderilemedi. Supabase deneme e-postası yalnızca proje ekibindeki adreslere gönderim yapar; herkese açmak için özel SMTP kurulmalı. Bu adresle yeniden giriş yapmayı da deneyebilirsin.';
  }
  if (['email_exists', 'user_already_exists'].includes(code)) return 'Bu e-posta ile bir hesap zaten var. Giriş yapmayı veya şifreni yenilemeyi dene.';
  if (code === 'email_not_confirmed') return 'Girişten önce e-posta adresini doğrulaman gerekiyor. Gelen kutunu ve gereksiz e-posta klasörünü kontrol et.';
  if (code === 'weak_password') return 'Şifren daha güçlü olmalı. En az 10 karakterli farklı bir şifre seç.';
  if (code === 'over_email_send_rate_limit') return 'Çok kısa sürede fazla e-posta isteği gönderildi. Bir süre bekleyip tekrar dene.';
  if (code === 'signup_disabled') return 'Yeni hesap oluşturma Supabase Auth ayarlarında kapalı. Proje ayarlarından e-posta kayıtlarına izin verilmeli.';
  return action === 'signup' ? 'Hesap oluşturulamadı. E-posta adresini, şifreyi ve bağlantıyı kontrol edip tekrar dene.' : 'Giriş yapılamadı. E-posta ve şifreni kontrol et; e-posta doğrulaması istenmiş olabilir.';
}

tabs.forEach(tab => tab.addEventListener('click', () => setTab(tab.dataset.accountTab)));

if (!config.url || !config.publishableKey || !window.supabase?.createClient) {
  setupNotice.hidden = false;
  setupNotice.textContent = 'Hesap hizmetine şu anda bağlanılamıyor. İnternet bağlantını kontrol edip sayfayı yenile.';
  signupForm.querySelector('button[type="submit"]').disabled = true;
  signinForm.querySelector('button[type="submit"]').disabled = true;
  document.getElementById('forgotPassword').disabled = true;
} else {
  client = window.supabase.createClient(config.url, config.publishableKey);
  const registrationReady = config.customerAccountsEnabled === true && Boolean(config.privacyNoticeUrl);
  if (!registrationReady) {
    setupNotice.hidden = false;
    setupNotice.textContent = 'Yeni hesap açma şu anda kapalı. Mevcut hesabınla giriş yapabilirsin.';
    signupForm.querySelector('button[type="submit"]').disabled = true;
    setupNotice.dataset.kind = 'info';
  } else {
    const note = signupForm.querySelector('.privacy-note');
    const link = document.createElement('a');
    link.href = config.privacyNoticeUrl;
    link.textContent = 'aydınlatma metnini';
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    const consent = document.createElement('input');
    consent.type = 'checkbox'; consent.name = 'noticeAccepted'; consent.required = true;
    consent.setAttribute('aria-label', 'Kişisel veriler hakkında aydınlatma metnini okudum');
    note.replaceChildren(consent, ' Kişisel veriler hakkında ', link, ' okudum.');
    note.classList.add('privacy-consent');
    setupNotice.hidden = true;
  }
  client.auth.getSession().then(({ data, error }) => {
    if (error) showMessage('Hesap bilgisi alınamadı. Lütfen tekrar deneyin.', 'error');
    showSession(data?.session?.user || null);
  }).catch(() => showMessage('Hesap bilgisi alınamadı. Bağlantını kontrol edip sayfayı yenile.', 'error'));
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') recoverySession = true;
    showSession(session?.user || null);
  });
  if (new URLSearchParams(location.search).get('mode') === 'update-password') {
    recoverySession = true;
    showSession(null);
  }
}

signupForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || config.customerAccountsEnabled !== true || !config.privacyNoticeUrl) { showMessage('Yeni hesap hizmeti şu anda kapalı.', 'error'); return; }
  if (!signupForm.reportValidity()) return;
  if (value(signupForm, 'password').length < 10 || value(signupForm, 'password') !== value(signupForm, 'passwordConfirm')) {
    showMessage('Şifreler eşleşmeli ve en az 10 karakter olmalı.', 'error'); return;
  }
  if (!signupForm.elements.noticeAccepted?.checked) { showMessage('Devam etmek için aydınlatma metnini okuduğunu işaretle.', 'error'); return; }
  setBusy(signupForm, true); showMessage('Hesabınız oluşturuluyor…');
  try {
    const { data, error } = await client.auth.signUp({
      email: value(signupForm, 'email'), password: value(signupForm, 'password'),
      options: { data: { full_name: value(signupForm, 'fullName') }, emailRedirectTo: new URL('hesap.html', location.href).href }
    });
    if (error) showMessage(authErrorText(error, 'signup'), 'error');
    else if (data.session) location.assign('hesabim.html');
    else showMessage('Kayıt isteği alındı. E-posta kutunu kontrol edip doğrulama bağlantısını aç.', 'success');
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  finally { setBusy(signupForm, false); }
});

signinForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) { showMessage('Hesap hizmetine şu anda bağlanılamıyor. Sayfayı yenileyip tekrar dene.', 'error'); return; }
  if (!signinForm.reportValidity()) return;
  setBusy(signinForm, true); showMessage('Giriş yapılıyor…');
  try {
    const { error } = await client.auth.signInWithPassword({ email: value(signinForm, 'email'), password: value(signinForm, 'password') });
    if (error) showMessage(authErrorText(error, 'signin'), 'error');
    else location.assign('hesabim.html');
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  finally { setBusy(signinForm, false); }
});

document.getElementById('forgotPassword').addEventListener('click', async () => {
  if (!client) { showMessage('Hesap hizmetine şu anda bağlanılamıyor. Sayfayı yenileyip tekrar dene.', 'error'); return; }
  const email = value(signinForm, 'email');
  if (!email) { showMessage('Önce e-posta adresini yaz.', 'error'); return; }
  const button = document.getElementById('forgotPassword'); button.disabled = true;
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${new URL('hesap.html', location.href).href}?mode=update-password` });
    showMessage(error ? 'Şifre yenileme isteği gönderilemedi. Biraz sonra tekrar deneyin.' : 'Adres sistemde kayıtlıysa şifre yenileme bağlantısı gönderildi.', error ? 'error' : 'success');
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  button.disabled = false;
});

passwordUpdateForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || value(passwordUpdateForm, 'password').length < 10 || value(passwordUpdateForm, 'password') !== value(passwordUpdateForm, 'passwordConfirm')) {
    showMessage('Şifreler eşleşmeli ve en az 10 karakter olmalı.', 'error'); return;
  }
  setBusy(passwordUpdateForm, true);
  try {
    const { error } = await client.auth.updateUser({ password: value(passwordUpdateForm, 'password') });
    if (error) showMessage('Şifre güncellenemedi. Yenileme bağlantısını yeniden isteyip deneyin.', 'error');
    else { recoverySession = false; await client.auth.signOut(); location.replace('hesap.html?password=updated'); }
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  finally { setBusy(passwordUpdateForm, false); }
});

document.getElementById('signOutButton').addEventListener('click', async () => {
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) showMessage('Çıkış yapılamadı. Lütfen tekrar deneyin.', 'error');
  else { showSession(null); setTab('signin'); showMessage('Hesabınızdan çıkış yaptınız.', 'success'); }
});

if (new URLSearchParams(location.search).get('password') === 'updated') showMessage('Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.', 'success');
