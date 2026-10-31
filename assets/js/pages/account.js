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
function value(form, name) { return String(new FormData(form).get(name) || '').trim(); }

tabs.forEach(tab => tab.addEventListener('click', () => setTab(tab.dataset.accountTab)));

if (!config.url || !config.publishableKey || !window.supabase?.createClient) {
  setupNotice.hidden = false;
  setupNotice.textContent = 'Hesap hizmeti henüz yapılandırılmadı. Bu sayfadan kayıt veya giriş yapılamaz.';
  signupForm.querySelector('button[type="submit"]').disabled = true;
  signinForm.querySelector('button[type="submit"]').disabled = true;
  document.getElementById('forgotPassword').disabled = true;
} else {
  client = window.supabase.createClient(config.url, config.publishableKey);
  const accountReady = config.customerAccountsEnabled === true && Boolean(config.privacyNoticeUrl);
  if (!accountReady) {
    setupNotice.hidden = false;
    setupNotice.textContent = config.customerAccountsEnabled
      ? 'Üyelik için yayımlanmış kişisel veri bilgilendirme metni bağlantısı eksik. Kayıt ve giriş, kurulum tamamlanana kadar kapalıdır.'
      : 'Üyelik, şirket bilgileri ve kişisel veri bilgilendirme metni tamamlanana kadar kapalıdır.';
    signupForm.querySelector('button[type="submit"]').disabled = true;
    signinForm.querySelector('button[type="submit"]').disabled = true;
    document.getElementById('forgotPassword').disabled = true;
  } else {
    const note = signupForm.querySelector('.privacy-note');
    const link = document.createElement('a');
    link.href = config.privacyNoticeUrl;
    link.textContent = 'bilgilendirme metnini';
    note.replaceChildren('Kişisel veriler hakkında ', link, ' okudum ve kabul ediyorum.');
    const consent = document.createElement('input');
    consent.type = 'checkbox'; consent.name = 'noticeAccepted'; consent.required = true;
    consent.setAttribute('aria-label', 'Kişisel veri bilgilendirme metnini okudum ve kabul ediyorum');
    note.prepend(consent);
    note.classList.add('privacy-consent');
    setupNotice.hidden = true;
  }
  client.auth.getSession().then(({ data, error }) => {
    if (error) showMessage('Hesap bilgisi alınamadı. Lütfen tekrar deneyin.', 'error');
    showSession(data?.session?.user || null);
  });
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
  if (!client || config.customerAccountsEnabled !== true || !config.privacyNoticeUrl) return;
  if (value(signupForm, 'password').length < 10 || value(signupForm, 'password') !== value(signupForm, 'passwordConfirm')) {
    showMessage('Şifreler eşleşmeli ve en az 10 karakter olmalı.', 'error'); return;
  }
  if (!signupForm.elements.noticeAccepted?.checked) { showMessage('Devam etmek için bilgilendirme metnini onayla.', 'error'); return; }
  setBusy(signupForm, true); showMessage('Hesabınız oluşturuluyor…');
  try {
    const { data, error } = await client.auth.signUp({
      email: value(signupForm, 'email'), password: value(signupForm, 'password'),
      options: { data: { full_name: value(signupForm, 'fullName') }, emailRedirectTo: new URL('hesap.html', location.href).href }
    });
    if (error) showMessage('Kayıt tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.', 'error');
    else if (data.session) location.assign('hesabim.html');
    else showMessage('Kayıt isteği alındı. E-posta kutunu kontrol edip doğrulama bağlantısını aç.', 'success');
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  finally { setBusy(signupForm, false); }
});

signinForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client || config.customerAccountsEnabled !== true || !config.privacyNoticeUrl) return;
  setBusy(signinForm, true); showMessage('Giriş yapılıyor…');
  try {
    const { error } = await client.auth.signInWithPassword({ email: value(signinForm, 'email'), password: value(signinForm, 'password') });
    if (error) showMessage('Giriş yapılamadı. E-posta ve şifrenizi kontrol edin.', 'error');
    else location.assign('hesabim.html');
  } catch { showMessage('Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', 'error'); }
  finally { setBusy(signinForm, false); }
});

document.getElementById('forgotPassword').addEventListener('click', async () => {
  if (!client || config.customerAccountsEnabled !== true || !config.privacyNoticeUrl) return;
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
