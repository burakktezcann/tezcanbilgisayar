# Tezcan Bilgisayar — Site Hazırlığı

Bu proje, Tezcan Bilgisayar şirketi kurulmadan önce hazırlanmakta olan statik web sitesidir. Şu anki sürüm kuruluş öncesi tanıtım ve teknik hazırlık içindir; siteden sipariş veya ödeme alınmaz, müşteri üyeliği ve profil özellikleri kapalıdır. Sayfalarda `noindex` kullanılır; kuruluş ve içerik hazırlığı bitmeden arama motorlarına açılmamalıdır.

## Sade site düzeni

- `index.html`: Ana sayfa, ürün grupları ve arama.
- `iletisim.html`: Telefon, e-posta ve WhatsApp iletişimi.
- `hesap.html` ve `hesabim.html`: Üyelik/giriş ve oturum açıldıktan sonra profil/adres yönetimi. Kayıtlar şimdilik kapalıdır.
- `yonetim.html`: Menüde gösterilmeyen, yetkili ürün yönetim ekranı.
- `404.html`: Bulunmayan sayfalar.

Hizmetler ve hakkımızda için ayrı sayfalar kaldırıldı; kuruluş hazırlığı bilgisi ana sayfada, iletişim bilgileri tek iletişim sayfasında tutulur. Ana sayfa da tekrarlayan hizmet tanıtım kartlarından arındırıldı.

## Katalog yapısı

- `index.html`: Kategori keşfi ve katalog arayüzü. Ürünler önce Supabase tablolarından, erişilemezse `assets/data/catalog.json` yedeğinden yüklenir.
- `assets/data/catalog.json`: Şimdilik planlanan ürün grupları. Gerçek ürün, SKU, fiyat ve stok eklenmemiştir.
- `assets/data/catalog.schema.json`: Yedek katalog dosyasının veri şeması.
- `supabase/migrations/20261031000100_product_catalog.sql`: Ürün/kategori tabloları, genel görüntüleme kuralları ve yönetici yazma izinleri.
- `supabase/migrations/20261028000100_customer_profiles.sql`: Kullanıcı profilleri ve özel teslimat adresleri.
- `supabase/migrations/20261031000200_account_hardening.sql`: Profil alanı erişimini daraltır ve adres sorgularını hızlandırır.
- `supabase/config.toml`: Docker ile yerel geliştirme için Supabase CLI ayarları.
- `hesap.html` / `assets/js/pages/account.js`: Kayıt, giriş, e-posta doğrulama ve parola yenileme arayüzü.
- `hesabim.html` / `assets/js/pages/profile.js`: Profil ve kullanıcının kendi adreslerini yönetme.
- `yonetim.html`: Yetkili yönetici için ürün ve kategori ekranı. Yeni kullanıcı kaydı sunmaz.
- `assets/js/pages/catalog-admin.js`: Yönetim ekranı işlemleri.
- `KURULUS-ONCESI-HAZIRLIK.md`: İşletme, satış, kişisel veri ve teknik yayın kontrol listesi.

Katalog ürünü `id`, `categoryId`, `name`, `description`, `brand`, `model`, `sku`, `image`, `price`, `currency`, `stock`, `status`, `sortOrder` ve `searchTerms` alanlarını kullanır. Yalnızca `status: "active"` ürünler sitede görünür. Görseller `assets/products/` altına konur. Fiyat sıralaması katalogda gerçek fiyat bulunana kadar kapalıdır.

## Katalog yönetimini kurma

1. Supabase Dashboard > SQL Editor bölümünde `supabase/migrations/20261031000100_product_catalog.sql` dosyasını çalıştır. Tablolar ve başlangıç kategorileri oluşturulur.
2. Supabase Authentication bölümünden yönetici hesabı oluştur. Sitede herkese açık üyelik kaydı yoktur.
3. Bu kullanıcının UUID değerini bulup SQL Editor'da aşağıdaki sorgudaki UUID'yi değiştirerek çalıştır. Bu rolü yalnızca katalog yöneticisi olması gereken hesaba ver:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('catalog_role', 'admin')
where id = 'YONETICI-KULLANICI-UUID';
```

4. Yönetici hesabıyla oturumu yeniden açıp `yonetim.html` sayfasına git. RLS, ürün ve kategori değişikliklerini veritabanında ayrıca denetler.
5. Yeni ürünler taslak olarak başlar. Ürün `Yayında` olduğunda ve kategorisi açık olduğunda ana sayfada gösterilir. Kategoriyi silmek yerine gizleyebilirsin; böylece bağlı ürünler korunur.
6. Ürün görselini `assets/products/` klasörüne koyup `assets/products/ornek.jpg` biçimindeki yolu ürün formuna yaz.

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

1. Migration'ları canlı projeye uygulamadan önce yedek alıp SQL'leri gözden geçir. `20261031000200_account_hardening.sql` eski `age` sütununu silmez; uygulama artık yaş istemez ve bu sütuna erişim iznini daraltır.
2. Supabase Authentication ayarlarında e-posta kaydını/doğrulamasını aç; gerçek site URL'sini ve hesap sayfasındaki doğrulama/şifre dönüş adreslerini izinli adreslere ekle.
3. Canlı e-posta için doğrulanmış alan adına ait SMTP sağlayıcısı kur. Varsayılan deneme e-posta kotası gerçek kullanıma uygun değildir.
4. Supabase panelinde çok faktörlü koruma kullan, erişimi gereken kişilerle sınırla ve düzenli yedekleri etkin tut. Gizli/service role anahtarını site dosyalarına koyma.
5. Şirket iletişim/veri sorumlusu bilgileri ve gerçek kişisel veri bilgilendirme metni yayımlanmadan `assets/js/config/supabase-config.js` içindeki `customerAccountsEnabled` değerini `true` yapma. Hazır olduğunda `privacyNoticeUrl` değerini yayımlanmış metnin bağlantısıyla doldur.

Mevcut çalışma ortamında Docker Desktop yüklü, ancak Docker motoru çalışmıyor ve Supabase CLI bulunmuyor. Yerel Supabase servisi bu nedenle başlatılmadı; yapılandırma ve migration dosyaları hazırlandı.
