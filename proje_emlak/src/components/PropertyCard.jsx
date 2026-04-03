import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function PropertyCard({ property }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  // Firestore'dan gelen ilanlar string id'ye sahip, local veriler number id'ye sahip
  const isFirebaseProperty = typeof property.id === "string";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`"${property.title}" ilanını silmek istediğinize emin misiniz?`)) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "properties", property.id));
    } catch (err) {
      alert("Silme hatası: " + err.message);
      setDeleting(false);
    }
  };

  return (
    <div style={styles.card} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
      <div
        style={{
          ...styles.cardImage,
          backgroundImage: `url(${property.image})`
        }}
        className="card-image"
      >
        {property.verified && (
          <div style={styles.verified}>✓</div>
        )}
        <div style={styles.statusBadge}>{property.status}</div>

        {user && isFirebaseProperty && (
          <button
            style={{
              ...styles.deleteBtn,
              opacity: deleting ? 0.5 : 1
            }}
            onClick={handleDelete}
            disabled={deleting}
            title="İlanı sil"
          >
            🗑️
          </button>
        )}
      </div>

      <div style={styles.cardContent}>
        {property.location && (
          <div style={styles.location}>
            <span style={styles.locationIcon}>📍</span>
            <span>{property.location}</span>
          </div>
        )}
        <h3 style={styles.cardTitle}>{property.title}</h3>

        <div style={styles.price}>
          <span style={styles.priceSymbol}>₺</span>
          {property.price.toLocaleString('tr-TR')}
        </div>

        <div style={styles.divider} />

        <div style={styles.cardFeatures}>
          {property.type && (
            <div style={styles.feature}>
              <span>🏢</span>
              <span>{property.type}</span>
            </div>
          )}
          {property.rooms && (
            <div style={styles.feature}>
              <span>🛏️</span>
              <span>{property.rooms}</span>
            </div>
          )}
          {property.area && (
            <div style={styles.feature}>
              <span>📏</span>
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    cursor: 'pointer',
    height: '100%',
    border: '1px solid #f1f5f9'
  },

  cardImage: {
    position: 'relative',
    height: '220px',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },

  verified: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    background: '#10b981',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },

  statusBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#f59e0b',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85em',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },

  deleteBtn: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    background: '#dc2626',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1em',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease'
  },

  cardContent: {
    padding: '18px 20px 20px'
  },

  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
    fontWeight: '500'
  },

  locationIcon: {
    fontSize: '12px',
    flexShrink: 0
  },

  cardTitle: {
    fontSize: '1em',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
    lineHeight: '1.45',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },

  price: {
    color: '#f59e0b',
    fontSize: '1.5em',
    fontWeight: '700',
    marginBottom: '14px',
    letterSpacing: '-0.02em'
  },

  priceSymbol: {
    fontSize: '0.65em',
    marginRight: '2px',
    fontWeight: '600'
  },

  divider: {
    height: '1px',
    background: '#f1f5f9',
    marginBottom: '14px'
  },

  cardFeatures: {
    display: 'flex',
    gap: '14px',
    color: '#64748b',
    fontSize: '0.82em',
    fontWeight: '500'
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
};

export default PropertyCard;
