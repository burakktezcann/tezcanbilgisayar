-- Add the remaining product groups used by the public category picker.
insert into public.catalog_categories (id, name, description, icon, tone, sort_order, search_terms)
values
  ('systems', 'Hazır Sistemler', 'Oyuncu ve günlük kullanım için hazırlanacak masaüstü sistemler.', 'fa-computer', 'orange', 8, array['oem', 'oyuncu', 'gaming']),
  ('computers', 'Bilgisayarlar', 'Dizüstü, masaüstü ve kompakt bilgisayar grupları.', 'fa-laptop', 'blue', 9, array['notebook', 'laptop', 'masaüstü', 'tablet']),
  ('peripherals', 'Çevre Birimleri', 'Monitör, klavye, fare ve ses ekipmanları.', 'fa-keyboard', 'purple', 10, array['monitör', 'klavye', 'mouse', 'kulaklık']),
  ('gaming', 'Oyun ve Hobi', 'Konsol ve oyun ekipmanı grupları.', 'fa-gamepad', 'orange', 11, array['konsol', 'gamepad', 'oyuncu']),
  ('networking', 'Ağ Ürünleri', 'Modem, router ve ağ bağlantı ürünleri.', 'fa-wifi', 'green', 12, array['network', 'modem', 'router']),
  ('office', 'Ofis Ürünleri', 'Yazıcı, projeksiyon ve ofis sarf malzemeleri.', 'fa-print', 'purple', 13, array['yazıcı', 'kartuş', 'toner']),
  ('accessories', 'Aksesuarlar', 'Kablo, adaptör ve tamamlayıcı ürün grupları.', 'fa-plug', 'orange', 14, array['kablo', 'adaptör', 'çanta']),
  ('software', 'Yazılım', 'İşletim sistemi, ofis ve güvenlik yazılımları.', 'fa-shield-halved', 'blue', 15, array['windows', 'office', 'güvenlik'])
on conflict (id) do nothing;
