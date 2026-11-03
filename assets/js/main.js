const searchForm=document.getElementById('siteSearch');
const searchInput=document.getElementById('searchInput');
const categoryCards=[...document.querySelectorAll('#categoryGrid .category-card')];
const subcategoryButtons=[...document.querySelectorAll('.subcategory-chip')];
const quickCategoryButtons=[...document.querySelectorAll('#quickCategoryNav [data-select-category]')];
const componentQuickButtons=[...document.querySelectorAll('#quickComponentMenu [data-select-category]')];
const quickComponentToggle=document.getElementById('quickComponentToggle');
const quickComponentMenu=document.getElementById('quickComponentMenu');
const quickCategoryContainer=document.querySelector('.quick-category-container');
const productGrid=document.getElementById('productGrid');
const emptyState=document.getElementById('emptyState');
const productFilterStatus=document.getElementById('productFilterStatus');
const productSort=document.getElementById('productSort');
const showAllProducts=document.getElementById('showAllProducts');
const computerPartsToggle=document.getElementById('computerPartsToggle');
const componentSubcategories=document.getElementById('componentSubcategories');
const cartOverlay=document.getElementById('cartOverlay');
const cartList=document.getElementById('cartList');
const sendQuote=document.getElementById('sendQuote');
const compareBar=document.getElementById('compareBar');
const compareDialog=document.getElementById('compareDialog');
const compareTableWrap=document.getElementById('compareTableWrap');
const favoritesFilter=document.getElementById('favoritesFilter');
const headerFavoriteCount=document.getElementById('headerFavoriteCount');
const featureTabs=[...document.querySelectorAll('[data-feature-mode]')];
let featureMode='bestseller';
const cartKey='tezcan-offer-list';
const compareKey='tezcan-product-comparison';
const favoritesKey='tezcan-product-favorites';
const allowedTones=new Set(['blue','green','purple','orange']);
let catalog={categories:[],products:[],currency:'TRY'};
let productCards=[];
let selectedProductCategories=[];
let selectedProductLabel='';
let quoteIds=[];
let savedQuoteIds=[];
let cartItemsById=new Map();
let catalogProductIds=new Set();
let cartReturnFocus=null;
let previousBodyOverflow='';
let compareIds=[];
let favoriteIds=[];
let favoritesOnly=false;
let currentFavoritesKey=favoritesKey;
let favoriteUserId='';
let favoriteSyncClient=null;
let favoriteSyncReady=false;
let favoriteSyncLoading=false;
let favoriteSyncTimer=0;
let remoteFavoriteIds=new Set();
try {
  const saved=JSON.parse(localStorage.getItem(compareKey)||'[]');
  compareIds=Array.isArray(saved)?saved.filter(id=>typeof id==='string').slice(0,4):[];
} catch { compareIds=[]; }
try {
  const saved=JSON.parse(localStorage.getItem(favoritesKey)||'[]');
  favoriteIds=Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[];
} catch { favoriteIds=[]; }
const defaultPreviewCategories=['cpu','motherboard','ram','gpu','disk','case','psu','cooling'];

try {
  const saved=JSON.parse(localStorage.getItem(cartKey)||'[]');
  savedQuoteIds=Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[];
} catch { savedQuoteIds=[]; }

