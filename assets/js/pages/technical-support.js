const issueSelect = document.getElementById('supportIssue');
const contactCard = document.getElementById('supportContactCard');
const selectedIssueHeading = document.getElementById('supportSelectedIssue');
const supportDetails = document.getElementById('supportDetails');
const whatsappLink = document.getElementById('supportWhatsapp');

function updateSupportMessage() {
  const issue = issueSelect.value;
  contactCard.hidden = !issue;
  if (!issue) return;

  selectedIssueHeading.textContent = issue;
  const details = supportDetails.value.trim();
  const message = [
    'Merhaba, Tezcan Bilgisayar teknik destek ekibine danışmak istiyorum.',
    `Sorunum: ${issue}`,
    details ? `Ek bilgi: ${details}` : '',
    'Uygun olduğunuzda yardımcı olabilir misiniz?'
  ].filter(Boolean).join('\n');
  whatsappLink.href = `https://wa.me/905324694249?text=${encodeURIComponent(message)}`;
}

issueSelect.addEventListener('change', updateSupportMessage);
supportDetails.addEventListener('input', updateSupportMessage);
document.getElementById('supportYear').textContent = String(new Date().getFullYear());
