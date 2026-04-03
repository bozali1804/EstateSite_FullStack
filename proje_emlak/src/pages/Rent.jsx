import PropertySlider from '../components/PropertySlider';
import { useProperties } from '../hooks/useProperties';

function ForRent() {
  const { rentProperties } = useProperties();

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Kiralık İlanlar</h1>
        <p style={styles.heroSubtitle}>Uygun fiyatlı kiralık seçenekler</p>
      </section>

      <PropertySlider
        properties={rentProperties}
        title="Öne Çıkan Kiralık İlanlar"
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb'
  },
  hero: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    padding: '60px 20px',
    textAlign: 'center',
    color: 'white'
  },
  heroTitle: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  heroSubtitle: {
    fontSize: '1.1em',
    opacity: 0.9
  }
};

export default ForRent;
