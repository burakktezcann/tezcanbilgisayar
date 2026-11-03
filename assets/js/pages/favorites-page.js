const favoriteStorageKey='tezcan-product-favorites';
const favoriteItems=document.getElementById('favoriteItems');
const favoriteEmpty=document.getElementById('favoriteEmpty');
const favoritePageCount=document.getElementById('favoritePageCount');
const favoriteSyncNote=document.getElementById('favoriteSyncNote');
const favoritesStatus=document.getElementById('favoritesStatus');
const favoriteConfig=window.SUPABASE_CONFIG||{};
const favoriteClient=favoriteConfig.url&&favoriteConfig.publishableKey&&window.supabase?.createClient?window.supabase.createClient(favoriteConfig.url,favoriteConfig.publishableKey):null;
let signedInUser=null;
let favoritePageIds=[];
let favoriteProducts=[];
let activeFavoriteStorageKey=favoriteStorageKey;
let favoriteCloudReady=false;
let favoriteCatalogAvailable=false;
function readFavoriteIds(key){return window.TezcanCatalogUtils.readStringIds(key);}
function persistFavoriteIds(){try{localStorage.setItem(activeFavoriteStorageKey,JSON.stringify(favoritePageIds));}catch{} updateCount();}
function updateCount(){favoritePageCount.textContent=String(favoritePageIds.length);}
function displayPrice(product){return window.TezcanCatalogUtils.formatCurrency(product.price,product.currency);}
function safeImagePath(image){return window.TezcanCatalogUtils.validImagePath(image)?image:'';}
function renderFavoriteItems(){
  const products=favoritePageIds.map(id=>favoriteProducts.find(item=>item.id===id)).filter(Boolean);
  favoriteItems.replaceChildren(...products.map(product=>{
    const card=document.createElement('article');card.className='favorite-item-card';
    const art=document.createElement('div');art.className='favorite-item-art';
    const imagePath=safeImagePath(product.image);
    if(imagePath){const image=document.createElement('img');image.src=imagePath;image.alt='';image.loading='lazy';image.decoding='async';image.addEventListener('error',()=>art.replaceChildren(makeProductIcon()),{once:true});art.append(image);}else art.append(makeProductIcon());
    const remove=document.createElement('button');remove.type='button';remove.className='favorite-remove';remove.dataset.removeFavorite=product.id;remove.setAttribute('aria-label',`${product.name} favorilerden çıkar`);remove.title='Favorilerden çıkar';remove.innerHTML='<i class="fa-solid fa-heart" aria-hidden="true"></i>';art.append(remove);
    const body=document.createElement('div');body.className='favorite-item-info';
    const category=document.createElement('span');category.className='favorite-item-category';category.textContent=product.brand||'Ürün';
    const title=document.createElement('h2');title.textContent=product.name;
    const description=document.createElement('p');description.textContent=product.description||product.model||'';
    const price=document.createElement('strong');price.className='favorite-item-price';price.textContent=displayPrice(product);
    const actions=document.createElement('div');actions.className='favorite-item-actions';
    const store=document.createElement('a');store.href=`index.html#urunler`;store.textContent='Mağazada gör';
    const deleteButton=document.createElement('button');deleteButton.type='button';deleteButton.dataset.removeFavorite=product.id;deleteButton.textContent='Favorilerden çıkar';
    actions.append(store,deleteButton);body.append(category,title,description,price,actions);card.append(art,body);return card;
  }));
  const missing=favoritePageIds.filter(id=>!favoriteProducts.some(item=>item.id===id));
  if(favoriteCatalogAvailable&&missing.length){favoritePageIds=favoritePageIds.filter(id=>!missing.includes(id));persistFavoriteIds();if(favoriteCloudReady&&signedInUser)favoriteClient.from('customer_favorites').delete().eq('user_id',signedInUser.id).in('product_id',missing).then(()=>{});}
  const empty=favoritePageIds.length===0;favoriteItems.hidden=empty||!favoriteCatalogAvailable;favoriteEmpty.hidden=!empty||!favoriteCatalogAvailable;updateCount();
  if(!favoriteCatalogAvailable){favoritesStatus.textContent='Ürün bilgileri şu an yüklenemedi. Bağlantını kontrol edip sayfayı yenile.';}else favoritesStatus.textContent='';
}
function makeProductIcon(){const icon=document.createElement('i');icon.className='fa-solid fa-microchip';icon.setAttribute('aria-hidden','true');return icon;}
function normalizeProducts(rows){return (rows||[]).map(row=>({id:row.id,slug:row.slug,categoryId:row.category_id||row.categoryId,name:row.name,description:row.description,brand:row.brand,model:row.model,image:row.image_path||row.image,price:row.price===null||row.price===undefined?null:Number(row.price),currency:row.currency||'TRY',attributes:row.attributes||{},status:row.status})).filter(row=>row.status==='active');}
async function loadProducts(){
  let liveProducts=null;
  if(favoriteClient){
    try{const {data,error}=await favoriteClient.from('catalog_products').select('id,slug,category_id,name,description,brand,model,image_path,price,currency,status,attributes').eq('status','active').order('sort_order');if(!error&&data)liveProducts=normalizeProducts(data);}catch{}
  }
  let localProducts=[];
  try{const response=await fetch('assets/data/builder-products.json',{cache:'no-store'});if(response.ok){const data=await response.json();localProducts=normalizeProducts(data.products||[]);}}catch{}
  if(!localProducts.length){try{const response=await fetch('assets/data/catalog.json',{cache:'no-store'});if(response.ok){const data=await response.json();localProducts=normalizeProducts(data.products||[]);}}catch{}}
  if(liveProducts){const liveSlugs=new Set(liveProducts.map(product=>product.slug).filter(Boolean));return [...liveProducts,...localProducts.filter(product=>!product.slug||!liveSlugs.has(product.slug))];}
  return localProducts.length?localProducts:null;
}
async function loadForUser(user){
  signedInUser=user||null;favoriteCloudReady=false;
  if(!user){activeFavoriteStorageKey=favoriteStorageKey;favoritePageIds=readFavoriteIds(favoriteStorageKey);favoriteSyncNote.hidden=true;return;}
  activeFavoriteStorageKey=`${favoriteStorageKey}-user-${user.id}`;
  const hasAccountList=localStorage.getItem(activeFavoriteStorageKey)!==null;
  const accountIds=readFavoriteIds(activeFavoriteStorageKey);
  const guestIds=readFavoriteIds(favoriteStorageKey);
  try{
    const {data,error}=await favoriteClient.from('customer_favorites').select('product_id').order('created_at');if(error)throw error;
    const remoteIds=(data||[]).map(row=>row.product_id);
    favoritePageIds=[...new Set([...remoteIds,...accountIds])];
    const owner=localStorage.getItem('tezcan-product-favorites-guest-owner');
    if((!owner||owner===user.id)&&!hasAccountList){favoritePageIds=[...new Set([...favoritePageIds,...guestIds])];if(guestIds.length)localStorage.setItem('tezcan-product-favorites-guest-owner',user.id);}
    favoriteSyncNote.hidden=true;favoriteCloudReady=true;persistFavoriteIds();
    const missingRemote=favoritePageIds.filter(id=>!remoteIds.includes(id));
    if(missingRemote.length){const {error:saveError}=await favoriteClient.from('customer_favorites').upsert(missingRemote.map(product_id=>({user_id:user.id,product_id})),{onConflict:'user_id,product_id',ignoreDuplicates:true});if(saveError)favoriteCloudReady=false;}
  }catch{
    const owner=localStorage.getItem('tezcan-product-favorites-guest-owner');
    favoritePageIds=hasAccountList?accountIds:(!owner||owner===user.id?guestIds:[]);
    favoriteSyncNote.hidden=false;favoriteSyncNote.textContent='Favoriler bu cihazda korunuyor. Hesaplar arası eşitleme için favori veritabanı güncellemesi uygulanmalı.';
  }
}
async function startFavoritesPage(){
  document.getElementById('currentYear').textContent=new Date().getFullYear();
  if(favoriteClient){
    try{const {data}=await favoriteClient.auth.getSession();await loadForUser(data?.session?.user||null);}
    catch{await loadForUser(null);favoriteSyncNote.hidden=false;favoriteSyncNote.textContent='Favorilerin bu cihazdan gösteriliyor. Hesap eşitlemesi için bağlantıyı kontrol et.';}
    favoriteClient.auth.onAuthStateChange((_event,session)=>setTimeout(()=>loadForUser(session?.user||null).then(renderFavoriteItems),0));
  }else{favoritePageIds=readFavoriteIds(favoriteStorageKey);renderFavoriteItems();}
  const products=await loadProducts();favoriteCatalogAvailable=Array.isArray(products);favoriteProducts=products||[];renderFavoriteItems();
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-remove-favorite]');if(!button)return;
  const id=button.dataset.removeFavorite;favoritePageIds=favoritePageIds.filter(value=>value!==id);persistFavoriteIds();renderFavoriteItems();favoritesStatus.textContent='Ürün favorilerinden çıkarıldı.';
  if(favoriteCloudReady&&signedInUser){const {error}=await favoriteClient.from('customer_favorites').delete().eq('user_id',signedInUser.id).eq('product_id',id);if(error){favoriteCloudReady=false;favoriteSyncNote.hidden=false;favoriteSyncNote.textContent='Ürün bu cihazda favorilerinden çıkarıldı. Hesap eşitlemesi için veritabanı güncellemesi gerekiyor.';}}
});
window.addEventListener('storage',event=>{if(event.key===activeFavoriteStorageKey){favoritePageIds=readFavoriteIds(activeFavoriteStorageKey);renderFavoriteItems();}});
startFavoritesPage();
