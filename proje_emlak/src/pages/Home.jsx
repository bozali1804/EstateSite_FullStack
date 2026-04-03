import { Link } from "react-router-dom";
import PropertySlider from '../components/PropertySlider';
import { useProperties } from '../hooks/useProperties';

function Home() {
  const { properties, daireProperties, ofisProperties, arsaProperties, loading } = useProperties();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 20px' }}>Yükleniyor...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero} className="hero-section">
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle} className="hero-title">
            Hayalinizdeki Evi Bulun
          </h1>
        </div>
      </section>

      {/* Featured Properties Slider */}
      <PropertySlider
        properties={properties}
        title="Öne Çıkan İlanlar"
      />

      {/* Daire Slider */}
      {daireProperties.length > 0 && (
        <PropertySlider
          properties={daireProperties}
          title="Öne Çıkan Daire İlanları"
        />
      )}

      {/* Ofis Slider */}
      {ofisProperties.length > 0 && (
        <PropertySlider
          properties={ofisProperties}
          title="Öne Çıkan Ofis İlanları"
        />
      )}

      {/* Arsa Slider */}
      {arsaProperties.length > 0 && (
        <PropertySlider
          properties={arsaProperties}
          title="Öne Çıkan Arsa İlanları"
        />
      )}

      {/* Stats Section
      <section style={styles.stats}>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>500+</div>
          <div style={styles.statLabel}>Aktif İlan</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>1000+</div>
          <div style={styles.statLabel}>Mutlu Müşteri</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>15+</div>
          <div style={styles.statLabel}>Yıllık Tecrübe</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>50+</div>
          <div style={styles.statLabel}>Emlak Danışmanı</div>
        </div>
      </section> */}

      {/* Categories Section */}
      <section style={styles.categories}>
        <h2 style={styles.categoriesTitle} className="categories-title">Kategoriler</h2>
        <div style={styles.categoryGrid} className="category-grid">
          <Link to="/sale" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={styles.categoryIcon} className="category-icon">🏠</div>
            <h3 style={styles.categoryName}>Satılık</h3>
            <p style={styles.categoryDesc}>Hayalinizdeki evi bulun</p>
          </Link>
          <Link to="/rent" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={styles.categoryIcon} className="category-icon">🔑</div>
            <h3 style={styles.categoryName}>Kiralık</h3>
            <p style={styles.categoryDesc}>Uygun fiyatlı kiralık evler</p>
          </Link>
          <Link to="/land" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={styles.categoryIcon} className="category-icon">🏗️</div>
            <h3 style={styles.categoryName}>Arsa</h3>
            <p style={styles.categoryDesc}>Yatırım fırsatları</p>
          </Link>
          <Link to="/office" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={styles.categoryIcon} className="category-icon">🏢</div>
            <h3 style={styles.categoryName}>Ofis</h3>
            <p style={styles.categoryDesc}>İş yeriniz için ofisler</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb'
  },

  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '100px 20px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '60px'
  },

  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },

  heroTitle: {
    fontSize: '3em',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2'
  },

  heroSubtitle: {
    fontSize: '1.3em',
    opacity: 0.95,
    lineHeight: '1.6'
  },

  stats: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px',
    textAlign: 'center'
  },

  statItem: {
    padding: '30px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease'
  },

  statNumber: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '10px'
  },

  statLabel: {
    fontSize: '1.1em',
    color: '#666'
  },

  categories: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px'
  },

  categoriesTitle: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '50px',
    color: '#333'
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px'
  },

  categoryCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },

  categoryIcon: {
    fontSize: '4em',
    marginBottom: '20px'
  },

  categoryName: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  },

  categoryDesc: {
    color: '#666',
    fontSize: '1em'
  }
};

export default Home;
