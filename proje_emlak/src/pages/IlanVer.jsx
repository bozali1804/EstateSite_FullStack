import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function IlanVer() {
  const [form, setForm] = useState({
    adSoyad: "",
    telefon: "",
    baslik: "",
    konum: "",
    fiyat: "",
    alan: "",
    durum: "SATILIK",
    tip: "Daire",
    odaSayisi: "",
    aciklama: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.adSoyad || !form.telefon || !form.baslik || !form.konum || !form.fiyat) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "ilan_basvurulari"), {
        ...form,
        fiyat: Number(form.fiyat),
        alan: Number(form.alan),
        durum: "BEKLEMEDE",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm({
        adSoyad: "",
        telefon: "",
        baslik: "",
        konum: "",
        fiyat: "",
        alan: "",
        durum: "SATILIK",
        tip: "Daire",
        odaSayisi: "",
        aciklama: "",
      });
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>İlan Ver</h1>
        <p style={styles.subtitle}>
          Bilgilerinizi doldurun, en kısa sürede sizinle iletişime geçelim.
        </p>

        {success ? (
          <div style={styles.successBox}>
            <span style={styles.successIcon}>✓</span>
            <h2 style={styles.successTitle}>Başvurunuz Alındı!</h2>
            <p style={styles.successText}>
              İlan başvurunuz tarafımıza ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
            <button onClick={() => setSuccess(false)} style={styles.newBtn}>
              Yeni İlan Ver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* İletişim Bilgileri */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>İletişim Bilgileri</h2>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Ad Soyad *</label>
                  <input
                    name="adSoyad"
                    value={form.adSoyad}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Telefon *</label>
                  <input
                    name="telefon"
                    value={form.telefon}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* İlan Bilgileri */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>İlan Bilgileri</h2>
              <div style={styles.field}>
                <label style={styles.label}>İlan Başlığı *</label>
                <input
                  name="baslik"
                  value={form.baslik}
                  onChange={handleChange}
                  placeholder="Örn: 3+1 Satılık Daire"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Konum *</label>
                <input
                  name="konum"
                  value={form.konum}
                  onChange={handleChange}
                  placeholder="İlçe / Mahalle"
                  style={styles.input}
                />
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Fiyat (₺) *</label>
                  <input
                    name="fiyat"
                    type="number"
                    value={form.fiyat}
                    onChange={handleChange}
                    placeholder="0"
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Alan (m²)</label>
                  <input
                    name="alan"
                    type="number"
                    value={form.alan}
                    onChange={handleChange}
                    placeholder="0"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>İlan Durumu</label>
                  <select name="durum" value={form.durum} onChange={handleChange} style={styles.select}>
                    <option value="SATILIK">Satılık</option>
                    <option value="KİRALIK">Kiralık</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Emlak Tipi</label>
                  <select name="tip" value={form.tip} onChange={handleChange} style={styles.select}>
                    <option value="Daire">Daire</option>
                    <option value="Arsa">Arsa</option>
                    <option value="Ofis">Ofis</option>
                    <option value="Dükkan">Dükkan</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Oda Sayısı</label>
                  <input
                    name="odaSayisi"
                    value={form.odaSayisi}
                    onChange={handleChange}
                    placeholder="Örn: 3+1"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  name="aciklama"
                  value={form.aciklama}
                  onChange={handleChange}
                  placeholder="İlanınız hakkında detaylı bilgi veriniz..."
                  rows={5}
                  style={styles.textarea}
                />
              </div>
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px 16px",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "16px",
    marginBottom: "32px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  field: {
    flex: "1",
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#1e293b",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#1e293b",
    backgroundColor: "#fff",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    color: "#1e293b",
    fontFamily: "inherit",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "14px",
    padding: "10px 14px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  btn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnDisabled: {
    backgroundColor: "#93c5fd",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  successBox: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "48px 32px",
    textAlign: "center",
  },
  successIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "50%",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  successTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  successText: {
    color: "#64748b",
    fontSize: "15px",
    marginBottom: "24px",
  },
  newBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default IlanVer;
