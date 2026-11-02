(() => {
  const config = window.SUPABASE_CONFIG || {};
  const anchors = [...document.querySelectorAll('[data-account-indicator]')];
  let fallback = null;
  if (!anchors.length) {
    fallback = document.createElement('a');
    fallback.className = 'global-account-indicator';
    fallback.dataset.accountIndicator = '';
    fallback.href = 'hesap.html';
    fallback.innerHTML = '<span aria-hidden="true">♙</span><span data-account-label>Hesabım</span>';
    document.body.append(fallback);
    anchors.push(fallback);
  }
  let activeName = '';
  let activeSession = false;
  const setAccount = (name = '', signedIn = false) => {
    activeName = name; activeSession = signedIn;
    const compactName = window.matchMedia('(max-width: 720px)').matches ? String(name || '').trim().split(/\s+/)[0] : name;
    anchors.forEach(anchor => {
      const label = anchor.querySelector('[data-account-label]') || anchor.querySelector('span:last-child') || anchor;
      label.textContent = signedIn ? compactName || 'Hesabım' : 'Hesabım';
      anchor.href = signedIn ? 'hesabim.html' : 'hesap.html';
      anchor.title = signedIn && name ? `Giriş yapılan hesap: ${name}` : signedIn ? 'Hesabıma git' : 'Hesabına giriş yap';
      anchor.setAttribute('aria-label', anchor.title);
      anchor.classList.toggle('is-signed-in', signedIn);
      if (anchor.id === 'builderLoginLink') anchor.hidden = signedIn;
    });
  };
  const configReady = config.url && config.publishableKey && window.supabase?.createClient;
  if (!configReady) return;
  const client = window.supabase.createClient(config.url, config.publishableKey);
  const loadName = async user => {
    if (!user) { setAccount(); return; }
    let name = String(user.user_metadata?.full_name || '').trim();
    try {
      const { data } = await client.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      if (data?.full_name) name = String(data.full_name).trim();
    } catch { /* Use the name stored with the authentication account. */ }
    const displayName = name || user.email?.split('@')[0] || 'Hesabım';
    setAccount(displayName, true);
    document.dispatchEvent(new CustomEvent('account:ready', { detail: { user, name: displayName } }));
  };
  client.auth.getSession().then(({ data }) => loadName(data?.session?.user || null)).catch(() => setAccount());
  client.auth.onAuthStateChange((_event, session) => setTimeout(() => loadName(session?.user || null), 0));
  window.addEventListener('resize', () => { if (activeSession) setAccount(activeName, true); });
  document.addEventListener('account:profile-updated', event => {
    const name = String(event.detail?.name || '').trim();
    if (name) setAccount(name, true);
  });
})();
