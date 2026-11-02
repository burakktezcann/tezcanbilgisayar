# Tezcan Bilgisayar — Site Hazırlığı

Bu proje, Tezcan Bilgisayar şirketi kurulmadan önce hazırlanmakta olan statik web sitesidir. Şu anki sürüm kuruluş öncesi tanıtım ve teknik hazırlık içindir; siteden sipariş veya ödeme alınmaz. Müşteri hesabı açma ve giriş özellikleri kullanılabilir; şirket kuruluşu tamamlandığında veri sorumlusu ve altyapı bilgileri yeniden gözden geçirilmelidir. Ana sayfa, katalog, sistem toplama, teknik destek, iletişim ve gizlilik gibi kamuya açık sayfalar arama motorlarına açıktır. Hesap, favoriler, yönetim ve 404 sayfaları `noindex` kalır. Bu sayfa içerikleri kuruluş öncesi durumu açıkça belirtir; şirket bilgileri ve satış verileri kesinleşmeden adres, çalışma saati, stok veya fiyat eklenmez.

## Sade site düzeni

- `index.html`: Ana sayfa, ürün grupları ve arama.
- `iletisim.html`: Telefon, e-posta ve WhatsApp iletişimi.
- `teknikdestek.html`: Sorun türü seçimi, hazır WhatsApp mesajı ve telefonla destek bağlantısı.
- `hesap.html` ve `hesabim.html`: Üyelik/giriş ve oturum açıldıktan sonra profil/adres yönetimi.
- `kvkk-aydinlatma.html`: Hesap verilerinin işlenmesi hakkında bilgilendirme.
- `yonetim.html`: Menüde gösterilmeyen, yetkili ürün yönetim ekranı.
- `404.html`: Bulunmayan sayfalar.
- `bilgisayar-rehberleri.html` ve `rehberler/`: Bilgisayar parçası seçimi ve güvenli sorun giderme içerikleri.

Hizmetler ve hakkımızda için ayrı sayfalar kaldırıldı; kuruluş hazırlığı bilgisi ana sayfada, iletişim bilgileri tek iletişim sayfasında tutulur. Ana sayfa da tekrarlayan hizmet tanıtım kartlarından arındırıldı.

## Google görünürlüğü

- Kamuya açık sayfalarda özgün SEO başlıkları, açıklamalar, canonical ve sosyal paylaşım metaverileri bulunur.
- `robots.txt` site haritasını bildirir; `sitemap.xml` yalnızca kamuya açık sayfaları listeler.
- Hesap, profil, favoriler, yönetim ve 404 sayfaları arama sonuçlarına kapalıdır.
- Google Search Console alan adı doğrulaması ve site haritası gönderimi yayın sonrası yapılmalıdır; Search Console hesabı ve alan adı DNS erişimi gerektirir.
- Şirket faaliyete başlamadan adres, çalışma saati, stok/fiyat teklifi veya faal işletme profili oluşturulmaz.

## Katalog yapısı

