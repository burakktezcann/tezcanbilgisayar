const issueSelect = document.getElementById('supportIssue');
const contactCard = document.getElementById('supportContactCard');
const selectedIssueHeading = document.getElementById('supportSelectedIssue');
const supportDetails = document.getElementById('supportDetails');
const whatsappLink = document.getElementById('supportWhatsapp');
const checklist = document.getElementById('supportChecklist');
const checklistItems = document.getElementById('supportChecklistItems');
const safetyNote = document.getElementById('supportSafetyNote');

const troubleshootingGuides = {
  'Bilgisayarım açılmıyor': {
    steps: ['Priz ve güç kablosunun sağlam takılı olduğunu kontrol et.', 'Masaüstü bilgisayarsa güç kaynağının arkasındaki anahtarın açık olduğuna bak.', 'Güç düğmesine bir kez basıp fan veya ışık tepkisi olup olmadığını gözle.'],
    note: 'Yanık kokusu, kıvılcım veya sıvı teması varsa cihazı yeniden çalıştırmayı deneme; fişini güvenliyse çekip destek al.'
  },
  'Ekranım kırıldı veya görüntü gelmiyor': {
    steps: ['Harici monitör kullanıyorsan monitörün açık ve doğru giriş kaynağında olduğunu kontrol et.', 'Görüntü kablosunun iki ucunu nazikçe kontrol et; mümkünse başka bir kablo veya ekran dene.', 'Cihaz açılıyor ama görüntü yoksa duyduğun bip sesini veya yanan hata ışıklarını not et.'],
    note: 'Kırık ekran camına bastırma veya cihazı sökmeye çalışma. Keskin parçalar yaralanmaya neden olabilir.'
  },
  'Bilgisayarım yavaşlıyor veya donuyor': {
    steps: ['Açık çalışmalarını kaydet ve bilgisayarı bir kez yeniden başlat.', 'Görev Yöneticisi’ndeki İşlemler bölümünde kaynakları çok kullanan uygulama olup olmadığını kontrol et.', 'Sorunun hangi uygulamada ve ne zaman başladığını not et.'],
    note: ''
  },
  'Mavi ekran veya hata mesajı alıyorum': {
    steps: ['Hata ekranındaki kodu veya mesajı fotoğrafla ya da not et.', 'Yeni taktığın çevre birimleri varsa güvenle çıkarıp bilgisayarı bir kez yeniden başlat.', 'Sorun başlamadan önce güncelleme veya yeni program kurulup kurulmadığını not et.'],
    note: 'Önemli dosyaların yedeği yoksa sıfırlama veya işletim sistemi yeniden kurulumu yapmadan önce destek al.'
  },
  'Bilgisayarım aşırı ısınıyor veya ses yapıyor': {
    steps: ['Hava çıkışlarının kapanmadığı sert ve düz bir zemine al.', 'Yoğun çalışan uygulamaları kapatıp sıcaklığın ve sesin azalıp azalmadığını gözle.', 'Sesin fan, tıkırtı veya sürtünme şeklinde olup olmadığını not et.'],
    note: 'Cihaz çok sıcaksa, yanık kokusu varsa veya fan sürtüyorsa kapatıp soğumasını bekle; kasayı açma.'
  },
  'İnternet veya Wi-Fi sorunu yaşıyorum': {
    steps: ['Sorunun diğer cihazlarda da olup olmadığını kontrol et.', 'Wi-Fi bağlantısını kapatıp aç ve doğru ağa bağlı olduğunu doğrula.', 'Modem ışıklarını kontrol et; yeniden başlatmadan önce mevcut durumlarını not et.'],
    note: ''
  },
  'Yazıcım çalışmıyor': {
    steps: ['Yazıcının açık, çevrim içi ve kâğıt/mürekkep durumunun uygun olduğunu kontrol et.', 'USB veya ağ bağlantısının doğru olduğunu ve bilgisayarın yazıcıyı gördüğünü doğrula.', 'Yazdırma kuyruğunda bekleyen veya hata veren iş olup olmadığına bak.'],
    note: ''
  },
  'Klavye, fare veya başka bir cihaz çalışmıyor': {
    steps: ['Kablosuz cihazsa pilini ve güç anahtarını kontrol et.', 'USB bağlantısını çıkarıp başka bir porta tak; mümkünse başka cihazda dene.', 'Bluetooth cihazsa eşleşme durumunu ve pil seviyesini kontrol et.'],
    note: ''
  },
  'Ses veya mikrofon sorunu yaşıyorum': {
    steps: ['Cihazın ve uygulamanın sessizde olmadığını kontrol et.', 'Ses ayarlarından doğru çıkış veya mikrofon cihazının seçili olduğuna bak.', 'Sorunun tek bir uygulamada mı yoksa tüm uygulamalarda mı olduğunu dene.'],
    note: ''
  },
  'Telefon, tablet veya başka bir elektronik cihazla ilgili sorunum var': {
    steps: ['Cihazın marka-modelini ve sorunun ne zaman başladığını not et.', 'Güç veya şarj bağlantısını gözle kontrol et; farklı bir uyumlu kablo varsa deneyebilirsin.', 'Ekrandaki hata mesajını veya ışık/ses uyarısını not et.'],
    note: 'Şişmiş pil, aşırı ısınma veya sıvı teması varsa cihazı şarj etme ve kullanmayı bırak.'
  },
  'Başka bir sorun': {
    steps: ['Cihazın marka-modelini ve kullandığın işletim sistemini not et.', 'Sorunun ne zaman ve hangi işlemden sonra başladığını düşün.', 'Varsa hata mesajını ve denediğin çözüm adımlarını hazırla.'],
    note: 'Ekran görüntüsü paylaşırken kişisel bilgilerini ve bildirimlerini gizlemeyi unutma.'
  }
};

