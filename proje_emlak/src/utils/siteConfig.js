// =============================================
//  SİTE KONFİGÜRASYONU — buradan düzenleyin
// =============================================

export const SITE_CONFIG = {
  // Firma adı
  firmaAdi: "KRC Emlak",

  // İletişim bilgileri
  telefon: "+90 5XX XXX XX XX",       // ← telefon numaranızı buraya yazın
  whatsapp: "905XXXXXXXXX",           // ← WhatsApp numaranızı buraya yazın (başında 0 olmadan, 90 ile başlayarak)
  email: "info@krcemllak.com",        // ← e-posta adresinizi buraya yazın
  adres: "Örnek Mah. Emlak Cad. No:1, İlçe / Şehir",  // ← adresinizi buraya yazın

  // Sosyal medya (boş bırakırsanız footer'da gözükmez)
  instagram: "",   // ← örn: "https://instagram.com/krcemllak"
  facebook: "",    // ← örn: "https://facebook.com/krcemllak"

  // Footer alt yazı yılı (otomatik güncellenir)
  get copyrightYil() {
    return new Date().getFullYear();
  }
};