function normalizeText(value){
  return String(value||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
}
function formatPrice(price,currency){
  return window.TezcanCatalogUtils.formatCurrency(price,currency||catalog.currency||'TRY');
}
function createProductCard(item,{isProduct=false}={}){
  const card=document.createElement('article');
  card.className='product-card';
  card.dataset.productId=item.id;
  card.dataset.categoryId=item.categoryId||item.id;
  card.dataset.search=[item.name,item.description,item.brand,item.model,item.sku,...(item.searchTerms||[]),...Object.values(item.attributes||{})].filter(Boolean).join(' ');

  const art=document.createElement('div');
  const tone=allowedTones.has(item.tone)?item.tone:'blue';
  art.className=`product-art product-tone-${tone}`;
  const icon=document.createElement('i');
  const categoryIcons={cpu:'fa-microchip',motherboard:'fa-chess-board',ram:'fa-memory',gpu:'fa-display',disk:'fa-hard-drive',case:'fa-server',cooling:'fa-fan',psu:'fa-bolt'};
  const iconName=/^fa-[a-z0-9-]+$/.test(item.icon||'')?item.icon:(categoryIcons[item.categoryId]||'fa-box');
  icon.className=`fa-solid ${iconName}`;
  icon.setAttribute('aria-hidden','true');
  const imagePath=window.TezcanCatalogUtils.validImagePath(item.image)?item.image:'';
  if(imagePath){
    const image=document.createElement('img');
    image.className='product-image';
    image.src=imagePath;
    image.alt="";
    image.loading='lazy';
    image.decoding='async';
    image.addEventListener('error',()=>{image.replaceWith(icon);},{once:true});
    art.append(image);
  }else{
    art.append(icon);
  }
  if(document.body.dataset.page==='home'){
    const badge=document.createElement('span');badge.className=`home-feature-badge ${featureMode==='bestseller'?'is-bestseller':''}`;
    badge.textContent=featureMode==='campaign'?'Kampanya':'Çok satan';art.append(badge);
  }

  const info=document.createElement('div');
  info.className='product-info';
  const label=document.createElement('span');
  label.className='product-label';
  label.textContent=isProduct?(item.brand||'Ürün'):'Planlanan ürün grubu';
  const title=document.createElement('h3');
  title.textContent=item.name;
  const description=document.createElement('p');
  description.textContent=item.description||'';
  const specificationList=document.createElement('ul');
  specificationList.className='product-specs';
  const attributeDefinition=window.PRODUCT_ATTRIBUTE_DEFINITIONS?.[item.categoryId];
  (attributeDefinition?.fields||[]).forEach(field=>{
    const value=item.attributes?.[field.key];
    if(value===undefined||value===null||value==='')return;
    const row=document.createElement('li');
    const label=document.createElement('span');label.textContent=field.label;
    const detail=document.createElement('strong');detail.textContent=`${value}${field.unit?` ${field.unit}`:''}`;
    row.append(label,detail);specificationList.append(row);
  });
  specificationList.hidden=!specificationList.children.length;
  const meta=document.createElement('div');
  meta.className='price-ask';
  if(isProduct&&Number.isFinite(item.price)&&item.price>=0){
    meta.textContent=formatPrice(item.price,item.currency);
  }else if(isProduct&&Number.isFinite(item.stock)&&item.stock>=0){
    meta.textContent=item.stock>0?`Stok: ${item.stock}`:'Stokta yok';
  }else if(isProduct){
    meta.textContent='Fiyat bilgisi hazırlanıyor';
  }else{
    meta.textContent='Ürün grubu yakında';
  }
  const addButton=document.createElement('button');
  addButton.type='button';
  addButton.className='add-to-cart';
  addButton.dataset.addToCart=item.id;
  addButton.textContent=isProduct?'Ürün listeme ekle':'İlgileniyorum';
  const actions=document.createElement('div');
  actions.className='product-card-actions';
  actions.append(addButton);
  if(isProduct){
    if(['cpu','motherboard','ram','gpu','disk','case','psu'].includes(item.categoryId)){
      const builderButton=document.createElement('button');
      builderButton.type='button';
      builderButton.className='add-to-builder';
      builderButton.dataset.addToBuilder=item.id;
      builderButton.textContent='Sistem oluşturucuyu aç';
      if(item.stock===0){builderButton.disabled=true;builderButton.textContent='Stokta yok';}
      actions.append(builderButton);
    }
    const favoriteButton=document.createElement('button');
    favoriteButton.type='button';
    favoriteButton.className='favorite-product favorite-heart-button';
    favoriteButton.dataset.favoriteProduct=item.id;
    favoriteButton.setAttribute('aria-pressed',String(favoriteIds.includes(item.id)));
    favoriteButton.setAttribute('aria-label',favoriteIds.includes(item.id)?`${item.name} favorilerden çıkar`:`${item.name} favorilere ekle`);
    favoriteButton.title=favoriteIds.includes(item.id)?'Favorilerden çıkar':'Favorilere ekle';
    favoriteButton.innerHTML=`<i class="fa-${favoriteIds.includes(item.id)?'solid':'regular'} fa-heart" aria-hidden="true"></i>`;
    art.append(favoriteButton);
    const compareButton=document.createElement('button');
    compareButton.type='button';
    compareButton.className='compare-product';
    compareButton.dataset.compareProduct=item.id;
    compareButton.setAttribute('aria-pressed',String(compareIds.includes(item.id)));
    compareButton.textContent=compareIds.includes(item.id)?'Karşılaştırmada':'Karşılaştır';
    actions.append(compareButton);
  }
  info.append(label,title,description,specificationList,meta,actions);
  card.append(art,info);
  return card;
}
function sortCatalogItems(items){
  const sort=productSort.value;
  const categoryOrder=new Map(catalog.categories.map(category=>[category.id,category.sortOrder||0]));
  return [...items].sort((a,b)=>{
    if(sort==='name-asc')return a.name.localeCompare(b.name,'tr');
    if(sort==='price-asc'||sort==='price-desc'){
      const aHasPrice=Number.isFinite(a.price),bHasPrice=Number.isFinite(b.price);
      if(aHasPrice!==bHasPrice)return aHasPrice?-1:1;
      if(aHasPrice&&a.price!==b.price)return sort==='price-asc'?a.price-b.price:b.price-a.price;
    }
    const categoryDifference=(categoryOrder.get(a.categoryId||a.id)||0)-(categoryOrder.get(b.categoryId||b.id)||0);
    return categoryDifference||((a.sortOrder||0)-(b.sortOrder||0))||a.name.localeCompare(b.name,'tr');
  });
}
function renderCatalog(){
  const products=catalog.products.filter(product=>product.status==='active');
  const homeProducts=document.body.dataset.page==='home'?products.filter(product=>featureMode==='campaign'?product.isCampaign:product.isBestseller):products;
  const visibleProducts=selectedProductCategories.length
    ?homeProducts.filter(product=>selectedProductCategories.includes(product.categoryId))
    :homeProducts;
  const populatedCategories=new Set(visibleProducts.map(product=>product.categoryId));
  const previewIds=selectedProductCategories.length?selectedProductCategories:defaultPreviewCategories;
  const categoryPreviews=document.body.dataset.page==='home'?[]:catalog.categories
    .filter(category=>previewIds.includes(category.id))
    .filter(category=>!populatedCategories.has(category.id))
    .map(category=>({...category,categoryId:category.id}));
  const items=sortCatalogItems([...visibleProducts,...categoryPreviews]);
  productGrid.replaceChildren(...items.map(item=>createProductCard(item,{isProduct:products.includes(item)})));
  productCards=[...productGrid.querySelectorAll('.product-card')];
  cartItemsById=new Map([
    ...products.map(product=>[product.id,product]),
    ...catalog.categories.map(category=>[category.id,{...category,categoryId:category.id}])
  ]);
  catalogProductIds=new Set(products.map(product=>product.id));
  if(catalogProductIds.size){
    const validFavorites=favoriteIds.filter(id=>catalogProductIds.has(id));
    if(validFavorites.length!==favoriteIds.length){favoriteIds=validFavorites;saveFavorites();}
  }
  const hasPrices=products.some(product=>Number.isFinite(product.price));
  productSort.querySelectorAll('[data-price-sort]').forEach(option=>option.disabled=!hasPrices);
  if(productSort.selectedOptions[0]?.disabled)productSort.value='featured';
  quoteIds=savedQuoteIds.filter(id=>cartItemsById.has(id));
  compareIds=compareIds.filter(id=>catalogProductIds.has(id)).slice(0,4);
  saveCompare();
  saveQuote();
  document.getElementById('productHeading').textContent=document.body.dataset.page==='home'?(featureMode==='campaign'?'Kampanyalı ürünler':'Çok satanlar'):(selectedProductLabel||'Bilgisayar Parçaları');
  productFilterStatus.textContent=selectedProductLabel?'Seçilen kategori: '+selectedProductLabel:(featureMode==='campaign'?'Kampanyalı ürünler':'Çok satanlar');
  renderCart();
  renderCompareBar();
  renderFavorites();
  filterCards();
  window.dispatchEvent(new CustomEvent('catalog:updated',{detail:{catalog}}));
}
async function fetchLiveCatalog(){
  const config=window.SUPABASE_CONFIG||{};
  if(!config.url||!config.publishableKey||!window.supabase?.createClient)return null;
  const client=window.supabase.createClient(config.url,config.publishableKey);
  const {data:categoryRows,error:categoryError}=await client.from('catalog_categories').select('id,name,description,icon,tone,sort_order,search_terms').eq('is_active',true).order('sort_order');
  let {data:productRows,error:productError}=await client.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,sort_order,search_terms,attributes,is_bestseller,is_campaign').eq('status','active').order('sort_order');
  if(productError){const fallback=await client.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,sort_order,search_terms,attributes').eq('status','active').order('sort_order');productRows=fallback.data;productError=fallback.error;}
  if(categoryError||productError||!categoryRows?.length)return null;
  return {
    currency:'TRY',
    categories:categoryRows.map(row=>({id:row.id,name:row.name,description:row.description,icon:row.icon,tone:row.tone,sortOrder:row.sort_order,searchTerms:row.search_terms||[]})),
    products:(productRows||[]).map(row=>({id:row.id,slug:row.slug,categoryId:row.category_id,name:row.name,description:row.description,brand:row.brand,model:row.model,sku:row.sku,image:row.image_path,price:row.price===null?null:Number(row.price),currency:row.currency,stock:row.stock,status:row.status,sortOrder:row.sort_order,searchTerms:row.search_terms||[],attributes:row.attributes||{},isBestseller:Boolean(row.is_bestseller),isCampaign:Boolean(row.is_campaign)}))
  };
}
async function loadCatalog(){
  try{
    let data=null;
    try{data=await fetchLiveCatalog();}catch{}
    if(!data){
      const response=await fetch('assets/data/catalog.json',{cache:'no-store'});
      if(!response.ok)throw new Error('Katalog dosyası yüklenemedi.');
      data=await response.json();
    }
    if(!Array.isArray(data.categories)||!Array.isArray(data.products))throw new Error('Katalog verisi eksik.');
    let builderData=null;
    try{
      const response=await fetch('assets/data/builder-products.json',{cache:'no-store'});
      if(response.ok)builderData=await response.json();
    }catch{}
    const products=[...data.products];
    const knownSlugs=new Set(products.map(product=>product.slug).filter(Boolean));
    (builderData?.products||[]).forEach(product=>{if(!knownSlugs.has(product.slug)){products.push(product);knownSlugs.add(product.slug);}});
    const categories=[...data.categories];
    if(builderData?.category&&!categories.some(category=>category.id===builderData.category.id))categories.push(builderData.category);
    catalog={...data,categories,products,currency:data.currency||'TRY'};
    renderCatalog();
  }catch{
    const error=document.createElement('p');
    error.className='catalog-error';
    error.textContent='Ürün grupları şu anda yüklenemiyor. Biraz sonra yeniden deneyin.';
    productGrid.replaceChildren(error);
    productCards=[];
    quoteIds=[];
    renderCart();
  }
}
function filterCards(){
  const query=normalizeText(searchInput.value.trim());
  productFilterStatus.textContent=(selectedProductLabel?'Seçilen kategori: '+selectedProductLabel:'Tüm alt kategoriler')+(favoritesOnly?' · Favorilerim':'');
  let visible=0;
  [...categoryCards,...subcategoryButtons,...quickCategoryButtons,...componentQuickButtons,...productCards].forEach(card=>{
    let matches=(!query||normalizeText(card.dataset.search||card.textContent).includes(query))&&(!favoritesOnly||!card.classList.contains('product-card')||favoriteIds.includes(card.dataset.productId));
    card.hidden=!matches;
    if(matches)visible++;
  });
  const visibleProducts=productCards.filter(card=>!card.hidden).length;
  const emptyCategory=selectedProductCategories.length>0&&productCards.length===0;
  const emptySearch=query.length>0&&visibleProducts===0;
  const emptyFavorites=favoritesOnly&&visibleProducts===0;
  const emptyShowcase=document.body.dataset.page==='home'&&productCards.length===0;
  emptyState.hidden=!emptyCategory&&!emptySearch&&!emptyFavorites&&!emptyShowcase;
  emptyState.textContent=emptyShowcase
    ?(featureMode==='campaign'?'Henüz kampanyalı ürün seçilmedi. Yönetim panelinden kampanya olarak işaretleyebilirsin.':'Çok satanlar vitrini henüz hazırlanıyor.')
    :emptyFavorites
    ?'Henüz favori ürünün yok. Beğendiğin ürünlerdeki kalp düğmesine dokunarak buraya ekleyebilirsin.'
    :emptyCategory
    ?'Bu ürün grubuna henüz katalog kaydı eklenmedi.'
    :'Aramana uygun ürün veya kategori bulamadık.';
  if(query&&subcategoryButtons.some(button=>!button.hidden)){
    componentSubcategories.hidden=false;
    computerPartsToggle.setAttribute('aria-expanded','true');
  }
}
function readFavoriteList(key){ return window.TezcanCatalogUtils.readStringIds(key); }
function saveFavorites(){
  try { localStorage.setItem(currentFavoritesKey,JSON.stringify(favoriteIds)); } catch {}
  renderFavoriteCount();
  if(favoriteSyncReady){clearTimeout(favoriteSyncTimer);favoriteSyncTimer=setTimeout(syncFavoriteCloud,500);}
}
function renderFavoriteCount(){
  if(headerFavoriteCount)headerFavoriteCount.textContent=String(favoriteIds.length);
  document.dispatchEvent(new CustomEvent('favorites:updated',{detail:{ids:[...favoriteIds]}}));
}
async function syncFavoriteCloud(){
  if(!favoriteSyncReady||!favoriteSyncClient||!favoriteUserId)return;
  const desired=new Set(favoriteIds);
  const removed=[...remoteFavoriteIds].filter(id=>!desired.has(id));
  const added=[...desired].filter(id=>!remoteFavoriteIds.has(id));
  try{
    if(removed.length){const {error}=await favoriteSyncClient.from('customer_favorites').delete().eq('user_id',favoriteUserId).in('product_id',removed);if(error)throw error;}
    if(added.length){const rows=added.map(product_id=>({user_id:favoriteUserId,product_id}));const {error}=await favoriteSyncClient.from('customer_favorites').upsert(rows,{onConflict:'user_id,product_id',ignoreDuplicates:true});if(error)throw error;}
    remoteFavoriteIds=desired;
  }catch(error){console.warn('Favoriler hesaba eşitlenemedi:',error);favoriteSyncReady=false;}
}
async function activateFavoriteAccount(session){
  const userId=session?.user?.id||'';
  if(!userId){favoriteSyncReady=false;favoriteSyncLoading=false;favoriteUserId='';favoriteSyncClient=null;remoteFavoriteIds=new Set();currentFavoritesKey=favoritesKey;favoriteIds=readFavoriteList(favoritesKey);renderFavorites();renderFavoriteCount();return;}
  if(favoriteUserId===userId&&(favoriteSyncReady||favoriteSyncLoading))return;
  favoriteSyncLoading=true;favoriteSyncReady=false;favoriteUserId=userId;
  favoriteSyncClient=window.supabase.createClient((window.SUPABASE_CONFIG||{}).url,(window.SUPABASE_CONFIG||{}).publishableKey);
  currentFavoritesKey=`${favoritesKey}-user-${userId}`;
  const hasAccountList=localStorage.getItem(currentFavoritesKey)!==null;
  const accountList=readFavoriteList(currentFavoritesKey);
  const guestList=readFavoriteList(favoritesKey);
  try{
    const {data,error}=await favoriteSyncClient.from('customer_favorites').select('product_id').order('created_at');
    if(error)throw error;
    remoteFavoriteIds=new Set((data||[]).map(row=>row.product_id));
    favoriteIds=[...new Set([...remoteFavoriteIds,...accountList])];
    if(catalogProductIds.size)favoriteIds=favoriteIds.filter(id=>catalogProductIds.has(id));
    const importOwner=localStorage.getItem('tezcan-product-favorites-guest-owner');
    if((!importOwner||importOwner===userId)&&!hasAccountList){favoriteIds=[...new Set([...favoriteIds,...guestList])];if(guestList.length)localStorage.setItem('tezcan-product-favorites-guest-owner',userId);}
    favoriteSyncReady=true;favoriteSyncLoading=false;
    saveFavorites();renderFavorites();renderFavoriteCount();
  }catch(error){
    console.warn('Favoriler hesaptan alınamadı:',error);
    const guestOwner=localStorage.getItem('tezcan-product-favorites-guest-owner');
    favoriteIds=hasAccountList?accountList:(!guestOwner||guestOwner===userId?guestList:[]);
    favoriteSyncLoading=false;currentFavoritesKey=`${favoritesKey}-user-${userId}`;
    saveFavorites();renderFavorites();renderFavoriteCount();
  }
}

function renderFavorites(){
  favoritesFilter.setAttribute('aria-pressed',String(favoritesOnly));
  favoritesFilter.classList.toggle('is-active',favoritesOnly);
  favoritesFilter.innerHTML=`<i class="fa-${favoritesOnly?'solid':'regular'} fa-heart" aria-hidden="true"></i> Favorilerim <span id="favoriteCount">${favoriteIds.length}</span>`;
  renderFavoriteCount();
  productGrid.querySelectorAll('[data-favorite-product]').forEach(button=>{
    const selected=favoriteIds.includes(button.dataset.favoriteProduct);
    const product=catalog.products.find(item=>item.id===button.dataset.favoriteProduct);
    button.setAttribute('aria-pressed',String(selected));
    button.setAttribute('aria-label',`${product?.name||'Ürün'} ${selected?'favorilerden çıkar':'favorilere ekle'}`);
    button.title=selected?'Favorilerden çıkar':'Favorilere ekle';
    button.innerHTML=`<i class="fa-${selected?'solid':'regular'} fa-heart" aria-hidden="true"></i>`;
  });
}
function toggleFavorite(productId){
  favoriteIds=favoriteIds.includes(productId)?favoriteIds.filter(id=>id!==productId):[...favoriteIds,productId];
  saveFavorites();
  renderFavorites();
  filterCards();
}
function selectProductCategory(button){
  selectedProductCategories=[button.dataset.selectCategory];
  selectedProductLabel=button.querySelector('h3')?.textContent.trim()||button.textContent.trim();
  searchInput.value='';
  subcategoryButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  quickCategoryButtons.forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.selectCategory===button.dataset.selectCategory)));
  componentQuickButtons.forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.selectCategory===button.dataset.selectCategory)));
  categoryCards.forEach(card=>card.classList.toggle('is-selected',card.dataset.selectCategory===button.dataset.selectCategory));
  computerPartsToggle.classList.remove('is-selected');
  quickComponentToggle.classList.toggle('is-selected',componentQuickButtons.some(item=>item.dataset.selectCategory===button.dataset.selectCategory));
  quickComponentMenu.hidden=true;
  quickComponentToggle.setAttribute('aria-expanded','false');
  showAllProducts.hidden=false;
  renderCatalog();
  document.getElementById('urunler').scrollIntoView({behavior:'smooth'});
}
function resetProductCategory(){
  selectedProductCategories=[];
  selectedProductLabel='';
  subcategoryButtons.forEach(item=>item.setAttribute('aria-pressed','false'));
  categoryCards.forEach(card=>card.classList.remove('is-selected'));
  quickCategoryButtons.forEach(item=>item.setAttribute('aria-pressed','false'));
  componentQuickButtons.forEach(item=>item.setAttribute('aria-pressed','false'));
  computerPartsToggle.classList.remove('is-selected');
  quickComponentToggle.classList.remove('is-selected');
  showAllProducts.hidden=true;
  searchInput.value='';
  renderCatalog();
}
function quickCategoryMenuOpen(){
  quickComponentMenu.hidden=false;
  quickComponentToggle.setAttribute('aria-expanded','true');
}
function quickCategoryMenuClose(){
  quickComponentMenu.hidden=true;
  quickComponentToggle.setAttribute('aria-expanded','false');
}
function saveQuote(){
  try { localStorage.setItem(cartKey,JSON.stringify(quoteIds)); } catch {}
}
function openCart(){
  if(!cartOverlay.hidden)return;
  cartReturnFocus=document.activeElement;
  previousBodyOverflow=document.body.style.overflow;
  cartOverlay.hidden=false;
  document.body.style.overflow='hidden';
  document.getElementById('closeCart').focus();
}
function closeCart(){
  if(cartOverlay.hidden)return;
  cartOverlay.hidden=true;
  document.body.style.overflow=previousBodyOverflow;
  if(cartReturnFocus instanceof HTMLElement&&cartReturnFocus.isConnected)cartReturnFocus.focus();
  cartReturnFocus=null;
}
function renderCart(){
  const counts={};
  quoteIds.forEach(id=>counts[id]=(counts[id]||0)+1);
  const total=quoteIds.length;
  document.getElementById('cartCount').textContent=total;
  document.getElementById('sectionCartCount').textContent='('+total+')';
  sendQuote.disabled=total===0;
  cartList.replaceChildren();
  if(total===0){
    const empty=document.createElement('div');
    empty.className='cart-empty';
    empty.textContent='Henüz ürün grubu eklemedin.';
    cartList.append(empty);
    return;
  }
  Object.entries(counts).forEach(([id,quantity])=>{
    const item=cartItemsById.get(id);
    if(!item)return;
    const row=document.createElement('div');row.className='cart-line';
    const info=document.createElement('div');
    const title=document.createElement('strong');title.textContent=item.name;
    const detail=document.createElement('small');detail.textContent=catalogProductIds.has(id)?'Adet: '+quantity+' · Ürün':'Planlanan ürün grubu';
    info.append(title,detail);
    const remove=document.createElement('button');remove.type='button';remove.className='remove-item';remove.dataset.removeItem=id;remove.textContent='Kaldır';
    row.append(info,remove);cartList.append(row);
  });
}

