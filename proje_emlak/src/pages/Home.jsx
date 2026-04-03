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
          <div style={styles.heroBadge}>Güvenilir Emlak Çözümleri</div>
          <h1 style={styles.heroTitle} className="hero-title">
            Hayalinizdeki Evi Bulun
          </h1>
          <p style={styles.heroSubtitle}>
            Satılık, kiralık, arsa ve ofis ilanları için doğru adres
          </p>
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
        <div style={styles.sectionHeader}>
          <div style={styles.sectionLine} />
          <h2 style={styles.categoriesTitle} className="categories-title">Kategoriler</h2>
        </div>
        <div style={styles.categoryGrid} className="category-grid">
          <Link to="/sale" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={{...styles.categoryIconWrap, background: '#eff6ff'}}>
              <div style={styles.categoryIcon} className="category-icon">🏠</div>
            </div>
            <h3 style={styles.categoryName}>Satılık</h3>
            <p style={styles.categoryDesc}>Hayalinizdeki evi bulun</p>
          </Link>
          <Link to="/rent" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={{...styles.categoryIconWrap, background: '#f0fdf4'}}>
              <div style={styles.categoryIcon} className="category-icon">🔑</div>
            </div>
            <h3 style={styles.categoryName}>Kiralık</h3>
            <p style={styles.categoryDesc}>Uygun fiyatlı kiralık evler</p>
          </Link>
          <Link to="/land" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={{...styles.categoryIconWrap, background: '#fffbeb'}}>
              <div style={styles.categoryIcon} className="category-icon">🏗️</div>
            </div>
            <h3 style={styles.categoryName}>Arsa</h3>
            <p style={styles.categoryDesc}>Yatırım fırsatları</p>
          </Link>
          <Link to="/office" style={{...styles.categoryCard, textDecoration: 'none', color: 'inherit'}} className="category-card">
            <div style={{...styles.categoryIconWrap, background: '#fdf4ff'}}>
              <div style={styles.categoryIcon} className="category-icon">🏢</div>
            </div>
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
    background: '#f8fafc'
  },

  hero: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
    padding: '90px 20px 100px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '0',
    position: 'relative',
    overflow: 'hidden'
  },

  heroContent: {
    maxWidth: '720px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },

  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '100px',
    padding: '6px 18px',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.03em',
    marginBottom: '20px',
    color: 'rgba(255,255,255,0.95)'
  },

  heroTitle: {
    fontSize: '3.2em',
    fontWeight: '800',
    marginBottom: '16px',
    lineHeight: '1.15',
    letterSpacing: '-0.02em'
  },

  heroSubtitle: {
    fontSize: '1.15em',
    opacity: 0.85,
    lineHeight: '1.7',
    maxWidth: '480px',
    margin: '0 auto'
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
    maxWidth: '1100px',
    margin: '60px auto',
    padding: '0 24px'
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '32px'
  },

  sectionLine: {
    width: '4px',
    height: '28px',
    background: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
    borderRadius: '2px',
    flexShrink: 0
  },

  categoriesTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: '-0.02em'
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },

  categoryCard: {
    background: 'white',
    padding: '32px 24px',
    borderRadius: '14px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    cursor: 'pointer'
  },

  categoryIconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },

  categoryIcon: {
    fontSize: '2em'
  },

  categoryName: {
    fontSize: '1.1em',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px'
  },

  categoryDesc: {
    color: '#64748b',
    fontSize: '0.875em',
    lineHeight: '1.5'
  }
};

export default Home;
