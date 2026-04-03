import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../utils/siteConfig";
import logo from "../assets/images/KRC-Logo.jpeg";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Sol: Logo + Açıklama */}
        <div style={styles.col}>
          <Link to="/">
            <img src={logo} alt={SITE_CONFIG.firmaAdi} style={styles.logo} />
          </Link>
          <p style={styles.desc}>
            Güvenilir emlak hizmetleriyle hayalinizdeki mülkü bulmak için doğru adres.
          </p>
          {/* Sosyal medya */}
          {(SITE_CONFIG.instagram || SITE_CONFIG.facebook) && (
            <div style={styles.social}>
              {SITE_CONFIG.instagram && (
                <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                  Instagram
                </a>
              )}
              {SITE_CONFIG.facebook && (
                <a href={SITE_CONFIG.facebook} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>

        {/* Orta: Hızlı Linkler */}
        <div style={styles.col}>
          <h3 style={styles.colTitle}>Hızlı Linkler</h3>
          <nav style={styles.linkList}>
            <Link to="/" style={styles.footerLink}>Ana Sayfa</Link>
            <Link to="/sale" style={styles.footerLink}>Satılık İlanlar</Link>
            <Link to="/rent" style={styles.footerLink}>Kiralık İlanlar</Link>
            <Link to="/land" style={styles.footerLink}>Arsa İlanları</Link>
            <Link to="/office" style={styles.footerLink}>Ofis İlanları</Link>
            <Link to="/ilan-ver" style={styles.footerLink}>İlan Ver</Link>
          </nav>
        </div>

        {/* Sağ: İletişim */}
        <div style={styles.col}>
          <h3 style={styles.colTitle}>İletişim</h3>
          <div style={styles.contactList}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📞</span>
              <a href={`tel:${SITE_CONFIG.telefon}`} style={styles.contactText}>
                {SITE_CONFIG.telefon}
              </a>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <a href={`mailto:${SITE_CONFIG.email}`} style={styles.contactText}>
                {SITE_CONFIG.email}
              </a>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📍</span>
              <span style={styles.contactText}>{SITE_CONFIG.adres}</span>
            </div>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whatsappBtn}
            >
              <span>💬</span>
              WhatsApp ile Yaz
            </a>
          </div>
        </div>

      </div>

      {/* Alt bar */}
      <div style={styles.bottomBar}>
        <span>© {SITE_CONFIG.copyrightYil} {SITE_CONFIG.firmaAdi}. Tüm hakları saklıdır.</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#0f172a",
    color: "#94a3b8",
    marginTop: "auto"
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "56px 24px 40px",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1.2fr",
    gap: "48px"
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  logo: {
    height: "52px",
    width: "auto",
    objectFit: "contain",
    filter: "brightness(1.1)",
    borderRadius: "6px"
  },
  desc: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#64748b",
    maxWidth: "260px"
  },
  social: {
    display: "flex",
    gap: "12px",
    marginTop: "4px"
  },
  socialLink: {
    fontSize: "13px",
    color: "#475569",
    textDecoration: "none",
    padding: "5px 12px",
    border: "1px solid #1e293b",
    borderRadius: "100px",
    transition: "all 0.2s ease"
  },
  colTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#e2e8f0",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "4px"
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  footerLink: {
    fontSize: "14px",
    color: "#64748b",
    textDecoration: "none",
    transition: "color 0.2s ease",
    display: "inline-block"
  },
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px"
  },
  contactIcon: {
    fontSize: "15px",
    flexShrink: 0,
    marginTop: "1px"
  },
  contactText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
    textDecoration: "none",
    transition: "color 0.2s"
  },
  whatsappBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    backgroundColor: "#25d366",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    width: "fit-content",
    transition: "background 0.2s ease, transform 0.2s ease"
  },
  bottomBar: {
    borderTop: "1px solid #1e293b",
    padding: "20px 24px",
    textAlign: "center",
    fontSize: "13px",
    color: "#334155"
  }
};

export default Footer;
