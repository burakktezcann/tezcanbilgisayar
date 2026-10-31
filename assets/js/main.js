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
let selectedProductCategory='';
let quoteIds=[];
let savedQuoteIds=[];
let cartReturnFocus=null;
let previousBodyOverflow='';

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
  const populatedCategories=new Set(products.map(product=>product.categoryId));
  const categoryPreviews=catalog.categories
    .filter(category=>!populatedCategories.has(category.id))
    .map(category=>({...category,categoryId:category.id}));
  const items=sortCatalogItems([...products,...categoryPreviews]);
  productGrid.replaceChildren(...items.map(item=>createProductCard(item,{isProduct:products.includes(item)})));
  productCards=[...productGrid.querySelectorAll('.product-card')];
  const hasPrices=products.some(product=>Number.isFinite(product.price));
  productSort.querySelectorAll('[data-price-sort]').forEach(option=>option.disabled=!hasPrices);
  if(productSort.selectedOptions[0]?.disabled)productSort.value='featured';
  const validIds=new Set(productCards.map(card=>card.dataset.productId));
  quoteIds=savedQuoteIds.filter(id=>validIds.has(id));
  saveQuote();
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
  if(categoryError|…7628 tokens truncated….getElementById('categorySearchTerms').value),
    is_active:document.getElementById('categoryActive').checked,
    updated_at:new Date().toISOString()
  };
  const result=originalId?await client.from('catalog_categories').update(values).eq('id',originalId):await client.from('catalog_categories').insert(values);
  setBusy(categoryForm,false);
  if(result.error){message(adminMessage,'Kategori kaydedilemedi. Kısa adı benzersiz ve harf/rakam/tire biçiminde olmalı.','error');return;}
  resetCategoryForm();await loadCatalogData();message(adminMessage,'Kategori kaydedildi.','success');
});
productRows.addEventListener('click',async event=>{
  const edit=event.target.closest('[data-edit-product]');if(edit){editProduct(edit.dataset.editProduct);return;}
  const remove=event.target.closest('[data-delete-product]');if(!remove||!window.confirm('Bu ürünü katalogdan silmek istiyor musun?'))return;
  const {error}=await client.from('catalog_products').delete().eq('id',remove.dataset.deleteProduct);
  if(error){message(adminMessage,'Ürün silinemedi.','error');return;}
  await loadCatalogData();message(adminMessage,'Ürün silindi.','success');
});
categoryRows.addEventListener('click',async event=>{
  const edit=event.target.closest('[data-edit-category]');if(edit){editCategory(edit.dataset.editCategory);return;}
  const toggle=event.target.closest('[data-toggle-category]');if(!toggle)return;
  const category=categories.find(item=>item.id===toggle.dataset.toggleCategory);if(!category)return;
  const {error}=await client.from('catalog_categories').update({is_active:!category.is_active,updated_at:new Date().toISOString()}).eq('id',category.id);
  if(error){message(adminMessage,'Kategori durumu güncellenemedi.','error');return;}
  await loadCatalogData();message(adminMessage,'Kategori durumu güncellendi.','success');
});

if(!config.url||!config.publishableKey||!window.supabase?.createClient){
  setupNotice.hidden=false;loginPanel.hidden=true;
}else{
  client=window.supabase.createClient(config.url,config.publishableKey);
  restoreSession();
}

