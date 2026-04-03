import PropertySlider from '../components/PropertySlider';
import { useProperties } from '../hooks/useProperties';

function Land() {
  const { arsaProperties } = useProperties();

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Arsa İlanları</h1>
        <p style={styles.heroSubtitle}>Yatırım fırsatlarını değerlendirin</p>
      </section>

      <PropertySlider
        properties={arsaProperties}
        title="Öne Çıkan Arsa İlanları"
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
    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
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

export default Land;