function renderChecklist(issue) {
  const guide = troubleshootingGuides[issue];
  checklistItems.replaceChildren();
  checklist.hidden = !guide;
  safetyNote.hidden = !guide?.note;

  if (!guide) return;

  guide.steps.forEach((step, index) => {
    const label = document.createElement('label');
    label.className = 'support-check-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = step;
    input.setAttribute('aria-label', step);

    const indicator = document.createElement('span');
    indicator.className = 'support-check-indicator';
    indicator.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'support-check-copy';
    text.innerHTML = `<small>ADIM ${String(index + 1).padStart(2, '0')}</small><span></span>`;
    text.querySelector('span').textContent = step;

    label.append(input, indicator, text);
    checklistItems.append(label);
  });

  if (guide.note) safetyNote.querySelector('span').textContent = guide.note;
}

function updateSupportMessage() {
  const issue = issueSelect.value;
  contactCard.hidden = !issue;
  if (!issue) return;

  selectedIssueHeading.textContent = issue;
  const triedSteps = [...checklistItems.querySelectorAll('input:checked')].map(input => input.value);
  const details = supportDetails.value.trim();
  const message = [
    'Merhaba, Tezcan Bilgisayar teknik destek ekibine danışmak istiyorum.',
    `Sorunum: ${issue}`,
    triedSteps.length ? `Denediğim adımlar:\n- ${triedSteps.join('\n- ')}` : '',
    details ? `Ek bilgi: ${details}` : '',
    'Uygun olduğunuzda yardımcı olabilir misiniz?'
  ].filter(Boolean).join('\n\n');
  whatsappLink.href = `https://wa.me/905324694249?text=${encodeURIComponent(message)}`;
}

issueSelect.addEventListener('change', () => {
  renderChecklist(issueSelect.value);
  updateSupportMessage();
});
checklistItems.addEventListener('change', updateSupportMessage);
supportDetails.addEventListener('input', updateSupportMessage);
document.getElementById('supportYear').textContent = String(new Date().getFullYear());
