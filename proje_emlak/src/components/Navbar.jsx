import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../hooks/useProperties";
import { normalize } from "../utils/helpers";
import logo from "../assets/images/KRC-Logo.jpeg"

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { properties } = useProperties();

  const searchResults = searchQuery.trim().length >= 2
    ? properties.filter((p) => {
        const q = normalize(searchQuery);
        return (
          normalize(p.title || "").includes(q) ||
          normalize(p.location || "").includes(q)
        );
      }).slice(0, 6)
    : [];

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close search + clear query on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <header style={styles.header} className="navbar-header">
      {/* SOL – SEARCH */}
      <div style={styles.left} className="navbar-left">
        <div style={styles.searchWrapper} ref={searchRef}>
          <button
            style={styles.searchIcon}
            className="navbar-search-icon"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setSearchQuery("");
            }}
          >
            🔍
          </button>

          {isSearchOpen && (
            <div style={styles.searchPopup} className="search-popup">
              <input
                type="text"
                style={styles.searchInput}
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  } else if (e.key === "Enter" && searchQuery.trim().length >= 2) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              />

              {/* Sonuçlar */}
              {searchQuery.trim().length >= 2 && (
                <div style={styles.resultsList}>
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <div
                        key={p.id}
                        style={styles.resultItem}
                        onClick={() => navigate(`/property/${p.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                      >
                        {p.image && (
                          <img src={p.image} alt={p.title} style={styles.resultImg} />
                        )}
                        <div style={styles.resultInfo}>
                          <span style={styles.resultTitle}>{p.title}</span>
                          <span style={styles.resultMeta}>
                            {p.location && <span>{p.location}</span>}
                            {p.price && (
                              <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                                {" · "}₺{Number(p.price).toLocaleString("tr-TR")}
                              </span>
                            )}
                          </span>
                        </div>
                        <span style={styles.resultBadge}>{p.status}</span>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noResult}>Sonuç bulunamadı</div>
                  )}
                  {searchResults.length > 0 && (
                    <div
                      style={styles.showMoreBtn}
                      onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                    >
                      Tüm sonuçları görüntüle →
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ORTA MENÜ */}
      <nav style={styles.centerMenu} className="navbar-center">
        <Link to="/sale" className="nav-link">Satılık</Link>
        <Link to="/rent" className="nav-link">Kiralık</Link>

        <Link to="/" >
        <img src={logo} alt="Company Logo" style={styles.logo} className="nav-logo" />
        </Link>

        <Link to="/land" className="nav-link">Arsa</Link>
        <Link to="/office" className="nav-link">Ofis</Link>
      </nav>

      {/* SAĞ */}
      <div style={styles.right} className="navbar-right">
        {user ? (
          <>
            <Link to="/add-listing" style={styles.listingButton}>+ İlan Ver</Link>
            <button onClick={logout} style={styles.logoutButton}>Çıkış</button>
          </>
        ) : (
          <>
            <Link to="/ilan-ver" style={styles.listingButton}>İlan Ver</Link>
            <Link to="/login" style={{...styles.loginButton, marginLeft: "8px"}}>Giriş</Link>
          </>
        )}
      </div>

      {/* HAMBURGER BUTTON (mobile only) */}
      <button
        className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Menü"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* MOBILE MENU PANEL */}
      <nav className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/sale">Satılık</Link>
        <Link to="/rent">Kiralık</Link>
        <Link to="/land">Arsa</Link>
        <Link to="/office">Ofis</Link>
        {user ? (
          <>
            <Link to="/add-listing" className="mobile-listing-btn">+ İlan Ver</Link>
            <button onClick={logout} style={styles.mobileLogoutBtn}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/ilan-ver">İlan Ver</Link>
            <Link to="/login">Giriş</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "12px 28px",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottom: "1px solid #e2e8f0",
    zIndex: 1000,
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
  },

  left: {
    display: "flex",
    alignItems: "center"
  },

  searchWrapper: {
    position: "relative"
  },

  searchIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    color: "#475569",
    transition: "all 0.2s ease"
  },

  searchPopup: {
    position: "absolute",
    left: "36px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 1100,
    width: "320px"
  },

  searchInput: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  },

  resultsList: {
    marginTop: "6px",
    borderTop: "1px solid #f1f5f9",
    maxHeight: "360px",
    overflowY: "auto"
  },

  resultItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 8px",
    cursor: "pointer",
    borderRadius: "6px",
    backgroundColor: "#fff",
    transition: "background 0.15s"
  },

  resultImg: {
    width: "48px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "5px",
    flexShrink: 0
  },

  resultInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0
  },

  resultTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  resultMeta: {
    fontSize: "12px",
    color: "#64748b"
  },

  resultBadge: {
    fontSize: "11px",
    fontWeight: "700",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    padding: "2px 7px",
    borderRadius: "10px",
    flexShrink: 0
  },

  noResult: {
    padding: "16px 8px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px"
  },

  showMoreBtn: {
    padding: "10px 8px",
    textAlign: "center",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    borderTop: "1px solid #f1f5f9",
    marginTop: "4px"
  },

  centerMenu: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    fontSize: "15px"
  },

  logo: {
    height: "62px",
    width: "auto",
    objectFit: "contain",
    margin: "0 8px",
    transition: "opacity 0.2s ease"
  },

  right: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px"
  },

  listingButton: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "9px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "13.5px",
    letterSpacing: "0.01em",
    transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 2px 8px rgba(37,99,235,0.25)"
  },

  logoutButton: {
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "1.5px solid #fecaca",
    padding: "9px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13.5px",
    transition: "all 0.2s ease"
  },

  loginButton: {
    backgroundColor: "transparent",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    padding: "9px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    fontSize: "13.5px",
    transition: "all 0.2s ease"
  },

  mobileLogoutBtn: {
    display: "block",
    width: "100%",
    marginTop: "12px",
    padding: "14px",
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "1.5px solid #fecaca",
    borderRadius: "8px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Navbar;
