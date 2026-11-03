(() => {
  const currentScript = document.currentScript;
  const scriptUrl = new URL(currentScript.src, location.href);
  const rootUrl = new URL('../../', scriptUrl);
  const asset = path => new URL(path, rootUrl).href;
  const pageName = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = pageName === 'index.html';
  const navItems = [
    ['sistem-topla.html', 'Sistemini Topla', 'fa-computer'],
    ['bilgisayar-parcalari.html', 'Bilgisayar Parçaları', 'fa-memory'],
    ['bilgisayar-parcalari.html?category=computers', 'Bilgisayar', 'fa-laptop'],
    ['bilgisayar-parcalari.html?category=peripherals', 'Çevre Birimleri', 'fa-display'],
    ['bilgisayar-parcalari.html?category=gaming', 'Oyun ve Hobi', 'fa-gamepad'],
    ['bilgisayar-parcalari.html?category=networking', 'Network', 'fa-wifi'],
    ['bilgisayar-parcalari.html?category=office', 'Ofis Ürünleri', 'fa-print'],
    ['bilgisayar-parcalari.html?category=accessories', 'Aksesuar', 'fa-plug'],
    ['bilgisayar-parcalari.html?category=software', 'Yazılım', 'fa-gear']
  ];
  const styleHref = asset('assets/css/shared-shell.css');
  if (!document.querySelector(`link[href="${styleHref}"]`)) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = styleHref;
    document.head.append(style);
  }
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const icons = document.createElement('link');
    icons.rel = 'stylesheet';
    icons.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    document.head.append(icons);
  }

  const categoryLinks = navItems.map(([href, label, icon], index) =>
    `<a class="shared-category-link${index === 0 ? ' is-build' : ''}" href="${asset(href)}"><i class="fa-solid ${icon}" aria-hidden="true"></i><span>${label}</span></a>`
  ).join('');
  const cartAction = isHome
    ? '<button class="shared-action" id="openCart" type="button" aria-label="Ürün grubunu aç"><i class="fa-solid fa-basket-shopping" aria-hidden="true"></i><span>Ürünler</span><b class="shared-count" id="cartCount">0</b></button>'
    : `<a class="shared-action" href="${asset('bilgisayar-parcalari.html')}"><i class="fa-solid fa-basket-shopping" aria-hidden="true"></i><span>Ürünler</span></a>`;
  const header = `<div class="shared-announcement"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Tezcan Bilgisayar kuruluş öncesi hazırlık aşamasındadır</div>
  <header class="shared-header"><div class="shared-header-inner">
    <a class="shared-brand" href="${asset('index.html')}" aria-label="Tezcan Bilgisayar ana sayfa"><img src="${asset('assets/images/brand/tezcan-mark.webp')}" alt="" width="512" height="512" fetchpriority="high" decoding="async"><span>TEZCAN<small>BİLGİSAYAR</small></span></a>
    <form class="shared-search" id="siteSearch" action="${asset('bilgisayar-parcalari.html')}" method="get" role="search"><label class="visually-hidden" for="searchInput">Ürün veya hizmet ara</label><input id="searchInput" name="q" type="search" placeholder="Ürün, parça veya hizmet ara…" autocomplete="off"><button type="submit" aria-label="Ara"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button></form>
    <div class="shared-actions"><a class="shared-support" href="${asset('teknikdestek.html')}"><i class="fa-solid fa-headset" aria-hidden="true"></i><span>Teknik destek</span></a><a class="shared-action shared-account" href="${asset('hesap.html')}" data-account-indicator><i class="fa-regular fa-user" aria-hidden="true"></i><span data-account-label>Hesabım</span></a><a class="shared-action favorite-page-link" href="${asset('favorilerim.html')}"><i class="fa-regular fa-heart" aria-hidden="true"></i><span>Favoriler</span><b class="shared-count" id="${isHome ? 'headerFavoriteCount' : 'partsFavoriteCount'}">0</b></a>${cartAction}</div>
    <button class="shared-menu-toggle" type="button" aria-expanded="false" aria-controls="sharedCategoryMenu"><i class="fa-solid fa-bars" aria-hidden="true"></i><span>Kategoriler</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
  </div><nav class="shared-category-menu" id="sharedCategoryMenu" aria-label="Ürün kategorileri"><div class="shared-category-grid quick-category-container" id="quickCategoryNav">${categoryLinks}</div><div hidden><button id="quickComponentToggle" type="button" aria-expanded="false"></button><div id="quickComponentMenu" hidden></div></div></nav></header>`;
  const footer = `<footer class="shared-footer"><div class="shared-footer-inner"><a class="shared-brand shared-footer-brand" href="${asset('index.html')}"><img src="${asset('assets/images/brand/tezcan-mark.webp')}" alt="" width="512" height="512" loading="lazy" decoding="async"><span>TEZCAN<small>BİLGİSAYAR</small></span></a><nav class="shared-footer-links" aria-label="Alt gezinme"><a href="${asset('bilgisayar-parcalari.html')}">Bilgisayar parçaları</a><a href="${asset('bilgisayar-rehberleri.html')}">Bilgisayar rehberleri</a><a href="${asset('sistem-topla.html')}">Sistemini Topla</a><a href="${asset('teknikdestek.html')}">Teknik destek</a><a href="${asset('hesap.html')}" data-account-indicator><span data-account-label>Hesabım</span></a><a href="${asset('kvkk-aydinlatma.html')}">Kişisel veriler</a><a href="${asset('iletisim.html')}">İletişim</a></nav><div class="shared-footer-bottom"><span>Kuruluş öncesi hazırlık aşamasında. Bu siteden sipariş veya ödeme alınmaz.</span><span>© <span id="currentYear" data-shared-year></span> Tezcan Bilgisayar</span><span id="supportYear" data-shared-year hidden></span></div></div></footer>`;

  document.querySelector('.announcement')?.remove();
  const oldHeader = document.querySelector('.site-header,.support-header,.build-header,.seo-header,.notice-header,.admin-header');
  if (oldHeader?.closest('main')) {
    oldHeader.closest('main').insertAdjacentHTML('beforebegin', header);
    oldHeader.remove();
  } else if (oldHeader) oldHeader.outerHTML = header;
  else {
    const mainContent = document.querySelector('.account-shell,main,.notice-shell');
    if (mainContent) mainContent.insertAdjacentHTML('beforebegin', header);
    else document.body.insertAdjacentHTML('afterbegin', header);
  }
  const oldFooter = [...document.querySelectorAll('footer')].find(node => !node.classList.contains('builder-sources'));
  if (oldFooter) oldFooter.outerHTML = footer;
  else {
    const sources = document.querySelector('.builder-sources');
    if (sources?.closest('main')) sources.closest('main').insertAdjacentHTML('afterend', footer);
    else if (sources) sources.insertAdjacentHTML('afterend', footer);
    else document.body.insertAdjacentHTML('beforeend', footer);
  }
  document.querySelectorAll('[data-shared-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });
  const favoriteBadge = document.getElementById(isHome ? 'headerFavoriteCount' : 'partsFavoriteCount');
  const syncFavoriteBadge = () => {
    try {
      const ids = JSON.parse(localStorage.getItem('tezcan-product-favorites') || '[]');
      if (favoriteBadge && Array.isArray(ids)) favoriteBadge.textContent = String(ids.length);
    } catch { if (favoriteBadge) favoriteBadge.textContent = '0'; }
  };
  syncFavoriteBadge();
  window.addEventListener('storage', event => { if (event.key === 'tezcan-product-favorites') syncFavoriteBadge(); });

  const toggle = document.querySelector('.shared-menu-toggle');
  const menu = document.getElementById('sharedCategoryMenu');
  menu?.querySelectorAll('.shared-category-link').forEach(link => {
    const target = new URL(link.href, location.href);
    const samePath = location.pathname.replace(/\/$/, '') === target.pathname.replace(/\/$/, '');
    const sameQuery = target.search ? location.search === target.search : !location.search;
    if (samePath && sameQuery) link.setAttribute('aria-current', 'page');
  });
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu?.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      menu?.classList.remove('is-open');
      toggle.focus();
    }
  });
})();