- `index.html`: Kategori keşfi ve katalog arayüzü. Ürünler önce Supabase tablolarından, erişilemezse `assets/data/catalog.json` yedeğinden yüklenir.
- `assets/js/main.js`: Ürün arama, kategori filtreleme, ürün listesi ve aynı kategoride en fazla dört ürünü teknik özellikleriyle karşılaştırma.
- `assets/js/pages/pc-builder.js`: Katalogdaki işlemci, anakart, RAM, ekran kartı, kasa ve güç kaynağı özelliklerinden sistem toplama listesi ve uyum uyarıları.
- `assets/data/catalog.json`: Şimdilik planlanan ürün grupları. Gerçek ürün, SKU, fiyat ve stok eklenmemiştir.
- `assets/data/catalog.schema.json`: Yedek katalog dosyasının veri şeması.
- `supabase/migrations/20261031000100_product_catalog.sql`: Ürün/kategori tabloları, genel görüntüleme kuralları ve yönetici yazma izinleri.
- `supabase/migrations/20261031000300_more_catalog_categories.sql`: Ana sayfadaki hazır sistem, bilgisayar, çevre birimi ve diğer kategori gruplarını kataloğa ekler.
- `supabase/migrations/20261031000400_product_image_storage.sql`: Ürün fotoğrafları için herkese açık görüntüleme ve yalnızca yöneticiye yazma izni olan depolamayı kurar.
- `supabase/migrations/20261031000500_product_category_attributes.sql`: Ürünlerin kategoriye özgü teknik özelliklerini JSONB nesnesi olarak saklar.
- `supabase/migrations/20261028000100_customer_profiles.sql`: Kullanıcı profilleri ve özel teslimat adresleri.
- `supabase/migrations/20261031000200_account_hardening.sql`: Profil alanı erişimini daraltır ve adres sorgularını hızlandırır.
- `supabase/config.toml`: Docker ile yerel geliştirme için Supabase CLI ayarları.
- `hesap.html` / `assets/js/pages/account.js`: Kayıt, giriş, e-posta doğrulama ve parola yenileme arayüzü.
- `hesabim.html` / `assets/js/pages/profile.js`: Profil ve kullanıcının kendi adreslerini yönetme.
- `yonetim.html`: Yetkili yönetici için ürün ve kategori ekranı. Yeni kullanıcı kaydı sunmaz.
- `assets/js/pages/catalog-admin.js`: Yönetim ekranı işlemleri, katalog/stok özeti ve listeden stok adedini hızlı güncelleme.
- `assets/js/pages/category-attributes.js`: Kategoriye göre açılan teknik özellik alanları ve marka önerileri.
- `KURULUS-ONCESI-HAZIRLIK.md`: İşletme, satış, kişisel veri ve teknik yayın kontrol listesi.

Katalog ürününde temel alanlara ek olarak `attributes` nesnesi kategoriye özgü teknik özellikleri saklar. Bu nesnenin alanları `assets/js/pages/category-attributes.js` içinde kategoriye göre tanımlanır; örneğin RAM seçildiğinde kapasite, DDR türü, hız ve modül sayısı alanları açılır. Ürün kartında girilmiş teknik özellikler gösterilir. Marka alanı kategoriye göre bilinen markaları önerir, yeni marka yazılmasına da izin verir. Yalnızca `status: "active"` ürünler sitede görünür. Fotoğrafı yönetim panelindeki ürün formundan seçip önizleyebilir veya sürükleyip bırakabilirsin. Görseller Supabase Storage'daki `product-images` alanında saklanır; CSV ile eski `assets/products/` dosya yolları da kullanılabilir. Fiyat sıralaması katalogda gerçek fiyat bulunana kadar kapalıdır.

Aktif ürünler aynı kategoride en fazla dört ürün olarak karşılaştırılabilir. Karşılaştırma, yönetimde girilen teknik özellikleri ve fiyatı yan yana gösterir; eksik özellikleri `—` ile belirtir. Favori ürünler de kalp düğmesiyle kaydedilip `Favorilerim` filtresinde görüntülenebilir; bu seçimler tarayıcıda saklanır. Karşılaştırma ve favori seçimleri katalogda artık bulunmayan ürünleri sonraki yüklemede listeden çıkarır. Bu özellik sipariş veya uyumluluk garantisi oluşturmaz.

Ana sayfadaki sistem toplama yardımcısı aktif katalog ürünlerinden parça seçtirir, işlemci/anakart soketini, anakart/RAM neslini, kasa/anakart boyutunu ve ekran kartı uzunluğunu kontrol eder. CPU ve GPU TDP değerlerinden ihtiyat paylı yaklaşık bir güç hedefi gösterir. Bu hesap üretici tavsiyesinin veya uyumluluk listesinin yerine geçmez. Sistem listesi WhatsApp üzerinden yalnızca kullanıcı düğmeye bastığında paylaşılır; sipariş oluşturmaz.

