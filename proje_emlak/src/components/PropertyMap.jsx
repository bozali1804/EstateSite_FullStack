import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet'in varsayılan marker ikonunu düzelt (Vite/webpack uyumu)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function PropertyMap({ location, title }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | found | notfound

  useEffect(() => {
    if (!location) {
      setStatus("notfound");
      return;
    }

    setStatus("loading");
    setCoords(null);

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ", Türkiye")}&format=json&limit=1`,
      {
        signal: controller.signal,
        headers: { "Accept-Language": "tr" }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setStatus("found");
        } else {
          setStatus("notfound");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("notfound");
      });

    return () => controller.abort();
  }, [location]);

  if (status === "loading") {
    return (
      <div style={styles.placeholder}>
        <span style={styles.placeholderText}>Harita yükleniyor...</span>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div style={styles.placeholder}>
        <span style={styles.placeholderText}>Konum bulunamadı</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={coords}
      zoom={15}
      style={styles.map}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={markerIcon}>
        <Popup>{title || location}</Popup>
      </Marker>
    </MapContainer>
  );
}

const styles = {
  map: {
    width: "100%",
    height: "300px",
    borderRadius: "10px",
    zIndex: 0,
  },
  placeholder: {
    width: "100%",
    height: "300px",
    borderRadius: "10px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
  },
  placeholderText: {
    color: "#94a3b8",
    fontSize: "14px",
  },
};

export default PropertyMap;
