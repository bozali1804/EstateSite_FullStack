import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

function useVisibleCards() {
  const getCount = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const handleResize = () => setCount(getCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return count;
}

function PropertySlider({ properties, title = "Öne Çıkan İlanlar" }) {
  const visibleCards = useVisibleCards();
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxSlide = Math.max(0, properties.length - visibleCards);

  // Reset currentSlide if it exceeds new maxSlide after resize
  useEffect(() => {
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [visibleCards, maxSlide, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(Math.max(0, Math.min(index, maxSlide)));
  };

  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={styles.sliderContainer} className="slider-container">
      {title && (
        <div style={styles.titleRow}>
          <div style={styles.titleAccent} />
          <h2 style={styles.title} className="slider-title">{title}</h2>
        </div>
      )}

      <div style={styles.sliderWrapper}>
        <div
          style={{
            ...styles.sliderTrack,
            transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`
          }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              style={{ ...styles.slideItem, minWidth: `${100 / visibleCards}%` }}
              className="slide-item"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.controls}>
        <button
          style={{
            ...styles.controlBtn,
            opacity: currentSlide === 0 ? 0.3 : 1,
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
          }}
          className="slider-control-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Önceki"
        >
          ←
        </button>

        <div style={styles.dots}>
          {[...Array(maxSlide + 1)].map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.dot,
                ...(index === currentSlide ? styles.dotActive : {})
              }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <button
          style={{
            ...styles.controlBtn,
            opacity: currentSlide >= maxSlide ? 0.3 : 1,
            cursor: currentSlide >= maxSlide ? 'not-allowed' : 'pointer'
          }}
          className="slider-control-btn"
          onClick={nextSlide}
          disabled={currentSlide >= maxSlide}
          aria-label="Sonraki"
        >
          →
        </button>
      </div>
    </div>
  );
}

const styles = {
  sliderContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px'
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px'
  },

  titleAccent: {
    width: '4px',
    height: '26px',
    background: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
    borderRadius: '2px',
    flexShrink: 0
  },

  title: {
    fontSize: '1.5em',
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: '-0.02em'
  },

  sliderWrapper: {
    overflow: 'hidden',
    borderRadius: '12px',
    position: 'relative'
  },

  sliderTrack: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    gap: '0'
  },

  slideItem: {
    padding: '0 10px',
    boxSizing: 'border-box'
  },

  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '30px'
  },

  controlBtn: {
    background: 'white',
    border: '2px solid #ddd',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '1.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontWeight: 'bold',
    color: '#333'
  },

  dots: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },

  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#ddd',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  dotActive: {
    background: '#2563eb',
    width: '35px',
    borderRadius: '6px'
  }
};

export default PropertySlider;
