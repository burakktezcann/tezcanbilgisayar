(() => {
  const validImagePath = value => typeof value === 'string' && (
    (/^assets\/products\/[A-Za-z0-9._/-]+$/.test(value) && !value.includes('..')) ||
    /^https:\/\/[A-Za-z0-9.-]+\/storage\/v1\/object\/public\/product-images\/[A-Za-z0-9._/-]+$/.test(value)
  );
  const readStringIds = (key, limit = Infinity) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value.filter(id => typeof id === 'string').slice(0, limit) : [];
    } catch { return []; }
  };
  const formatCurrency = (value, currency = 'TRY', fallback = 'Fiyat bilgisi hazırlanıyor') =>
    Number.isFinite(value)
      ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: /^[A-Z]{3}$/.test(currency || '') ? currency : 'TRY' }).format(value)
      : fallback;
  window.TezcanCatalogUtils = Object.freeze({ validImagePath, readStringIds, formatCurrency });
})();
