import PropertySlider from '../components/PropertySlider';
import { useProperties } from '../hooks/useProperties';

function Office() {
  const { ofisProperties } = useProperties();

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Ofis İlanları</h1>
        <p style={styles.heroSubtitle}>İş yeriniz için en uygun ofisleri keşfedin</p>
      </section>

      <PropertySlider
        properties={ofisProperties}
        title="Öne Çıkan Ofis İlanları"
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
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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

export default Office;
