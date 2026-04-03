import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/KRC-Logo.jpeg"

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            🔍
          </button>

          {isSearchOpen && (
            <div style={styles.searchPopup} className="search-popup">
              <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
                autoFocus
              />
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
          <Link to="/login" style={styles.loginButton}>Giriş</Link>
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
          <Link to="/login">Giriş</Link>
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
    padding: "14px 24px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    zIndex: 1000
  },

  left: {
    display: "flex",
    alignItems: "center"
  },

  searchWrapper: {
    position: "relative"
  },

  searchIcon: {
    fontSize: "50px",
    background: "none",
    border: "none",
    cursor: "pointer"
  },

  searchPopup: {
    position: "absolute",
    left: "36px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  searchInput: {
    width: "180px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },

  centerMenu: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    fontSize: "16px"
  },

  logo: {
    height: "70px",
    width:"auto",
    objectFit:"contain",
    fontWeight: "bold",
    fontSize: "20px",
    margin: "0 10px"
  },

  right: {
    display: "flex",
    justifyContent: "flex-end"
  },

  listingButton: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    fontSize: "14px"
  },

  logoutButton: {
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "1px solid #dc2626",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    marginLeft: "8px"
  },

  loginButton: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    fontSize: "14px"
  },

  mobileLogoutBtn: {
    display: "block",
    width: "100%",
    marginTop: "12px",
    padding: "14px",
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "1px solid #dc2626",
    borderRadius: "8px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Navbar;
