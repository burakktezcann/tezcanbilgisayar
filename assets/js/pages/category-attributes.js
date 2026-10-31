/* Category-specific product fields. Add or refine a category here without changing the database schema. */
window.PRODUCT_ATTRIBUTE_DEFINITIONS = {
  cpu: { title: 'İşlemci özellikleri', fields: [
    { key: 'socket', label: 'Soket', type: 'select', required: true, options: ['AM4', 'AM5', 'LGA 1700', 'LGA 1851', 'Diğer'] },
    { key: 'cores', label: 'Çekirdek sayısı', type: 'number', min: 1, step: 1 },
    { key: 'threads', label: 'İş parçacığı', type: 'number', min: 1, step: 1 },
    { key: 'boost_ghz', label: 'En yüksek frekans', type: 'number', unit: 'GHz', min: 0, step: 0.1 },
    { key: 'tdp_w', label: 'TDP', type: 'number', unit: 'W', min: 0, step: 1 }
  ] },
  motherboard: { title: 'Anakart özellikleri', fields: [
    { key: 'socket', label: 'İşlemci soketi', type: 'select', options: ['AM4', 'AM5', 'LGA 1700', 'LGA 1851', 'Diğer'] },
    { key: 'chipset', label: 'Yonga seti', type: 'text' },
    { key: 'form_factor', label: 'Anakart boyutu', type: 'select', options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX', 'Diğer'] },
    { key: 'memory_type', label: 'Bellek türü', type: 'select', options: ['DDR4', 'DDR5'] },
    { key: 'memory_slots', label: 'Bellek yuvası', type: 'number', min: 1, step: 1 },
    { key: 'm2_slots', label: 'M.2 yuvası', type: 'number', min: 0, step: 1 }
  ] },
  ram: { title: 'RAM özellikleri', fields: [
    { key: 'capacity_gb', label: 'Toplam kapasite', type: 'number', unit: 'GB', required: true, min: 1, step: 1 },
    { key: 'memory_type', label: 'Bellek nesli', type: 'select', required: true, options: ['DDR3', 'DDR4', 'DDR5'] },
    { key: 'speed_mts', label: 'Bellek hızı', type: 'number', unit: 'MT/s', min: 1, step: 1 },
    { key: 'module_count', label: 'Modül sayısı', type: 'number', unit: 'adet', min: 1, step: 1 },
    { key: 'form_factor', label: 'Form faktörü', type: 'select', options: ['DIMM (Masaüstü)', 'SO-DIMM (Dizüstü)'] },
    { key: 'cas_latency', label: 'Gecikme (CL)', type: 'text', placeholder: 'Örn. CL36' }
  ] },
  gpu: { title: 'Ekran kartı özellikleri', fields: [
    { key: 'gpu_chip', label: 'Grafik işlemci', type: 'text', required: true, placeholder: 'Örn. GeForce RTX 5070' },
    { key: 'memory_gb', label: 'Bellek kapasitesi', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'memory_type', label: 'Bellek türü', type: 'select', options: ['GDDR6', 'GDDR6X', 'GDDR7', 'Diğer'] },
    { key: 'length_mm', label: 'Kart uzunluğu', type: 'number', unit: 'mm', min: 1, step: 1 },
    { key: 'tdp_w', label: 'Güç tüketimi', type: 'number', unit: 'W', min: 1, step: 1 }
  ] },
  disk: { title: 'Depolama özellikleri', fields: [
    { key: 'drive_type', label: 'Depolama türü', type: 'select', required: true, options: ['NVMe SSD', 'SATA SSD', 'Sabit disk (HDD)', 'Harici disk', 'USB bellek', 'Diğer'] },
    { key: 'capacity_gb', label: 'Kapasite', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'interface', label: 'Bağlantı', type: 'select', options: ['M.2 NVMe', 'SATA III', 'USB', 'Diğer'] },
    { key: 'read_speed_mbs', label: 'Okuma hızı', type: 'number', unit: 'MB/s', min: 1, step: 1 }
  ] },
  case: { title: 'Kasa özellikleri', fields: [
    { key: 'form_factor', label: 'Kasa boyutu', type: 'select', options: ['Mid Tower', 'Full Tower', 'Mini Tower', 'Mini-ITX', 'Diğer'] },
    { key: 'board_support', label: 'Anakart desteği', type: 'text', placeholder: 'Örn. ATX, Micro-ATX' },
    { key: 'gpu_clearance_mm', label: 'Maksimum ekran kartı uzunluğu', type: 'number', unit: 'mm', min: 1, step: 1 },
    { key: 'fan_count', label: 'Dahil fan sayısı', type: 'number', unit: 'adet', min: 0, step: 1 }
  ] },
  psu: { title: 'Güç kaynağı özellikleri', fields: [
    { key: 'power_w', label: 'Güç', type: 'number', unit: 'W', required: true, min: 1, step: 1 },
    { key: 'efficiency', label: 'Verimlilik sertifikası', type: 'select', options: ['80+ White', '80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium'] },
    { key: 'modular', label: 'Kablo yapısı', type: 'select', options: ['Modüler', 'Yarı modüler', 'Sabit kablo'] },
    { key: 'form_factor', label: 'Güç kaynağı boyutu', type: 'select', options: ['ATX', 'SFX', 'SFX-L', 'Diğer'] }
  ] },
  systems: { title: 'Hazır sistem özellikleri', fields: [
    { key: 'processor', label: 'İşlemci', type: 'text' },
    { key: 'graphics', label: 'Ekran kartı', type: 'text' },
    { key: 'memory_gb', label: 'Bellek', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'storage_gb', label: 'Depolama', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'operating_system', label: 'İşletim sistemi', type: 'text' }
  ] },
  computers: { title: 'Bilgisayar özellikleri', fields: [
    { key: 'device_type', label: 'Bilgisayar türü', type: 'select', options: ['Dizüstü', 'Masaüstü', 'Mini bilgisayar', 'Tablet', 'Diğer'] },
    { key: 'processor', label: 'İşlemci', type: 'text' },
    { key: 'memory_gb', label: 'Bellek', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'storage_gb', label: 'Depolama', type: 'number', unit: 'GB', min: 1, step: 1 },
    { key: 'screen_size_in', label: 'Ekran boyutu', type: 'number', unit: 'inç', min: 1, step: 0.1 }
  ] },
  peripherals: { title: 'Çevre birimi özellikleri', fields: [
    { key: 'device_type', label: 'Ürün türü', type: 'select', options: ['Monitör', 'Klavye', 'Fare', 'Kulaklık', 'Hoparlör', 'Web kamera', 'Diğer'] },
    { key: 'connection', label: 'Bağlantı', type: 'select', options: ['Kablolu USB', 'Kablosuz 2.4 GHz', 'Bluetooth', '3.5 mm ses', 'Diğer'] },
    { key: 'screen_size_in', label: 'Ekran boyutu', type: 'number', unit: 'inç', min: 1, step: 0.1 },
    { key: 'refresh_rate_hz', label: 'Yenileme hızı', type: 'number', unit: 'Hz', min: 1, step: 1 },
    { key: 'resolution', label: 'Çözünürlük', type: 'text', placeholder: 'Örn. 1920 × 1080' }
  ] },
  gaming: { title: 'Oyun ve hobi özellikleri', fields: [
    { key: 'device_type', label: 'Ürün türü', type: 'select', options: ['Oyun konsolu', 'Oyun kolu', 'Kulaklık', 'Direksiyon seti', 'Diğer'] },
    { key: 'platform', label: 'Uyumlu platform', type: 'text', placeholder: 'Örn. PC, PlayStation 5' },
    { key: 'connection', label: 'Bağlantı', type: 'select', options: ['Kablolu', 'Kablosuz', 'Bluetooth', 'Diğer'] }
  ] },
  networking: { title: 'Ağ ürünü özellikleri', fields: [
    { key: 'device_type', label: 'Ürün türü', type: 'select', options: ['Modem', 'Router', 'Mesh sistemi', 'Switch', 'Access point', 'Diğer'] },
    { key: 'wifi_standard', label: 'Wi-Fi standardı', type: 'select', options: ['Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7', 'Wi-Fi yok'] },
    { key: 'speed_mbps', label: 'Ağ hızı', type: 'number', unit: 'Mbps', min: 1, step: 1 },
    { key: 'port_count', label: 'Ethernet portu', type: 'number', unit: 'adet', min: 0, step: 1 }
  ] },
  office: { title: 'Ofis ürünü özellikleri', fields: [
    { key: 'device_type', label: 'Ürün türü', type: 'select', options: ['Yazıcı', 'Tarayıcı', 'Projeksiyon', 'Kartuş', 'Toner', 'Diğer'] },
    { key: 'print_type', label: 'Baskı teknolojisi', type: 'select', options: ['Lazer', 'Mürekkep püskürtmeli', 'Termal', 'Baskı yok'] },
    { key: 'color_print', label: 'Renkli baskı', type: 'select', options: ['Renkli', 'Siyah-beyaz', 'Uygulanmaz'] },
    { key: 'connectivity', label: 'Bağlantı', type: 'text', placeholder: 'Örn. USB, Wi-Fi, Ethernet' }
  ] },
  accessories: { title: 'Aksesuar özellikleri', fields: [
    { key: 'device_type', label: 'Ürün türü', type: 'text', placeholder: 'Örn. USB-C hub' },
    { key: 'interface', label: 'Bağlantı / arayüz', type: 'text', placeholder: 'Örn. USB-C, HDMI 2.1' },
    { key: 'length_cm', label: 'Uzunluk', type: 'number', unit: 'cm', min: 0, step: 1 },
    { key: 'compatibility', label: 'Uyumluluk', type: 'text' }
  ] },
  software: { title: 'Yazılım özellikleri', fields: [
    { key: 'software_type', label: 'Yazılım türü', type: 'select', options: ['İşletim sistemi', 'Ofis yazılımı', 'Güvenlik', 'Diğer'] },
    { key: 'license_type', label: 'Lisans türü', type: 'select', options: ['Dijital lisans', 'Fiziksel kutu', 'Abonelik', 'Diğer'] },
    { key: 'duration_months', label: 'Lisans süresi', type: 'number', unit: 'ay', min: 1, step: 1 },
    { key: 'device_count', label: 'Cihaz sayısı', type: 'number', unit: 'cihaz', min: 1, step: 1 }
  ] }
};

window.PRODUCT_BRAND_SUGGESTIONS = {
  cpu: ['AMD', 'Intel'], motherboard: ['ASUS', 'Gigabyte', 'MSI', 'ASRock'],
  ram: ['Corsair', 'Kingston', 'Crucial', 'G.Skill', 'XPG', 'TeamGroup', 'Patriot'],
  gpu: ['ASUS', 'Gigabyte', 'MSI', 'ASRock', 'Sapphire', 'PowerColor', 'Zotac', 'Palit'],
  disk: ['Samsung', 'Kingston', 'WD', 'Western Digital', 'Seagate', 'Crucial', 'Lexar', 'Kioxia'],
  case: ['Corsair', 'NZXT', 'Cooler Master', 'DeepCool', 'Fractal Design', 'Thermaltake'],
  psu: ['Corsair', 'FSP', 'Seasonic', 'Cooler Master', 'DeepCool', 'MSI'],
  systems: ['Tezcan Bilgisayar', 'ASUS', 'MSI', 'HP', 'Lenovo'],
  computers: ['ASUS', 'Acer', 'HP', 'Lenovo', 'MSI', 'Dell', 'Apple'],
  peripherals: ['Logitech', 'Razer', 'SteelSeries', 'HyperX', 'ASUS', 'MSI', 'Samsung'],
  gaming: ['Sony', 'Microsoft', 'Nintendo', 'Logitech', 'Razer', 'Thrustmaster'],
  networking: ['TP-Link', 'ASUS', 'Mercusys', 'Zyxel', 'Ubiquiti', 'Keenetic'],
  office: ['HP', 'Canon', 'Epson', 'Brother', 'Xerox', 'Pantum'],
  accessories: ['UGREEN', 'Baseus', 'Anker', 'Belkin', 'Logitech'],
  software: ['Microsoft', 'ESET', 'Kaspersky', 'Bitdefender', 'Adobe']
};
