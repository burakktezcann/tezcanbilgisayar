(() => {
  const slots = [
    { id: 'cpu', title: 'İşlemci', category: 'cpu', icon: 'fa-microchip' },
    { id: 'motherboard', title: 'Anakart', category: 'motherboard', icon: 'fa-chess-board' },
    { id: 'ram', title: 'Bellek (RAM)', category: 'ram', icon: 'fa-memory' },
    { id: 'gpu', title: 'Ekran kartı', category: 'gpu', icon: 'fa-display' },
    { id: 'disk', title: 'Depolama', category: 'disk', icon: 'fa-hard-drive' },
    { id: 'case', title: 'Bilgisayar kasası', category: 'case', icon: 'fa-server' },
    { id: 'psu', title: 'Güç kaynağı', category: 'psu', icon: 'fa-bolt' }
  ];
  const storageKey = 'tezcan-system-builder-v1';
  const slotsElement = document.getElementById('builderSlots');
  const checksElement = document.getElementById('builderChecks');
  if (!slotsElement || !checksElement) return;

  let catalog = { products: [], categories: [] };
  let selection = {};
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) selection = stored;
  } catch { selection = {}; }

  const normalize = value => String(value ?? '').trim().toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  const numberValue = value => value === '' || value === null || value === undefined || !Number.isFinite(Number(value)) ? null : Number(value);
  const getProducts = category => catalog.products.filter(product => product.categoryId === category && product.status === 'active');
  const getSelection = () => Object.fromEntries(slots.map(slot => [slot.id, catalog.products.find(product => product.id === selection[slot.id] && product.categoryId === slot.category) || null]));

  function inspectBuild(build) {
    const issues = [];
    const add = (kind, text) => issues.push({ kind, text });
    const cpuSocket = build.cpu?.attributes?.socket;
    const boardSocket = build.motherboard?.attributes?.socket;
    if (build.cpu && build.motherboard) {
      if (cpuSocket && boardSocket && normalize(cpuSocket) !== normalize(boardSocket)) add('error', `İşlemci soketi (${cpuSocket}) ile anakart soketi (${boardSocket}) uyuşmuyor.`);
      else if (!cpuSocket || !boardSocket) add('warning', 'İşlemci veya anakart soket bilgisi eksik; uyumu ayrıca doğrula.');
    }

    const boardMemory = build.motherboard?.attributes?.memory_type;
    const ramMemory = build.ram?.attributes?.memory_type;
    if (build.motherboard && build.ram) {
      if (boardMemory && ramMemory && normalize(boardMemory) !== normalize(ramMemory)) add('error', `Anakart ${boardMemory}, seçilen RAM ${ramMemory}. Bellek türleri uyuşmuyor.`);
      else if (!boardMemory || !ramMemory) add('warning', 'Anakart veya RAM nesli bilgisi eksik; bellek uyumunu ayrıca doğrula.');
    }

    if (build.case && build.motherboard) {
      const supported = build.case.attributes?.board_support;
      const formFactor = build.motherboard.attributes?.form_factor;
      if (supported && formFactor) {
        const supportedSizes = supported.split(/[,;|\/]+/).map(normalize).filter(Boolean);
        if (!supportedSizes.some(size => size === normalize(formFactor) || size.includes(normalize(formFactor)))) add('error', `${formFactor} anakart boyutu, kasanın girilen desteğiyle (${supported}) eşleşmiyor.`);
      } else add('warning', 'Kasa veya anakart boyutu bilgisi eksik; fiziksel uyumu ayrıca doğrula.');
    }

    if (build.case && build.gpu) {
      const clearance = numberValue(build.case.attributes?.gpu_clearance_mm);
      const gpuLength = numberValue(build.gpu.attributes?.length_mm);
      if (clearance !== null && gpuLength !== null && gpuLength > clearance) add('error', `Ekran kartı ${gpuLength} mm; kasa en fazla ${clearance} mm destekliyor.`);
      else if (clearance === null || gpuLength === null) add('warning', 'Kasa veya ekran kartı uzunluğu girilmemiş; fiziksel uyumu ayrıca doğrula.');
    }

    const cpuTdp = numberValue(build.cpu?.attributes?.tdp_w);
    const gpuTdp = numberValue(build.gpu?.attributes?.tdp_w);
    const psuPower = numberValue(build.psu?.attributes?.power_w);
    const estimatedPsu = cpuTdp !== null && gpuTdp !== null ? Math.ceil((cpuTdp + gpuTdp) * 1.5 + 100) : null;
    if (build.psu && estimatedPsu !== null && psuPower !== null && psuPower < estimatedPsu) add('warning', `Güç kaynağı ${psuPower} W. Basit güç payı hesabı yaklaşık ${estimatedPsu} W öneriyor; üretici gereksinimlerini kontrol et.`);
    else if (build.psu && estimatedPsu !== null && psuPower === null) add('warning', 'Güç kaynağının watt değeri girilmemiş; güç yeterliliğini ayrıca doğrula.');
    return { issues, estimatedPsu };
  }

  function buildSlot(slot, build) {
    const products = getProducts(slot.category);
    const compatible = [];
    const needsReview = [];
    products.forEach(product => {
      const test = inspectBuild({ ...build, [slot.id]: product });
      const hasConflict = test.issues.some(issue => issue.kind === 'error' || issue.kind === 'warning');
      (hasConflict ? needsReview : compatible).push(product);
    });

    const card = document.createElement('label');
    card.className = 'builder-slot';
    card.htmlFor = `build-${slot.id}`;
    const title = document.createElement('span');
    title.className = 'builder-slot-title';
    const icon = document.createElement('i'); icon.className = `fa-solid ${slot.icon}`; icon.setAttribute('aria-hidden', 'true');
    const titleText = document.createElement('span'); titleText.textContent = slot.title;
    title.append(icon, titleText);
    const select = document.createElement('select');
    select.id = `build-${slot.id}`;
    select.dataset.builderSlot = slot.id;
    select.setAttribute('aria-label', `${slot.title} seç`);
    const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = products.length ? `${slot.title} seç…` : 'Bu kategoride yayındaki ürün yok';
    select.append(placeholder);
    const appendGroup = (items, label, conflict = false) => {
      if (!items.length) return;
      const group = document.createElement('optgroup'); group.label = label;
      items.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${conflict ? '⚠ ' : ''}${product.brand ? `${product.brand} · ` : ''}${product.name}${Number.isFinite(product.price) ? ` · ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: /^[A-Z]{3}$/.test(product.currency || '') ? product.currency : 'TRY' }).format(product.price)}` : ''}`;
        option.selected = selection[slot.id] === product.id;
        if (product.stock === 0 && selection[slot.id] !== product.id) { option.disabled = true; option.textContent += ' · Stokta yok'; }
        group.append(option);
      });
      select.append(group);
    };
    appendGroup(compatible, 'Girilen özelliklere göre sorun görünmüyor');
    appendGroup(needsReview, 'Uyum sorunu olabilir — kontrol et', true);
    if (selection[slot.id] && !products.some(product => product.id === selection[slot.id])) selection[slot.id] = '';
    select.value = selection[slot.id] || '';
    if (!products.length) select.disabled = true;
    const detail = document.createElement('span');
    detail.className = 'builder-slot-detail';
    const chosen = products.find(product => product.id === selection[slot.id]);
    detail.textContent = chosen ? [chosen.model, chosen.attributes?.capacity_gb ? `${chosen.attributes.capacity_gb} GB` : '', chosen.attributes?.memory_type, chosen.attributes?.power_w ? `${chosen.attributes.power_w} W` : ''].filter(Boolean).join(' · ') || 'Ürün seçildi' : `${products.length} yayındaki ürün`;
    card.append(title, select, detail);
    return card;
  }

  function render() {
    const build = getSelection();
    slotsElement.replaceChildren(...slots.map(slot => buildSlot(slot, build)));
    const chosen = Object.values(build).filter(Boolean);
    document.getElementById('builderProgress').textContent = `${chosen.length} / ${slots.length}`;
    const total = chosen.reduce((sum, product) => sum + (Number.isFinite(product.price) && product.price >= 0 ? product.price : 0), 0);
    const priced = chosen.filter(product => Number.isFinite(product.price) && product.price >= 0).length;
    document.getElementById('builderTotal').textContent = chosen.length && priced === chosen.length ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(total) : chosen.length ? `${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(total)} · ${chosen.length - priced} ürünün fiyatı eksik` : 'Parça seçilmedi';

    const { issues, estimatedPsu } = inspectBuild(build);
    const messages = [...issues];
    if (estimatedPsu !== null) messages.push({ kind: 'info', text: `İşlemci ve ekran kartı bilgilerine göre yaklaşık ${estimatedPsu} W güç hedefi (basit tahmin).` });
    if (!messages.length) messages.push({ kind: chosen.length ? 'success' : 'info', text: chosen.length ? 'Girilen özellikler arasında belirgin uyumsuzluk bulunmadı.' : 'Parça seçmeye başlayınca uyum kontrolleri burada görünür.' });
    checksElement.replaceChildren(...messages.map(item => {
      const line = document.createElement('p'); line.className = `builder-check is-${item.kind}`;
      const icon = document.createElement('i'); icon.className = `fa-solid ${item.kind === 'error' ? 'fa-circle-xmark' : item.kind === 'warning' ? 'fa-triangle-exclamation' : item.kind === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`; icon.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span'); text.textContent = item.text; line.append(icon, text); return line;
    }));
    document.getElementById('shareBuild').disabled = chosen.length === 0;
    try { localStorage.setItem(storageKey, JSON.stringify(selection)); } catch {}
  }

  slotsElement.addEventListener('change', event => {
    const select = event.target.closest('[data-builder-slot]');
    if (!select) return;
    selection[select.dataset.builderSlot] = select.value;
    render();
  });
  document.getElementById('clearBuild').addEventListener('click', () => { selection = {}; render(); });
  document.getElementById('shareBuild').addEventListener('click', () => {
    const build = getSelection();
    const lines = slots.map(slot => build[slot.id] ? `${slot.title}: ${build[slot.id].brand ? `${build[slot.id].brand} ` : ''}${build[slot.id].name}` : null).filter(Boolean);
    if (!lines.length) return;
    const total = Object.values(build).filter(Boolean).every(product => Number.isFinite(product.price)) ? `\nToplam: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Object.values(build).filter(Boolean).reduce((sum, product) => sum + product.price, 0))}` : '';
    const message = `Merhaba, oluşturduğum bilgisayar parça listesini inceleyebilir misiniz?\n${lines.join('\n')}${total}\n\nBu mesaj sipariş değildir; ürün bilgisi rica ediyorum.`;
    window.open(`https://wa.me/905324694249?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  window.addEventListener('catalog:updated', event => {
    catalog = event.detail?.catalog || catalog;
    slots.forEach(slot => { if (!getProducts(slot.category).some(product => product.id === selection[slot.id])) selection[slot.id] = ''; });
    render();
  });
  render();
})();
