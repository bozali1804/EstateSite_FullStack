import { useSearchParams, useNavigate } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";
import { normalize } from "../utils/helpers";
import PropertyCard from "../components/PropertyCard";
import { useState, useEffect } from "react";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  const query = searchParams.get("q") || "";

  // URL değişince input'u güncelle
  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  const results = query.trim().length >= 2
    ? properties.filter((p) => {
        const q = normalize(query);
        return (
          normalize(p.title).includes(q) ||
          normalize(p.location).includes(q)
        );
      })
    : [];

  function handleSearch(e) {
    e.preventDefault();
    if (inputValue.trim().length >= 2) {
      setSearchParams({ q: inputValue.trim() });
    }
  }

  return (
    <div style={styles.page}>
      {/* Arama Başlığı */}
      <div style={styles.hero}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Başlık veya konum ara..."
            style={styles.searchInput}
            autoFocus
          />
          <button type="submit" style={styles.searchBtn}>Ara</button>
        </form>
        {query && (
          <p style={styles.resultCount}>
            {results.length > 0
              ? <><strong>"{query}"</strong> için <strong>{results.length}</strong> sonuç bulundu</>
              : <><strong>"{query}"</strong> için sonuç bulunamadı</>
            }
          </p>
        )}
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.center}>Yükleniyor...</div>
        ) : results.length > 0 ? (
          <div style={styles.grid}>
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : query.trim().length >= 2 ? (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>Sonuç bulunamadı</p>
            <p style={styles.emptyText}>Farklı bir başlık veya konum deneyin.</p>
            <button onClick={() => navigate("/")} style={styles.homeBtn}>Ana Sayfaya Dön</button>
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Aramak için en az 2 karakter girin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    textAlign: "center",
  },
  searchForm: {
    display: "flex",
    maxWidth: "560px",
    margin: "0 auto 16px",
    gap: "8px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  searchBtn: {
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  resultCount: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    margin: 0,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  center: {
    textAlign: "center",
    padding: "80px 0",
    color: "#64748b",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#64748b",
    marginBottom: "24px",
  },
  homeBtn: {
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

export default SearchResults;
