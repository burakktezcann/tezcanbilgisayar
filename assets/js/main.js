const searchForm=document.getElementById('siteSearch');
const searchInput=document.getElementById('searchInput');
const categoryCards=[...document.querySelectorAll('#categoryGrid .category-card')];
const subcategoryButtons=[...document.querySelectorAll('.subcategory-chip')];
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
const cartKey='tezcan-offer-list';
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
const defaultPreviewCategories=['cpu','motherboard','ram','gpu','disk','case','psu'];

try {
  const saved=JSON.parse(localStorage.getItem(cartKey)||'[]');
  savedQuoteIds=Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[];
} catch { savedQuoteIds=[]; }

function normalizeText(value){
  return String(value||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
}
function formatPrice(price,currency){
  const safeCurrency=/^[A-Z]{3}$/.test(currency||'')?currency:(catalog.currency||'TRY');
  return new Intl.NumberFormat('tr-TR',{style:'currency',currency:safeCurrency}).format(price);
}
function createProductCard(item,{isProduct=false}={}){
  const card=document.createElement('article');
  card.className='product-card';
  card.dataset.productId=item.id;
  card.dataset.categoryId=item.categoryId||item.id;
  card.dataset.search=[item.name,item.description,item.brand,item.model,item.sku,...(item.searchTerms||[])].filter(Boolean).join(' ');

  const art=document.createElement('div');
  const tone=allowedTones.has(item.tone)?item.tone:'blue';
  art.className=`product-art product-tone-${tone}`;
  art.setAttribute('aria-hidden','true');
  const icon=document.createElement('i');
  const iconName=/^fa-[a-z0-9-]+$/.test(item.icon||'')?item.icon:'fa-box';
  icon.className=`fa-solid ${iconName}`;
  const imagePath=typeof item.image==='string'&&/^assets\/products\/[A-Za-z0-9._/-]+$/.test(item.image)&&!item.image.includes('..')?item.image:'';
  if(imagePath){
    const image=document.createElement('img');
    image.className='product-image';
    image.src=imagePath;
    image.alt="";
    image.loading='lazy';
    image.addEventListener('error',()=>{image.replaceWith(icon);},{once:true});
    art.append(image);
  }else{
    art.append(icon);
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
  info.append(label,title,description,meta,addButton);
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
  const visibleProducts=selectedProductCategories.length
    ?products.filter(product=>selectedProductCategories.includes(product.categoryId))
    :products;
  const populatedCategories=new Set(visibleProducts.map(product=>product.categoryId));
  const previewIds=selectedProductCategories.length?selectedProductCategories:defaultPreviewCategories;
  const categoryPreviews=catalog.categories
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
  const hasPrices=products.some(product=>Number.isFinite(product.price));
  productSort.querySelectorAll('[data-price-sort]').forEach(option=>option.disabled=!hasPrices);
  if(productSort.selectedOptions[0]?.disabled)productSort.value='featured';
  quoteIds=savedQuoteIds.filter(id=>cartItemsById.has(id));
  saveQuote();
  document.getElementById('productHeading').textContent=selectedProductLabel||'Bilgisayar Parçaları';
  productFilterStatus.textContent=selectedProductLabel?'Seçilen kategori: '+selectedProductLabel:'Tüm alt kategoriler';
  renderCart();
  filterCards();
}
async function fetchLiveCatalog(){
  const config=window.SUPABASE_CONFIG||{};
  if(!config.url||!config.publishableKey||!window.supabase?.createClient)return null;
  const client=window.supabase.createClient(config.url,config.publishableKey);
  const [{data:categoryRows,error:categoryError},{data:productRows,error:productError}]=await Promise.all([
    client.from('catalog_categories').select('id,name,description,icon,tone,sort_order,search_terms').eq('is_active',true).order('sort_order'),
    client.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,sort_order,search_terms').eq('status','active').order('sort_order')
  ]);
  if(categoryError||productError||!categoryRows?.length)return null;
  return {
    currency:'TRY',
    categories:categoryRows.map(row=>({id:row.id,name:row.name,description:row.description,icon:row.icon,tone:row.tone,sortOrder:row.sort_order,searchTerms:row.search_terms||[]})),
    products:(productRows||[]).map(row=>({id:row.id,slug:row.slug,categoryId:row.category_id,name:row.name,description:row.description,brand:row.brand,model:row.model,sku:row.sku,image:row.image_path,price:row.price===null?null:Number(row.price),currency:row.currency,stock:row.stock,status:row.status,sortOrder:row.sort_order,searchTerms:row.search_terms||[]}))
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
    catalog={...data,categories:data.categories,products:data.products,currency:data.currency||'TRY'};
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
  let visible=0;
  [...categoryCards,...subcategoryButtons,...productCards].forEach(card=>{
    let matches=!query||normalizeText(card.dataset.search||card.textContent).includes(query);
    card.hidden=!matches;
    if(matches)visible++;
  });
  const visibleProducts=productCards.filter(card=>!card.hidden).length;
  const emptyCategory=selectedProductCategories.length>0&&productCards.length===0;
  const emptySearch=query.length>0&&visibleProducts===0;
  emptyState.hidden=!emptyCategory&&!emptySearch;
  emptyState.textContent=emptyCategory
    ?'Bu ürün grubuna henüz katalog kaydı eklenmedi.'
    :'Aramana uygun ürün veya kategori bulamadık.';
  if(query&&subcategoryButtons.some(button=>!button.hidden)){
    componentSubcategories.hidden=false;
    computerPartsToggle.setAttribute('aria-expanded','true');
  }
}
function selectProductCategory(button){
  selectedProductCategories=[button.dataset.selectCategory];
  selectedProductLabel=button.textContent.trim();
  searchInput.value='';
  subcategoryButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  categoryCards.forEach(card=>card.classList.toggle('is-selected',card.dataset.selectCategory===button.dataset.selectCategory));
  showAllProducts.hidden=false;
  renderCatalog();
  document.getElementById('urunler').scrollIntoView({behavior:'smooth'});
}
function resetProductCategory(){
  selectedProductCategories=[];
  selectedProductLabel='';
  subcategoryButtons.forEach(item=>item.setAttribute('aria-pressed','false'));
  categoryCards.forEach(card=>card.classList.remove('is-selected'));
  showAllProducts.hidden=true;
  searchInput.value='';
  renderCatalog();
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

searchForm.addEventListener('submit',event=>{
  event.preventDefault();filterCards();
  document.getElementById((selectedProductCategories.length||(searchInput.value.trim()&&productCards.some(card=>!card.hidden)))?'urunler':'urun-kategorileri').scrollIntoView({behavior:'smooth'});
});
searchInput.addEventListener('input',filterCards);
productSort.addEventListener('change',renderCatalog);
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
  const title=category.querySelector('h3')?.textContent.trim()||category.dataset.selectCategory;
  selectedProductCategories=[category.dataset.selectCategory];
  selectedProductLabel=title;
  searchInput.value='';
  subcategoryButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
  categoryCards.forEach(card=>card.classList.toggle('is-selected',card===category));
  showAllProducts.hidden=false;
  renderCatalog();
  document.getElementById('urunler').scrollIntoView({behavior:'smooth'});
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
loadCatalog();