Yönetim panelinde ürün, yayındaki ürün, taslak, az stok (1–5 adet) ve stokta olmayan ürün sayıları özetlenir. Özet kartlarına basarak ilgili ürün listesine geçilir. Stok adedi liste içindeki alandan değiştirilebilir; sıfır adedi geçerli, boş değer ise reddedilir.

## Katalog yönetimini kurma

1. Supabase Dashboard > SQL Editor bölümünde sırayla `supabase/migrations/20261031000100_product_catalog.sql`, `supabase/migrations/20261031000300_more_catalog_categories.sql`, `supabase/migrations/20261031000400_product_image_storage.sql` ve `supabase/migrations/20261031000500_product_category_attributes.sql` dosyalarını çalıştır. Tablolar, ürün grupları, fotoğraf deposu ve kategoriye özel teknik özellik alanı oluşturulur.
2. Supabase Authentication bölümünden katalog yöneticisi hesabı oluştur. Müşteri hesabı açma ve giriş özelliği ayrı olarak yayında açıktır.
3. Bu kullanıcının UUID değerini bulup SQL Editor'da aşağıdaki sorgudaki UUID'yi değiştirerek çalıştır. Bu rolü yalnızca katalog yöneticisi olması gereken hesaba ver:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('catalog_role', 'admin')
where id = 'YONETICI-KULLANICI-UUID';
```

4. Yönetici hesabıyla oturumu yeniden açıp `yonetim.html` sayfasına git. RLS, ürün ve kategori değişikliklerini veritabanında ayrıca denetler.
5. Yeni ürünler taslak olarak başlar. Ürün `Yayında` olduğunda ve kategorisi açık olduğunda ana sayfada gösterilir. Kategoriyi silmek yerine gizleyebilirsin; böylece bağlı ürünler korunur.
6. Ürün görselini `assets/products/` klasörüne koyup `assets/products/ornek.jpg` biçimindeki yolu ürün formuna yaz.
7. Yönetim panelindeki CSV dışa aktarma düğmesi mevcut ürünleri yedekler. Toplu yüklemede bu dosyanın sütun başlıklarını koru; arama kelimelerini `|` ile ayır. Önce satırlar denetlenir, ardından yeni ürün/güncelleme sayısı gösterilip onay istenir. Aynı `slug` değeri olan ürün güncellenir.

Katalog verisi tarayıcıda okunabilmesi için yerel geliştirmede HTTP sunucusu üzerinden açılmalıdır (`file://` ile JSON yüklemesi tarayıcı tarafından engellenebilir). Tarayıcıya yalnızca Supabase publishable key konur; secret/service_role anahtarı site dosyalarına eklenmez. Supabase tabloları erişilemezse ana sayfa JSON yedeğini kullanır.

## Yayın öncesi

İşletme unvanı/adresi ve ilgili sicil bilgileri, gerçek ürün/fiyat/stok verileri, satış ve teslimat süreçleri, tüketici bilgilendirmeleri ve KVKK metinleri tamamlanmadan bu site sipariş veya ödeme almaya açılmamalıdır. Mevcut telefon, e-posta, Instagram ve Supabase proje ayarları da işletme sahibi tarafından doğrulanmalıdır.

ETBİS, mesafeli satış ve kişisel veri yükümlülükleri satış modeline göre resmi kaynaklardan teyit edilmelidir. Başlangıç kontrol listesi için `KURULUS-ONCESI-HAZIRLIK.md` dosyasına bakın.

## Veritabanı ve hesap altyapısı

Canlı site için yönetilen Supabase kullanılmalı; kişisel bilgisayardaki Docker veritabanı internete açılmamalıdır. Docker + Supabase CLI yerel geliştirme ve deneme içindir. Böylece bilgisayar kapalıyken canlı site veritabanı çalışmaya devam eder.

