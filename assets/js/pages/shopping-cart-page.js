const cart = window.TezcanShoppingCart;
const cartItemsRoot = document.getElementById('shoppingCartItems');
const cartLayout = document.getElementById('shoppingCartLayout');
const cartEmpty = document.getElementById('shoppingCartEmpty');
const cartStatus = document.getElementById('shoppingCartStatus');
let cartProducts = [];
let cartCatalogReady = false;

function money(value, currency = 'TRY') {
  return window.TezcanCatalogUtils.formatCurrency(value, currency);
}

function normalizeCartProduct(row, source = 'bundle') {
  return {
    id: row.id,
    slug: row.slug || '',
    name: row.name || 'Ürün',
    brand: row.brand || '',
    model: row.model || '',
    description: row.description || '',
    image: source === 'db' ? row.image_path : row.image,
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    currency: row.currency || 'TRY',
    stock: row.stock,
    status: row.status || 'active',
    attributes: row.attributes || {}
  };
}

async function loadCartProducts() {
  const [catalogResult, builderResult] = await Promise.allSettled([
    fetch('assets/data/catalog.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : null),
    fetch('assets/data/builder-products.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : null)
  ]);
  const bundled = [
    ...(catalogResult.status === 'fulfilled' ? catalogResult.value?.products || [] : []),
    ...(builderResult.status === 'fulfilled' ? builderResult.value?.products || [] : [])
  ].map(row => normalizeCartProduct(row));
  const productsById = new Map(bundled.map(product => [product.id, product]));
  const productsBySlug = new Map(bundled.filter(product => product.slug).map(product => [product.slug, product]));

  const config = window.SUPABASE_CONFIG || {};
  if (config.url && config.publishableKey && window.supabase?.createClient) {
    try {
      const client = window.supabase.createClient(config.url, config.publishableKey);
      const { data, error } = await client.from('catalog_products')
        .select('id,slug,name,brand,model,description,image_path,price,currency,stock,status,attributes')
        .eq('status', 'active');
      if (!error) (data || []).forEach(row => {
        const live = normalizeCartProduct(row, 'db');
        const bundledRow = productsBySlug.get(live.slug);
        productsById.set(live.id, bundledRow ? { ...bundledRow, ...live, image: live.image || bundledRow.image, attributes: { ...bundledRow.attributes, ...live.attributes } } : live);
      });
    } catch { /* Use the bundled catalog when the live catalog is unavailable. */ }
  }
  cartProducts = [...productsById.values()].filter(product => product.status === 'active');
  cartCatalogReady = cartProducts.length > 0;
}

function discountRate(product) {
  const value = Number(product.attributes?.discount_percent);
  return Number.isFinite(value) && value > 0 && value <= 90 ? value / 100 : 0;
}

function productStatus(product, quantity) {
  if (!cartCatalogReady) return ['Ürün bilgisi alınamadı. Sayfayı yenileyip tekrar dene.', 'error'];
  if (!product) return ['Bu ürün katalogda artık bulunmuyor. Sepetten kaldırabilirsin.', 'error'];
  const stockKnown = product.stock !== null && product.stock !== undefined && product.stock !== '' && Number.isInteger(Number(product.stock));
  if (stockKnown && Number(product.stock) === 0) return ['Stokta bulunmuyor. Sipariş oluşturulamaz.', 'error'];
  if (stockKnown && quantity > Number(product.stock)) {
    return [`Stokta ${product.stock} adet var; sepet adedini azalt.`, 'error'];
  }
  if (!stockKnown) return ['Stok bilgisi henüz kesinleşmedi.', 'info'];
  return [`Stokta ${product.stock} adet`, 'success'];
}

function renderItem(row) {
  const product = cartProducts.find(item => item.id === row.id || (row.slug && item.slug === row.slug));
  const item = document.createElement('article'); item.className = 'shopping-cart-item';
  const art = document.createElement('div'); art.className = 'shopping-item-image';
  if (product && window.TezcanCatalogUtils.validImagePath(product.image)) {
    const image = document.createElement('img'); image.src = product.image; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => { art.replaceChildren(); const icon = document.createElement('i'); icon.className = 'fa-solid fa-microchip'; icon.setAttribute('aria-hidden', 'true'); art.append(icon); }, { once: true });
    art.append(image);
  } else {
    const icon = document.createElement('i'); icon.className = 'fa-solid fa-microchip'; icon.setAttribute('aria-hidden', 'true'); art.append(icon);
  }

  const info = document.createElement('div'); info.className = 'shopping-item-info';
  const brand = document.createElement('span'); brand.className = 'shopping-item-brand'; brand.textContent = product?.brand || 'Bilgisayar parçası';
  const title = document.createElement('h3');
  if (product?.slug) { const link = document.createElement('a'); link.href = `urun.html?slug=${encodeURIComponent(product.slug)}`; link.textContent = product.name; title.append(link); }
  else title.textContent = product?.name || 'Katalogda olmayan ürün';
  const [statusMessage, statusKind] = productStatus(product, row.quantity);
  const status = document.createElement('span'); status.className = 'shopping-item-status'; status.dataset.kind = statusKind; status.textContent = statusMessage;
  info.append(brand, title, status);
  if (product && Number.isFinite(product.price) && product.price >= 0) {
    const rate = discountRate(product);
    const unitPrice = product.price * (1 - rate);
    const price = document.createElement('strong'); price.className = 'shopping-item-price'; price.textContent = `${money(unitPrice, product.currency)} · adet`;
    info.append(price);
  } else {
    const price = document.createElement('strong'); price.className = 'shopping-item-price'; price.textContent = 'Fiyat bilgisi hazırlanıyor'; info.append(price);
  }

  const controls = document.createElement('div'); controls.className = 'shopping-item-controls';
  const quantity = document.createElement('div'); quantity.className = 'shopping-quantity'; quantity.setAttribute('aria-label', 'Ürün adedi');
  const decrease = document.createElement('button'); decrease.type = 'button'; decrease.dataset.cartAction = 'decrease'; decrease.dataset.cartId = row.id; decrease.setAttribute('aria-label', `${product?.name || 'Ürün'} adedini azalt`); decrease.textContent = '−';
  const output = document.createElement('output'); output.textContent = String(row.quantity);
  const increase = document.createElement('button'); increase.type = 'button'; increase.dataset.cartAction = 'increase'; increase.dataset.cartId = row.id; increase.setAttribute('aria-label', `${product?.name || 'Ürün'} adedini artır`); increase.textContent = '+';
  const knownStock = product && Number.isInteger(Number(product.stock)) && product.stock !== null && product.stock !== '';
  increase.disabled = row.quantity >= 99 || (knownStock && row.quantity >= Number(product.stock));
  quantity.append(decrease, output, increase);
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'shopping-remove-button'; remove.dataset.cartAction = 'remove'; remove.dataset.cartId = row.id; remove.textContent = 'Kaldır';
  controls.append(quantity, remove);
  item.append(art, info, controls);
  return item;
}

function renderCartPage() {
  const rows = cart.read();
  const hasRows = rows.length > 0;
  cartLayout.hidden = !hasRows;
  cartEmpty.hidden = hasRows;
  cartStatus.textContent = '';
  if (!hasRows) return;
  document.getElementById('shoppingCartItemCount').textContent = `${cart.count()} ürün`;
  cartItemsRoot.replaceChildren(...rows.map(renderItem));

  const products = rows.map(row => cartProducts.find(product => product.id === row.id || (row.slug && product.slug === row.slug)));
  const allPricesKnown = cartCatalogReady && products.every(product => product && Number.isFinite(product.price) && product.price >= 0);
  const currencies = new Set(products.filter(Boolean).map(product => product.currency || 'TRY'));
  const currencyConsistent = currencies.size <= 1;
  if (allPricesKnown && currencyConsistent) {
    let subtotal = 0; let discount = 0;
    rows.forEach((row, index) => {
      const product = products[index]; const rate = discountRate(product);
      subtotal += product.price * row.quantity;
      discount += product.price * rate * row.quantity;
    });
    const currency = products[0]?.currency || 'TRY';
    document.getElementById('shoppingSubtotal').textContent = money(subtotal, currency);
    document.getElementById('shoppingDiscount').textContent = `− ${money(discount, currency)}`;
  } else {
    document.getElementById('shoppingSubtotal').textContent = currencyConsistent ? 'Fiyatlar netleşince hesaplanacak' : 'Para birimleri farklı';
    document.getElementById('shoppingDiscount').textContent = '—';
  }
  const unavailable = products.some((product, index) => {
    if (!product) return true;
    const stockKnown = product.stock !== null && product.stock !== undefined && product.stock !== '' && Number.isInteger(Number(product.stock));
    return stockKnown && (Number(product.stock) === 0 || rows[index].quantity > Number(product.stock));
  });
  cartStatus.textContent = unavailable ? 'Sepetinde katalogda bulunmayan veya stok adediyle uyuşmayan ürün var; satın alma açıldığında yeniden kontrol et.' : 'Ürün ve stok bilgileri sipariş aşamasında yeniden doğrulanır.';
}

cartItemsRoot.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const row = cart.read().find(item => item.id === button.dataset.cartId);
  if (!row) return;
  if (button.dataset.cartAction === 'remove') cart.remove(row.id);
  else if (button.dataset.cartAction === 'decrease') cart.setQuantity(row.id, row.quantity - 1, cartProducts.find(product => product.id === row.id));
  else if (button.dataset.cartAction === 'increase') cart.setQuantity(row.id, row.quantity + 1, cartProducts.find(product => product.id === row.id));
});
document.getElementById('clearShoppingCart').addEventListener('click', () => cart.clear());
document.addEventListener('tezcan:cart-change', renderCartPage);
window.addEventListener('storage', event => { if (event.key === cart.activeStorageKey) renderCartPage(); });

loadCartProducts().then(() => {
  renderCartPage();
  if (!cartCatalogReady && cart.count()) cartStatus.textContent = 'Ürün bilgileri şu an yüklenemedi. Biraz sonra sayfayı yenileyebilirsin.';
}).catch(() => {
  renderCartPage();
  if (cart.count()) cartStatus.textContent = 'Ürün bilgileri şu an yüklenemedi. Biraz sonra sayfayı yenileyebilirsin.';
});
