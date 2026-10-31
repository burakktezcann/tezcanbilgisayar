const config=window.SUPABASE_CONFIG||{};
const setupNotice=document.getElementById('setupNotice');
const loginPanel=document.getElementById('loginPanel');
const loginForm=document.getElementById('loginForm');
const loginMessage=document.getElementById('loginMessage');
const accessDenied=document.getElementById('accessDenied');
const adminApp=document.getElementById('adminApp');
const adminMessage=document.getElementById('adminMessage');
const productForm=document.getElementById('productForm');
const categoryForm=document.getElementById('categoryForm');
const productRows=document.getElementById('productRows');
const categoryRows=document.getElementById('categoryRows');
const productCategory=document.getElementById('productCategory');
let client=null;
let categories=[];
let products=[];

function message(target,text,kind=''){
  target.textContent=text;
  target.dataset.kind=kind;
}
function slugify(value){
  return String(value||'').toLocaleLowerCase('tr-TR').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function splitTerms(value){return value.split(',').map(term=>term.trim()).filter(Boolean);}
function formatPrice(price,currency='TRY'){
  if(price===null||price===undefined)return '—';
  return new Intl.NumberFormat('tr-TR',{style:'currency',currency}).format(Number(price));
}
function setBusy(form,busy){form.querySelectorAll('button[type="submit"]').forEach(button=>button.disabled=busy);}
function showLogin(){loginPanel.hidden=false;accessDenied.hidden=true;adminApp.hidden=true;}
function showDenied(){loginPanel.hidden=true;accessDenied.hidden=false;adminApp.hidden=true;}
function showAdmin(user){
  if(user?.app_metadata?.catalog_role!=='admin'){
    showDenied();
    return;
  }
  loginPanel.hidden=true;
  accessDenied.hidden=true;
  adminApp.hidden=false;
  document.getElementById('adminIdentity').textContent=user.email||'Yönetici';
  loadCatalogData();
}
async function restoreSession(){
  if(!client)return;
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user){showLogin();return;}
  showAdmin(user);
}
function renderCategoryOptions(selectedId=''){
  productCategory.replaceChildren();
  categories.forEach(category=>{
    const option=document.createElement('option');
    option.value=category.id;
    option.textContent=category.name+(category.is_active?'':' (gizli)');
    option.selected=category.id===selectedId;
    productCategory.append(option);
  });
}
function renderCategories(){
  categoryRows.replaceChildren();
  document.getElementById('categoryCount').textContent=`${categories.length} kategori`;
  renderCategoryOptions(productCategory.value);
  categories.forEach(category=>{
    const row=document.createElement('article');row.className='category-row';
    const details=document.createElement('div');
    const name=document.createElement('strong');name.textContent=category.name;
    const meta=document.createElement('small');meta.textContent=`${category.id} · ${category.is_active?'Sitede açık':'Gizli'}`;
    details.append(name,meta);
    const actions=document.createElement('div');actions.className='category-row-actions';
    const edit=document.createElement('button');edit.type='button';edit.textContent='Düzenle';edit.dataset.editCategory=category.id;
    const toggle=document.createElement('button');toggle.type='button';toggle.textContent=category.is_active?'Gizle':'Yayınla';toggle.dataset.toggleCategory=category.id;
    actions.append(edit,toggle);row.append(details,actions);categoryRows.append(row);
  });
}
function renderProducts(){
  productRows.replaceChildren();
  document.getElementById('productCount').textContent=`${products.length} ürün`;
  document.getElementById('emptyProducts').hidden=products.length>0;
  products.forEach(product=>{
    const row=document.createElement('tr');
    const productCell=document.createElement('td');
    const title=document.createElement('strong');title.textContent=product.name;
    const detail=document.createElement('small');detail.textContent=[product.brand,product.model,product.sku].filter(Boolean).join(' · ')||product.slug;
    productCell.append(title,detail);
    const categoryCell=document.createElement('td');categoryCell.textContent=categories.find(category=>category.id===product.category_id)?.name||product.category_id;
    const priceCell=document.createElement('td');priceCell.textContent=formatPrice(product.price,product.currency);
    const stockCell=document.createElement('td');stockCell.textContent=product.stock===null?'—':String(product.stock);
    const statusCell=document.createElement('td');
    const pill=document.createElement('span');pill.className='status-pill'+(product.status==='active'?' active':'');pill.textContent=product.status==='active'?'Yayında':'Taslak';statusCell.append(pill);
    const actionCell=document.createElement('td');
    const actions=document.createElement('div');actions.className='row-actions';
    const edit=document.createElement('button');edit.type='button';edit.textContent='Düzenle';edit.dataset.editProduct=product.id;
    const remove=document.createElement('button');remove.type='button';remove.className='delete-button';remove.textContent='Sil';remove.dataset.deleteProduct=product.id;
    actions.append(edit,remove);actionCell.append(actions);
    row.append(productCell,categoryCell,priceCell,stockCell,statusCell,actionCell);productRows.append(row);
  });
}
async function loadCatalogData(){
  message(adminMessage,'Katalog yükleniyor…');
  const [{data:categoryRowsData,error:categoryError},{data:productRowsData,error:productError}]=await Promise.all([
    client.from('catalog_categories').select('id,name,description,icon,tone,sort_order,search_terms,is_active').order('sort_order'),
    client.from('catalog_products').select('id,slug,category_id,name,description,brand,model,sku,image_path,price,currency,stock,status,sort_order,search_terms').order('sort_order')
  ]);
  if(categoryError||productError){message(adminMessage,'Katalog tabloları okunamadı. Migration ve yetki rolünü kontrol et.','error');return;}
  categories=categoryRowsData||[];products=productRowsData||[];
  renderCategories();renderProducts();message(adminMessage,'Katalog güncel.');
}
function resetProductForm(){
  productForm.reset();
  document.getElementById('productId').value='';
  document.getElementById('productFormTitle').textContent='Ürün ekle';
  document.getElementById('saveProduct').textContent='Ürünü kaydet';
  document.getElementById('productStatus').value='draft';
  document.getElementById('productSortOrder').value='0';
  renderCategoryOptions(categories.find(category=>category.is_active)?.id||'');
}
function resetCategoryForm(){
  categoryForm.reset();
  document.getElementById('categoryOriginalId').value='';
  document.getElementById('categoryId').readOnly=false;
  document.getElementById('categoryFormTitle').textContent='Kategori ekle';
  document.getElementById('saveCategory').textContent='Kategoriyi kaydet';
  document.getElementById('categoryIcon').value='fa-box';
  document.getElementById('categoryTone').value='blue';
  document.getElementById('categorySortOrder').value=String(categories.length+1);
  document.getElementById('categoryActive').checked=true;
}
function editProduct(id){
  const product=products.find(item=>item.id===id);if(!product)return;
  document.getElementById('productId').value=product.id;
  document.getElementById('productName').value=product.name;
  document.getElementById('productSlug').value=product.slug;
  document.getElementById('productBrand').value=product.brand||'';
  document.getElementById('productModel').value=product.model||'';
  document.getElementById('productSku').value=product.sku||'';
  document.getElementById('productDescription').value=product.description||'';
  document.getElementById('productPrice').value=product.price??'';
  document.getElementById('productStock').value=product.stock??'';
  document.getElementById('productImage').value=product.image_path||'';
  document.getElementById('productSortOrder').value=String(product.sort_order||0);
  document.getElementById('productSearchTerms').value=(product.search_terms||[]).join(', ');
  document.getElementById('productStatus').value=product.status;
  renderCategoryOptions(product.category_id);
  document.getElementById('productFormTitle').textContent='Ürünü düzenle';
  document.getElementById('saveProduct').textContent='Değişiklikleri kaydet';
  productForm.scrollIntoView({behavior:'smooth',block:'start'});
}
function editCategory(id){
  const category=categories.find(item=>item.id===id);if(!category)return;
  document.getElementById('categoryOriginalId').value=category.id;
  document.getElementById('categoryId').value=category.id;
  document.getElementById('categoryId').readOnly=true;
  document.getElementById('categoryName').value=category.name;
  document.getElementById('categoryDescription').value=category.description||'';
  document.getElementById('categoryIcon').value=category.icon;
  document.getElementById('categoryTone').value=category.tone;
  document.getElementById('categorySortOrder').value=String(category.sort_order||0);
  document.getElementById('categorySearchTerms').value=(category.search_terms||[]).join(', ');
  document.getElementById('categoryActive').checked=category.is_active;
  document.getElementById('categoryFormTitle').textContent='Kategoriyi düzenle';
  document.getElementById('saveCategory').textContent='Değişiklikleri kaydet';
  categoryForm.scrollIntoView({behavior:'smooth',block:'start'});
}
loginForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!client){message(loginMessage,'Bağlantı kurulamadı. Sayfayı yenileyip tekrar dene.','error');return;}
  const button=loginForm.querySelector('button[type="submit"]');button.disabled=true;
  message(loginMessage,'Giriş yapılıyor…');
  const form=new FormData(loginForm);
  try{
    const {data,error}=await client.auth.signInWithPassword({email:String(form.get('email')||'').trim(),password:String(form.get('password')||'')});
    if(error){message(loginMessage,'Giriş başarısız. E-posta ve şifreni kontrol et.','error');return;}
    loginForm.reset();showAdmin(data.user||data.session?.user);
  }catch{
    message(loginMessage,'Bağlantı kurulamadı. Biraz sonra tekrar dene.','error');
  }finally{button.disabled=false;}
});document.getElementById('signOut').addEventListener('click',async()=>{await client.auth.signOut();showLogin();});
document.getElementById('deniedSignOut').addEventListener('click',async()=>{await client.auth.signOut();showLogin();});
document.getElementById('resetProductForm').addEventListener('click',resetProductForm);
document.getElementById('resetCategoryForm').addEventListener('click',resetCategoryForm);
document.getElementById('productName').addEventListener('input',()=>{
  if(!document.getElementById('productId').value||!document.getElementById('productSlug').dataset.touched){
    document.getElementById('productSlug').value=slugify(document.getElementById('productName').value);
  }
});
document.getElementById('productSlug').addEventListener('input',event=>{event.currentTarget.dataset.touched='true';});
document.getElementById('categoryName').addEventListener('input',()=>{
  if(!document.getElementById('categoryOriginalId').value)document.getElementById('categoryId').value=slugify(document.getElementById('categoryName').value);
});
productForm.addEventListener('submit',async event=>{
  event.preventDefault();setBusy(productForm,true);message(adminMessage,'Ürün kaydediliyor…');
  const productId=document.getElementById('productId').value;
  const priceValue=document.getElementById('productPrice').value.trim();
  const stockValue=document.getElementById('productStock').value.trim();
  const values={
    slug:slugify(document.getElementById('productSlug').value),
    category_id:productCategory.value,
    name:document.getElementById('productName').value.trim(),
    description:document.getElementById('productDescription').value.trim(),
    brand:document.getElementById('productBrand').value.trim(),
    model:document.getElementById('productModel').value.trim(),
    sku:document.getElementById('productSku').value.trim(),
    image_path:document.getElementById('productImage').value.trim(),
    price:priceValue===''?null:Number(priceValue),
    currency:'TRY',
    stock:stockValue===''?null:Number(stockValue),
    status:document.getElementById('productStatus').value,
    sort_order:Number(document.getElementById('productSortOrder').value||0),
    search_terms:splitTerms(document.getElementById('productSearchTerms').value),
    updated_at:new Date().toISOString()
  };
  const result=productId?await client.from('catalog_products').update(values).eq('id',productId):await client.from('catalog_products').insert(values);
  setBusy(productForm,false);
  if(result.error){message(adminMessage,'Ürün kaydedilemedi. Yetkiyi, adres kısa adını ve alanları kontrol et.','error');return;}
  resetProductForm();await loadCatalogData();message(adminMessage,'Ürün kaydedildi.','success');
});
categoryForm.addEventListener('submit',async event=>{
  event.preventDefault();setBusy(categoryForm,true);message(adminMessage,'Kategori kaydediliyor…');
  const originalId=document.getElementById('categoryOriginalId').value;
  const id=originalId||slugify(document.getElementById('categoryId').value);
  const values={
    id,
    name:document.getElementById('categoryName').value.trim(),
    description:document.getElementById('categoryDescription').value.trim(),
    icon:document.getElementById('categoryIcon').value.trim(),
    tone:document.getElementById('categoryTone').value,
    sort_order:Number(document.getElementById('categorySortOrder').value||0),
    search_terms:splitTerms(document.getElementById('categorySearchTerms').value),
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

const csvColumns=['slug','category_id','name','description','brand','model','sku','image_path','price','currency','stock','status','sort_order','search_terms'];
function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const char=text[i];
    if(quoted){if(char==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(char==='"')quoted=false;else cell+=char;continue;}
    if(char==='"'&&cell===''){quoted=true;continue;}
    if(char===','){row.push(cell);cell='';continue;}
    if(char==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';continue;}
    cell+=char;
  }
  if(quoted)throw new Error('CSV dosyasında kapanmamış tırnak var.');
  if(cell.length||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}
  return rows.filter(values=>values.some(value=>value.trim()!==''));
}
function csvEscape(value){const text=Array.isArray(value)?value.join('|'):value??'';return '"'+String(text).replace(/"/g,'""')+'"';}
function downloadCatalogCsv(){
  const lines=[csvColumns.map(csvEscape).join(',')];
  products.forEach(product=>lines.push(csvColumns.map(column=>csvEscape(column==='search_terms'?(product.search_terms||[]).join('|'):product[column])).join(',')));
  const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='tezcan-bilgisayar-katalog.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function validateCatalogCsv(text){
  const rows=parseCsv(text);if(rows.length<2)throw new Error('Dosyada başlık satırı ve en az bir ürün bulunmalı.');
  const headers=rows.shift().map(value=>value.trim().replace(/^\ufeff/,''));
  const missing=csvColumns.filter(column=>!headers.includes(column));
  if(missing.length)throw new Error(`Eksik sütunlar: ${missing.join(', ')}.`);
  const existing=new Set(products.map(product=>product.slug));const seen=new Set();const parsed=[];
  rows.forEach((values,index)=>{
    const rowNumber=index+2;const record=Object.fromEntries(headers.map((header,column)=>[header,(values[column]||'').trim()]));
    const slug=slugify(record.slug);const categoryId=record.category_id;
    if(!slug)throw new Error(`${rowNumber}. satır: kısa ad boş.`);
    if(seen.has(slug))throw new Error(`${rowNumber}. satır: ${slug} dosyada birden fazla kez geçiyor.`);seen.add(slug);
    if(!record.name)throw new Error(`${rowNumber}. satır: ürün adı boş.`);
    if(!categories.some(category=>category.id===categoryId))throw new Error(`${rowNumber}. satır: '${categoryId}' kategorisi bulunamadı.`);
    if(record.status&&!['active','draft'].includes(record.status))throw new Error(`${rowNumber}. satır: durum active veya draft olmalı.`);
    if(record.image_path&&!/^assets\/products\/[A-Za-z0-9._/-]+$/.test(record.image_path))throw new Error(`${rowNumber}. satır: görsel yolu geçersiz.`);
    if(record.currency&&!/^[A-Za-z]{3}$/.test(record.currency))throw new Error(`${rowNumber}. satır: para birimi üç harfli kod olmalı (ör. TRY).`);
    const price=record.price===''?null:Number(record.price);const stock=record.stock===''?null:Number(record.stock);const sortOrder=record.sort_order===''?0:Number(record.sort_order);
    if(price!==null&&(!Number.isFinite(price)||price<0))throw new Error(`${rowNumber}. satır: fiyat sıfır veya daha büyük bir sayı olmalı.`);
    if(stock!==null&&(!Number.isInteger(stock)||stock<0))throw new Error(`${rowNumber}. satır: stok sıfır veya daha büyük tam sayı olmalı.`);
    if(!Number.isInteger(sortOrder)||sortOrder<0)throw new Error(`${rowNumber}. satır: sıralama sıfır veya daha büyük tam sayı olmalı.`);
    parsed.push({slug,category_id:categoryId,name:record.name,description:record.description||'',brand:record.brand||'',model:record.model||'',sku:record.sku||'',image_path:record.image_path||'',price,currency:(record.currency||'TRY').toUpperCase(),stock,status:record.status||'draft',sort_order:sortOrder,search_terms:(record.search_terms||'').split('|').map(term=>term.trim()).filter(Boolean),updated_at:new Date().toISOString()});
  });
  return {parsed,updates:parsed.filter(product=>existing.has(product.slug)).length,creates:parsed.filter(product=>!existing.has(product.slug)).length};
}
const exportProductsButton=document.getElementById('exportProducts');
if(exportProductsButton)exportProductsButton.addEventListener('click',downloadCatalogCsv);
const importProductsFile=document.getElementById('importProductsFile');
if(importProductsFile)importProductsFile.addEventListener('change',async event=>{
  const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(!file)return;
  const target=document.getElementById('importMessage');message(target,'CSV dosyası inceleniyor…');
  try{
    const {parsed,updates,creates}=validateCatalogCsv(await file.text());
    const summary=`${creates} yeni ürün, ${updates} mevcut ürün güncellenecek. Toplam ${parsed.length} satır.`;
    if(!window.confirm(`${summary}\n\nAynı kısa ada sahip ürünlerin bilgileri güncellenir. Devam edilsin mi?`)){message(target,'Aktarım iptal edildi.');return;}
    const {error}=await client.from('catalog_products').upsert(parsed,{onConflict:'slug'});
    if(error){message(target,'Ürünler aktarılamadı. Kategori izinlerini ve CSV değerlerini kontrol et.','error');return;}
    await loadCatalogData();message(target,`${parsed.length} ürün aktarıldı: ${creates} yeni, ${updates} güncellendi.`,'success');
  }catch(error){message(target,error instanceof Error?error.message:'CSV dosyası okunamadı.','error');}
});

if(!config.url||!config.publishableKey||!window.supabase?.createClient){
  setupNotice.hidden=false;loginPanel.hidden=true;
}else{
  client=window.supabase.createClient(config.url,config.publishableKey);
  restoreSession();
}


