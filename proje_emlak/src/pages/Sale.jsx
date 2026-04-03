import PropertySlider from '../components/PropertySlider';
import { useProperties } from '../hooks/useProperties';

function Sale() {
  const { saleProperties } = useProperties();

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Satılık İlanlar</h1>
        <p style={styles.heroSubtitle}>Hayalinizdeki evi bulun</p>
      </section>

      <PropertySlider
        properties={saleProperties}
        title="Öne Çıkan Satılık İlanlar"
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

export default Sale;
