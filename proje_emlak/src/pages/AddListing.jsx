import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const CLOUD_NAME = "depfnf3et";
const UPLOAD_PRESET = "zhe5ugru";
const MAX_PHOTOS = 20;

function AddListing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    status: "SATILIK",
    type: "Daire",
    rooms: "",
    area: "",
    location: "",
    description: "",
    verified: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin (jpg, png, webp...)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    if (imageFiles.length >= MAX_PHOTOS) {
      alert(`En fazla ${MAX_PHOTOS} fotoğraf ekleyebilirsiniz.`);
      return;
    }

    setImageFiles((prev) => [...prev, file]);
    setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Fotoğraf yüklenemedi");
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Lütfen en az bir fotoğraf seçin.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Tüm fotoğrafları Cloudinary'ye yükle
      const imageURLs = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(`Fotoğraf yükleniyor (${i + 1}/${imageFiles.length})...`);
        const url = await uploadToCloudinary(imageFiles[i]);
        imageURLs.push(url);
      }

      setUploadProgress("İlan kaydediliyor...");

      // Firestore'a ilanı kaydet
      await addDoc(collection(db, "properties"), {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        image: imageURLs[0],
        images: imageURLs,
        createdAt: new Date(),
        createdBy: user.email
      });

      setSuccess(true);
      setUploadProgress("");
      setImageFiles([]);
      setImagePreviews([]);
      setForm({
        title: "",
        price: "",
        status: "SATILIK",
        type: "Daire",
        rooms: "",
        area: "",
        location: "",
        description: "",
        verified: true
      });
    } catch (err) {
      alert("İlan eklenirken hata oluştu: " + err.message);
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="add-listing-container">
      <h1 style={styles.title} className="add-listing-title">Yeni İlan Ekle</h1>

      {success && (
        <div style={styles.success}>İlan başarıyla eklendi!</div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>İlan Başlığı</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="Örn: Kadıköy Merkez"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Konum</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              style={styles.input}
              placeholder="Örn: Kadıköy, İstanbul"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Fiyat (₺)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              style={styles.input}
              placeholder="Örn: 5000000"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Alan (m²)</label>
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleChange}
              style={styles.input}
              placeholder="Örn: 120"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>İlan Durumu</label>
            <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
              <option value="SATILIK">Satılık</option>
              <option value="KİRALIK">Kiralık</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tür</label>
            <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
              <option value="Daire">Daire</option>
              <option value="Ofis">Ofis</option>
              <option value="Arsa">Arsa</option>
              <option value="Dükkan">Dükkan</option>
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Oda Sayısı</label>
          <input
            type="text"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            style={{ ...styles.input, maxWidth: '200px' }}
            placeholder="Örn: 3+1"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>İlan Detayları</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
            placeholder="İlan hakkında detaylı bilgi yazın..."
          />
        </div>

        <div style={styles.photoSection}>
          <label style={styles.label}>Fotoğraflar ({imagePreviews.length}/{MAX_PHOTOS})</label>
          <div style={styles.photoGrid}>
            {imagePreviews.map((preview, index) => (
              <div key={index} style={styles.photoItem}>
                <img src={preview} alt={`Fotoğraf ${index + 1}`} style={styles.photoThumb} />
                <button type="button" onClick={() => removeImage(index)} style={styles.removeBtn}>
                  X
                </button>
                {index === 0 && <div style={styles.coverBadge}>Kapak</div>}
              </div>
            ))}

            {imageFiles.length < MAX_PHOTOS && (
              <label style={styles.addPhotoBtn}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <span style={{ fontSize: "2em", lineHeight: 1 }}>+</span>
                <span style={{ fontSize: "0.85em" }}>Ekle</span>
              </label>
            )}
          </div>
        </div>

        {uploadProgress && (
          <div style={styles.progressText}>{uploadProgress}</div>
        )}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Yükleniyor..." : "İlan Ekle"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px'
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '24px',
    textAlign: 'center'
  },
  success: {
    background: '#f0fdf4',
    color: '#16a34a',
    padding: '14px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '500'
  },
  form: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px'
  },
  label: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#333',
    fontSize: '0.95em'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    boxSizing: 'border-box',
    outline: 'none',
    width: '100%'
  },
  photoSection: {
    marginBottom: '20px'
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
    marginTop: '8px'
  },
  photoItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd',
    aspectRatio: '1'
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  removeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    fontSize: '0.75em',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  coverBadge: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(37, 99, 235, 0.85)',
    color: 'white',
    textAlign: 'center',
    fontSize: '0.7em',
    padding: '2px 0',
    fontWeight: '600'
  },
  addPhotoBtn: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#666',
    cursor: 'pointer',
    aspectRatio: '1',
    transition: 'border-color 0.2s'
  },
  progressText: {
    textAlign: 'center',
    color: '#2563eb',
    marginBottom: '12px',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default AddListing;