function saveCompare(){
  try { localStorage.setItem(compareKey,JSON.stringify(compareIds)); } catch {}
}
function renderCompareBar(){
  compareBar.hidden=compareIds.length===0;
  document.getElementById('compareCount').textContent=compareIds.length;
  document.getElementById('openCompare').disabled=compareIds.length<2;
  productGrid.querySelectorAll('[data-compare-product]').forEach(button=>{
    const selected=compareIds.includes(button.dataset.compareProduct);
    button.setAttribute('aria-pressed',String(selected));
    button.textContent=selected?'Karşılaştırmada':'Karşılaştır';
  });
}
function toggleCompare(productId){
  const product=catalog.products.find(item=>item.id===productId&&item.status==='active');
  if(!product)return;
  if(compareIds.includes(productId)){
    compareIds=compareIds.filter(id=>id!==productId);
  }else{
    const selectedProducts=compareIds.map(id=>catalog.products.find(item=>item.id===id)).filter(Boolean);
    if(selectedProducts.length&&selectedProducts[0].categoryId!==product.categoryId){
      document.getElementById('productFilterStatus').textContent='Karşılaştırma için aynı kategoriden ürün seç. Önceki seçimini temizleyebilir veya kaldırabilirsin.';
      return;
    }
    if(compareIds.length>=4){
      document.getElementById('productFilterStatus').textContent='En fazla 4 ürünü aynı anda karşılaştırabilirsin.';
      return;
    }
    compareIds=[...compareIds,productId];
  }
  saveCompare();
  renderCompareBar();
}
function openComparison(){
  const products=compareIds.map(id=>catalog.products.find(item=>item.id===id)).filter(Boolean);
  if(products.length<2)return;
  const definitions=window.PRODUCT_ATTRIBUTE_DEFINITIONS?.[products[0].categoryId]?.fields||[];
  const rows=[
    {label:'Marka',value:product=>product.brand},
    {label:'Model',value:product=>product.model},
    ...definitions.map(field=>({label:field.label,unit:field.unit,key:field.key})),
    {label:'Fiyat',value:product=>Number.isFinite(product.price)?formatPrice(product.price,product.currency):'Bilgi hazırlanıyor'}
  ];
  const table=document.createElement('table');
  table.className='compare-table';
  const head=document.createElement('thead');
  const headRow=document.createElement('tr');
  const labelHead=document.createElement('th');labelHead.scope='col';labelHead.textContent='Özellik';headRow.append(labelHead);
  products.forEach(product=>{const th=document.createElement('th');th.scope='col';th.textContent=product.name;headRow.append(th);});
  head.append(headRow);
  const body=document.createElement('tbody');
  rows.forEach(row=>{
    const tr=document.createElement('tr');
    const label=document.createElement('th');label.scope='row';label.textContent=row.label;tr.append(label);
    products.forEach(product=>{
      const cell=document.createElement('td');
      const value=row.key?product.attributes?.[row.key]:row.value(product);
      cell.textContent=value===undefined||value===null||value===''?'—':`${value}${row.unit?` ${row.unit}`:''}`;
      tr.append(cell);
    });
    body.append(tr);
  });
  table.append(head,body);
  compareTableWrap.replaceChildren(table);
  const categoryName=catalog.categories.find(category=>category.id===products[0].categoryId)?.name||'aynı kategoriden';
  document.getElementById('compareHint').textContent=`${categoryName} kategorisinden ${products.length} ürün · Eksik özellikler — olarak gösterilir.`;
  compareDialog.showModal();
}