### Yerel geliştirmeyi başlatma

1. Docker Desktop'ı aç ve durumunun `Running` olduğunu doğrula.
2. Proje klasöründe yerel altyapıyı başlat: `npx supabase start`. İlk çalıştırmada gerekli yerel imajlar indirilir.
3. Komut çıktısındaki yerel API URL'si ve publishable anahtarı `assets/js/config/supabase-config.js` dosyasındaki değerlerle yalnızca yerel deneme sırasında değiştir. Yerel e-posta doğrulama iletilerini `http://127.0.0.1:54324`, yönetim arayüzünü `http://127.0.0.1:54323` adresinde görürsün.
4. Migration'ları yerel veritabanına uygula: `npx supabase migration up`.
5. İşin bitince `npx supabase stop` ile yerel servisleri durdur. Yerel veritabanını canlı siteye bağlama.

### Canlı Supabase ve üyelik

1. Migration'ları canlı projeye uygulamadan önce yedek alıp SQL'leri gözden geçir. `20261031000200_account_hardening.sql` eski `age` sütununu silmez; uygulama artık yaş istemez ve bu sütuna erişim iznini daraltır. Üyelik tercihlerini hesapta saklamak için `20261102000600_customer_communication_preferences.sql` migration'ını da Supabase SQL Editor'da çalıştır.
2. Supabase Authentication ayarlarında e-posta kaydını/doğrulamasını aç; gerçek site URL'sini ve hesap sayfasındaki doğrulama/şifre dönüş adreslerini izinli adreslere ekle.
3. Canlı e-posta için doğrulanmış alan adına ait SMTP sağlayıcısı kur. Varsayılan deneme e-posta kotası gerçek kullanıma uygun değildir.
4. Supabase panelinde çok faktörlü koruma kullan, erişimi gereken kişilerle sınırla ve düzenli yedekleri etkin tut. Gizli/service role anahtarını site dosyalarına koyma.
5. Hesap oluşturma ve giriş bu sürümde açıktır. `kvkk-aydinlatma.html` hesap kayıt formunda gösterilir. Şirket kuruluşu ve veri altyapısı netleştiğinde veri sorumlusu, yurt dışı aktarım koşulları ve iletişim bilgilerini gözden geçirip metni güncelle. Supabase Auth yönlendirme listesine `https://tezcanbilgisayar.com/hesap.html` ve `https://www.tezcanbilgisayar.com/hesap.html` adreslerini ekle; site adresini yayındaki alan adına ayarla.

E-posta bilgilendirme seçimi kullanıcı profilinde bir tercih kaydı olarak tutulur; varsayılanı kapalıdır. Bu tercih tek başına e-posta gönderimi başlatmaz. E-posta sağlayıcısı, gönderim amacı ve ilgili yasal metinler hazır olana kadar pazarlama e-postası gönderilmez. Sipariş/ödeme özelliği şirket bilgileri, gerçek katalog/fiyat/stok, teslimat-iade süreçleri, güvenli ödeme sağlayıcısı ve hukuki metinler doğrulanmadan etkinleştirilmemelidir.

Mevcut çalışma ortamında Docker Desktop yüklü, ancak Docker motoru çalışmıyor ve Supabase CLI bulunmuyor. Yerel Supabase servisi bu nedenle başlatılmadı; yapılandırma ve migration dosyaları hazırlandı.

## Ana sayfa kategori seçimi

Ana sayfadaki ürün grubu kartları katalog listesini filtreler ve seçilen gruba kaydırır. Bu gruba henüz ürün girilmediyse hazırlık mesajı gösterilir. Yerel JSON yedeği bütün ana ürün gruplarını içerir; Supabase kataloğunun aynı grupları sunması için `20261031000300_more_catalog_categories.sql` migration'ı da uygulanmalıdır.
