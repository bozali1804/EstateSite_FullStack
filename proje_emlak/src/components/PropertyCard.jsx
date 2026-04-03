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
    <div style={styles.card} onClick={() => navigate(`/property/${property.id}`)}>
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
        <h3 style={styles.cardTitle}>{property.title}</h3>

        <div style={styles.price}>
          <span style={styles.priceSymbol}>₺</span>
          {property.price.toLocaleString('tr-TR')}
        </div>

        <div style={styles.cardFeatures}>
          <div style={styles.feature}>
            <span>🏢</span>
            <span>{property.type}</span>
          </div>
          <div style={styles.feature}>
            <span>🛏️</span>
            <span>{property.rooms}</span>
          </div>
          <div style={styles.feature}>
            <span>📏</span>
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    height: '100%'
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
    padding: '20px'
  },

  cardTitle: {
    fontSize: '1.1em',
    color: '#333',
    marginBottom: '15px',
    minHeight: '50px',
    lineHeight: '1.4'
  },

  price: {
    color: '#f59e0b',
    fontSize: '1.6em',
    fontWeight: 'bold',
    marginBottom: '15px'
  },

  priceSymbol: {
    fontSize: '0.7em',
    marginRight: '2px'
  },

  cardFeatures: {
    display: 'flex',
    gap: '15px',
    color: '#666',
    fontSize: '0.9em'
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  }
};

export default PropertyCard;