searchForm.addEventListener('submit',event=>{
  event.preventDefault();
  const query=searchInput.value.trim();
  if(query){location.assign(`bilgisayar-parcalari.html?q=${encodeURIComponent(query)}`);return;}
  filterCards();document.getElementById('urunler').scrollIntoView({behavior:'smooth'});
});
searchInput.addEventListener('input',filterCards);
productSort.addEventListener('change',renderCatalog);
favoritesFilter.addEventListener('click',()=>{favoritesOnly=!favoritesOnly;renderFavorites();filterCards();});
featureTabs.forEach(tab=>tab.addEventListener('click',()=>{
  featureMode=tab.dataset.featureMode==='campaign'?'campaign':'bestseller';
  featureTabs.forEach(item=>{const active=item===tab;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
  searchInput.value='';renderCatalog();
}));
document.getElementById('currentYear').textContent=new Date().getFullYear();
computerPartsToggle.addEventListener('click',()=>{
  const expanded=computerPartsToggle.getAttribute('aria-expanded')==='true';
  computerPartsToggle.setAttribute('aria-expanded',String(!expanded));
  componentSubcategories.hidden=expanded;
});
subcategoryButtons.forEach(button=>button.addEventListener('click',()=>selectProductCategory(button)));
document.getElementById('categoryGrid').addEventListener('click',event=>{
  const category=event.target.closest('[data-select-category]');
  if(!category||category===computerPartsToggle)return;
  event.preventDefault();
  selectProductCategory(category);
});
document.getElementById('quickCategoryNav').addEventListener('click',event=>{
  const quickCategory=event.target.closest('[data-select-category]');
  if(!quickCategory)return;
  const matchingCategory=[...categoryCards,...subcategoryButtons].find(category=>category.dataset.selectCategory===quickCategory.dataset.selectCategory);
  if(matchingCategory)selectProductCategory(matchingCategory);
});
quickComponentToggle.addEventListener('click',()=>{
  quickCategoryMenuOpen();
});
quickCategoryContainer.addEventListener('mouseenter',event=>{
  if(event.target===quickCategoryContainer)quickCategoryMenuOpen();
});
quickComponentToggle.addEventListener('mouseenter',quickCategoryMenuOpen);
quickComponentToggle.addEventListener('mouseleave',event=>{
  if(!quickComponentMenu.contains(event.relatedTarget)&&!quickComponentToggle.contains(document.activeElement))quickCategoryMenuClose();
});
quickComponentMenu.addEventListener('mouseleave',event=>{
  if(!quickComponentToggle.contains(event.relatedTarget)&&!quickComponentMenu.contains(document.activeElement))quickCategoryMenuClose();
});
quickCategoryContainer.addEventListener('focusin',event=>{
  if(event.target===quickComponentToggle||quickComponentMenu.contains(event.target))quickCategoryMenuOpen();
});
quickCategoryContainer.addEventListener('focusout',event=>{
  if(!quickCategoryContainer.contains(event.relatedTarget))quickCategoryMenuClose();
});
quickCategoryContainer.addEventListener('click',event=>{
  const quickCategory=event.target.closest('#quickComponentMenu [data-select-category]');
  if(!quickCategory)return;
  const matchingCategory=subcategoryButtons.find(category=>category.dataset.selectCategory===quickCategory.dataset.selectCategory);
  if(matchingCategory)selectProductCategory(matchingCategory);
});
document.addEventListener('pointerdown',event=>{
  if(!quickCategoryContainer.contains(event.target))quickCategoryMenuClose();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!quickComponentMenu.hidden){quickCategoryMenuClose();quickComponentToggle.focus();}
});
showAllProducts.addEventListener('click',resetProductCategory);
document.getElementById('openCart').addEventListener('click',openCart);
document.getElementById('openCartFromProducts').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
cartOverlay.addEventListener('click',event=>{if(event.target===cartOverlay)closeCart();});
document.addEventListener('keydown',event=>{
  if(cartOverlay.hidden)return;
  if(event.key==='Escape'){closeCart();return;}
  if(event.key==='Tab'){
    const focusable=[...cartOverlay.querySelectorAll('button:not(:disabled),a[href],[tabindex]')].filter(el=>!el.hidden&&el.tabIndex>=0);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
document.addEventListener('click',event=>{
  const builderButton=event.target.closest('[data-add-to-builder]');
  if(builderButton){
    location.assign('sistem-topla.html');
    return;
  }
  const favoriteButton=event.target.closest('[data-favorite-product]');
  if(favoriteButton){toggleFavorite(favoriteButton.dataset.favoriteProduct);return;}
  const compareButton=event.target.closest('[data-compare-product]');
  if(compareButton){toggleCompare(compareButton.dataset.compareProduct);return;}
  const addButton=event.target.closest('[data-add-to-cart]');
  if(addButton){
    quoteIds.push(addButton.dataset.addToCart);savedQuoteIds=[...quoteIds];saveQuote();renderCart();openCart();return;
  }
  const removeButton=event.target.closest('[data-remove-item]');
  if(removeButton){
    const index=quoteIds.indexOf(removeButton.dataset.removeItem);
    if(index!==-1)quoteIds.splice(index,1);
    savedQuoteIds=[...quoteIds];saveQuote();renderCart();
  }
});
sendQuote.addEventListener('click',()=>{
  if(!quoteIds.length)return;
  const counts={};quoteIds.forEach(id=>counts[id]=(counts[id]||0)+1);
  const lines=Object.entries(counts).map(([id,quantity])=>{
    const item=cartItemsById.get(id);
    return item?'- '+item.name+(catalogProductIds.has(id)?' (adet: '+quantity+')':''):null;
  }).filter(Boolean);
  const message='Merhaba, Tezcan Bilgisayar açıldığında bu ürün gruplarıyla ilgileniyorum:\n'+lines.join('\n')+'\nKuruluş öncesi hazırlık sürecini takip etmek istiyorum.';
  window.open('https://wa.me/905324694249?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
});
document.getElementById('openCompare').addEventListener('click',openComparison);
document.getElementById('closeCompare').addEventListener('click',()=>compareDialog.close());
compareDialog.addEventListener('click',event=>{if(event.target===compareDialog)compareDialog.close();});
document.getElementById('clearCompare').addEventListener('click',()=>{compareIds=[];saveCompare();renderCompareBar();});
renderFavoriteCount();
const mainConfig=window.SUPABASE_CONFIG||{};
if(mainConfig.url&&mainConfig.publishableKey&&window.supabase?.createClient){
  const favoriteAuthClient=window.supabase.createClient(mainConfig.url,mainConfig.publishableKey);
  favoriteAuthClient.auth.getSession().then(({data})=>activateFavoriteAccount(data?.session)).catch(()=>{});
  favoriteAuthClient.auth.onAuthStateChange((_event,session)=>setTimeout(()=>activateFavoriteAccount(session),0));
}else activateFavoriteAccount(null);
window.addEventListener('storage',event=>{
  if(event.key===currentFavoritesKey){favoriteIds=readFavoriteList(currentFavoritesKey);renderFavorites();filterCards();}
});
loadCatalog();








