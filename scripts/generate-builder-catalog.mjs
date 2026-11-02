import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile('assets/js/pages/system-builder-page.js', 'utf8');
const definitions = source.split("const storageKey = 'tezcan-system-builder-cpu-v1';")[0];
const data = JSON.parse(runInNewContext(`${definitions}\nJSON.stringify({processorFamilies,motherboardsBySocket,ramKitsByType,graphicsCards,storageProducts,pcCases,cpuCoolers,powerSupplies})`));
const namespace = Buffer.from('6ba7b8119dad11d180b400c04fd430c8', 'hex');

function stableId(slug) {
  const digest = createHash('sha1').update(Buffer.concat([namespace, Buffer.from(`tezcanbilgisayar:${slug}`)])).digest();
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.subarray(0, 16).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const products = [];
function add(categoryId, sourceId, name, brand, model, description, attributes = {}, sku = '') {
  const slug = `build-${categoryId}-${sourceId}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  products.push({
    id: stableId(slug), slug, categoryId, name, description, brand: brand || '', model: model || '', sku,
    image: '', price: null, currency: 'TRY', stock: null, status: 'active', sortOrder: products.length + 1, isBestseller: false, isCampaign: false,
    searchTerms: [...new Set([brand, model, categoryId, 'sistem toplama', 'bileşen'].filter(Boolean))], attributes: Object.fromEntries(Object.entries(attributes).filter(([, value]) => value !== null && value !== undefined))
  });
}

for (const [brandKey, families] of Object.entries(data.processorFamilies)) {
  const brand = brandKey === 'intel' ? 'Intel' : 'AMD';
  for (const family of families) for (const model of family.models) {
    const name = brandKey === 'intel' ? family.id.startsWith('ultra') ? `Intel ${family.name} ${model}` : `Intel Core ${model}` : `AMD ${family.name} ${model}`;
    add('cpu', `${brandKey}-${family.id}-${model}`, name, brand, model, `${family.note} · ${family.generation} · Üretici model adı`, { socket: family.socket, family: family.name });
  }
}
for (const boards of Object.values(data.motherboardsBySocket)) for (const board of boards) {
  const socket = Object.entries(data.motherboardsBySocket).find(([, rows]) => rows.some(row => row.id === board.id))?.[0] || '';
  add('motherboard', board.id, board.name, board.name.split(' ')[0], board.name, `${board.chipset} · ${socket} · ${board.memory} · ${board.form}`, { socket, chipset: board.chipset, memory_type: board.memory, form_factor: board.form });
}
for (const [memoryType, kits] of Object.entries(data.ramKitsByType)) for (const kit of kits) {
  add('ram', kit.id, kit.name, kit.name.startsWith('CORSAIR') ? 'CORSAIR' : 'Kingston', kit.code, kit.spec, { capacity_gb: kit.capacity, memory_type: memoryType, model_code: kit.code }, kit.code);
}
for (const [brand, cards] of Object.entries(data.graphicsCards)) for (const card of cards) {
  add('gpu', card.id, card.name, brand, card.name.replace(`${brand} `, ''), `${card.series} · referans güç önerisi ${card.psuMin} W. Kart üreticisine göre soğutucu ve boyut değişebilir.`, { gpu_chip: card.name, series: card.series, recommended_psu_w: card.psuMin });
}
for (const productsByType of Object.values(data.storageProducts)) for (const product of productsByType) {
  const driveType = product.spec.includes('NVMe') ? 'NVMe SSD' : product.spec.includes('SATA') && product.spec.includes('SSD') ? 'SATA SSD' : 'Sabit disk (HDD)';
  const capacityGb = Number.parseFloat(product.capacity) * 1000;
  const brand = product.name.split(' ')[0];
  add('disk', product.id, product.name, brand, product.code, product.spec, { drive_type: driveType, capacity_gb: capacityGb, interface: driveType === 'NVMe SSD' ? 'M.2 NVMe' : 'SATA III', model_code: product.code }, product.code);
}
for (const item of data.pcCases) add('case', item.id, item.name, item.name.split(' ')[0], item.name, item.note, { form_factor: item.name.includes('Q300L') ? 'Mini Tower' : 'Mid Tower', board_support: item.supports.join(', '), gpu_clearance_mm: item.gpu, cpu_cooler_clearance_mm: item.cooler, psu_clearance_mm: item.psu });
for (const item of data.cpuCoolers) add('cooling', item.id, item.name, item.name.split(' ')[0], item.name, `${item.type} · ${item.spec} · desteklenen soketler: ${item.sockets.join(', ')}`, { cooler_type: item.type, height_mm: item.height || null, radiator_mm: item.radiator || null, socket_support: item.sockets.join(', ') });
for (const item of data.powerSupplies) add('psu', item.id, item.name, item.name.split(' ')[0], item.name, `${item.watts} W · ${item.spec} · uzunluk ${item.length} mm`, { power_w: item.watts, efficiency: '80+ Gold', length_mm: item.length }, item.id.toUpperCase());

const category = { id: 'cooling', name: 'İşlemci Soğutucuları', description: 'Hava ve sıvı işlemci soğutucuları.', icon: 'fa-fan', tone: 'blue', sortOrder: 16, searchTerms: ['cpu cooler', 'işlemci soğutucu', 'sıvı soğutma', 'hava soğutma'] };
await writeFile('assets/data/builder-products.json', `${JSON.stringify({ schemaVersion: 1, category, products }, null, 2)}\n`);

const sqlText = value => `'${String(value ?? '').replaceAll("'", "''")}'`;
const sqlArray = values => `array[${values.map(sqlText).join(', ')}]::text[]`;
const categoryInsert = `insert into public.catalog_categories (id, name, description, icon, tone, sort_order, search_terms) values (${sqlText(category.id)}, ${sqlText(category.name)}, ${sqlText(category.description)}, ${sqlText(category.icon)}, ${sqlText(category.tone)}, ${category.sortOrder}, ${sqlArray(category.searchTerms)}) on conflict (id) do nothing;`;
const productInsert = `insert into public.catalog_products (id, slug, category_id, name, description, brand, model, sku, image_path, price, currency, stock, status, sort_order, search_terms, attributes) values\n${products.map(product => `  (${sqlText(product.id)}::uuid, ${sqlText(product.slug)}, ${sqlText(product.categoryId)}, ${sqlText(product.name)}, ${sqlText(product.description)}, ${sqlText(product.brand)}, ${sqlText(product.model)}, ${sqlText(product.sku)}, '', null, 'TRY', null, 'active', ${product.sortOrder}, ${sqlArray(product.searchTerms)}, ${sqlText(JSON.stringify(product.attributes))}::jsonb)`).join(',\n')}\non conflict (slug) do nothing;`;
const migration = `-- Seed the real model names already offered by the system builder into the public catalog.\n-- Run after 20261031000100_product_catalog.sql. IDs/slugs are stable and safe to rerun.\n${categoryInsert}\n\n${productInsert}\n`;
await writeFile('supabase/migrations/20261102000400_seed_builder_catalog_products.sql', migration);
console.log(`Generated ${products.length} component products.`);
