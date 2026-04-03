import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";
import { useAuth } from "../context/AuthContext";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUD_NAME = "depfnf3et";
const UPLOAD_PRESET = "zhe5ugru";
const MAX_PHOTOS = 20;

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const { user } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Edit mode states
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImages, setEditImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  const property = properties.find(
    (p) => String(p.id) === String(id)
  );

  if (!property) {
    return (
      <div style={styles.notFound}>
        <h2>İlan bulunamadı</h2>
        <button onClick={() => navigate("/")} style={styles.backBtn}>Ana Sayfaya Dön</button>
      </div>
    );
  }

  const images = property.images || [property.image];
  const isFirebaseProperty = typeof property.id === "string";

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = async () => {
    if (!window.confirm(`"${property.title}" ilanını silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "properties", property.id));
      navigate("/");
    } catch (err) {
      alert("Silme hatası: " + err.message);
      setDeleting(false);
    }
  };

  // ---- Edit functions ----
  const startEdit = () => {
    setEditForm({
      title: property.title || "",
      price: property.price || "",
      location: property.location || "",
      rooms: property.rooms || "",
      area: property.area || "",
      status: property.status || "SATILIK",
      type: property.type || "Daire",
      description: property.description || ""
    });
    setEditImages([...images]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setEditing(true);
    setCurrentImage(0);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
    setEditImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setUploadProgress("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeExistingImage = (index) => {
    if (editImages.length + newImageFiles.length <= 1) {
      alert("En az 1 fotoğraf olmalıdır.");
      return;
    }
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }
    if (editImages.length + newImageFiles.length >= MAX_PHOTOS) {
      alert(`En fazla ${MAX_PHOTOS} fotoğraf ekleyebilirsiniz.`);
      return;
    }
    setNewImageFiles((prev) => [...prev, file]);
    setNewImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    if (editImages.length + newImageFiles.length <= 1) {
      alert("En az 1 fotoğraf olmalıdır.");
      return;
    }
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editImages.length) return;
    const updated = [...editImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEditImages(updated);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      let allImages = [...editImages];

      // Yeni fotoğrafları Cloudinary'ye yükle
      if (newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          setUploadProgress(`Fotoğraf yükleniyor (${i + 1}/${newImageFiles.length})...`);
          const url = await uploadToCloudinary(newImageFiles[i]);
          allImages.push(url);
        }
      }

      setUploadProgress("Kaydediliyor...");

      await updateDoc(doc(db, "properties", property.id), {
        title: editForm.title,
        price: Number(editForm.price),
        location: editForm.location,
        rooms: editForm.rooms,
        area: Number(editForm.area),
        status: editForm.status,
        type: editForm.type,
        description: editForm.description,
        image: allImages[0],
        images: allImages
      });

      setEditing(false);
      setUploadProgress("");
      setNewImageFiles([]);
      setNewImagePreviews([]);
    } catch (err) {
      alert("Güncelleme hatası: " + err.message);
      setUploadProgress("");
    } finally {
      setSaving(false);
    }
  };

  // ---- Render: Edit Mode ----
  if (editing) {
    const totalPhotos = editImages.length + newImagePreviews.length;
    return (
      <div style={styles.container} className="property-detail-container">
        <h2 style={{ marginBottom: '20px', color: '#333' }}>İlanı Düzenle</h2>

        {/* Edit Form */}
        <div style={styles.infoSection}>
          <div style={styles.editRow}>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Başlık</label>
              <input name="title" value={editForm.title} onChange={handleEditChange} style={styles.editInput} />
            </div>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Konum</label>
              <input name="location" value={editForm.location} onChange={handleEditChange} style={styles.editInput} />
            </div>
          </div>

          <div style={styles.editRow}>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Fiyat (₺)</label>
              <input name="price" type="number" value={editForm.price} onChange={handleEditChange} style={styles.editInput} />
            </div>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Alan (m²)</label>
              <input name="area" type="number" value={editForm.area} onChange={handleEditChange} style={styles.editInput} />
            </div>
          </div>

          <div style={styles.editRow}>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Durum</label>
              <select name="status" value={editForm.status} onChange={handleEditChange} style={styles.editInput}>
                <option value="SATILIK">Satılık</option>
                <option value="KİRALIK">Kiralık</option>
              </select>
            </div>
            <div style={styles.editGroup}>
              <label style={styles.editLabel}>Tür</label>
              <select name="type" value={editForm.type} onChange={handleEditChange} style={styles.editInput}>
                <option value="Daire">Daire</option>
                <option value="Ofis">Ofis</option>
                <option value="Arsa">Arsa</option>
                <option value="Dükkan">Dükkan</option>
              </select>
            </div>
          </div>

          <div style={styles.editGroup}>
            <label style={styles.editLabel}>Oda Sayısı</label>
            <input name="rooms" value={editForm.rooms} onChange={handleEditChange} style={{ ...styles.editInput, maxWidth: '200px' }} />
          </div>

          <div style={styles.editGroup}>
            <label style={styles.editLabel}>İlan Detayları</label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              style={{ ...styles.editInput, minHeight: '120px', resize: 'vertical' }}
              placeholder="İlan hakkında detaylı bilgi yazın..."
            />
          </div>
        </div>

        {/* Photo Management */}
        <div style={{ ...styles.infoSection, marginTop: '20px' }}>
          <label style={styles.editLabel}>Fotoğraflar ({totalPhotos}/{MAX_PHOTOS})</label>
          <div style={styles.editPhotoGrid}>
            {/* Existing images */}
            {editImages.map((img, index) => (
              <div key={`existing-${index}`} style={styles.editPhotoItem}>
                <img src={img} alt={`Fotoğraf ${index + 1}`} style={styles.editPhotoThumb} />
                <button type="button" onClick={() => removeExistingImage(index)} style={styles.editRemoveBtn}>X</button>
                {index === 0 && <div style={styles.editCoverBadge}>Kapak</div>}
                <div style={styles.moveButtons}>
                  {index > 0 && (
                    <button type="button" onClick={() => moveImage(index, -1)} style={styles.moveBtn}>←</button>
                  )}
                  {index < editImages.length - 1 && (
                    <button type="button" onClick={() => moveImage(index, 1)} style={styles.moveBtn}>→</button>
                  )}
                </div>
              </div>
            ))}

            {/* New images */}
            {newImagePreviews.map((preview, index) => (
              <div key={`new-${index}`} style={{ ...styles.editPhotoItem, border: '2px solid #2563eb' }}>
                <img src={preview} alt={`Yeni ${index + 1}`} style={styles.editPhotoThumb} />
                <button type="button" onClick={() => removeNewImage(index)} style={styles.editRemoveBtn}>X</button>
                <div style={{ ...styles.editCoverBadge, background: 'rgba(37,99,235,0.85)' }}>Yeni</div>
              </div>
            ))}

            {/* Add button */}
            {totalPhotos < MAX_PHOTOS && (
              <label style={styles.editAddBtn}>
                <input type="file" accept="image/*" onChange={addNewImage} style={{ display: 'none' }} />
                <span style={{ fontSize: '2em', lineHeight: 1 }}>+</span>
                <span style={{ fontSize: '0.85em' }}>Ekle</span>
              </label>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {uploadProgress && <div style={styles.progressText}>{uploadProgress}</div>}

        <div style={styles.editActions}>
          <button onClick={cancelEdit} style={styles.cancelBtn} disabled={saving}>
            İptal
          </button>
          <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    );
  }

  // ---- Render: View Mode ----
  return (
    <div style={styles.container} className="property-detail-container">
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Geri
      </button>

      {/* Fotoğraf Galerisi */}
      <div style={styles.gallery} className="property-detail-gallery">
        <div style={styles.mainImageContainer}>
          <img
            src={images[currentImage]}
            alt={`${property.title} - ${currentImage + 1}`}
            style={styles.mainImage}
          />

          {images.length > 1 && (
            <>
              <button onClick={prevImage} style={{ ...styles.navBtn, left: '10px' }}>
                ‹
              </button>
              <button onClick={nextImage} style={{ ...styles.navBtn, right: '10px' }}>
                ›
              </button>
              <div style={styles.imageCounter}>
                {currentImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div style={styles.thumbnails} className="property-detail-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  ...styles.thumbnail,
                  border: index === currentImage ? '3px solid #2563eb' : '3px solid transparent',
                  opacity: index === currentImage ? 1 : 0.6
                }}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* İlan Bilgileri */}
      <div style={styles.infoSection} className="property-detail-info">
        <div style={styles.header}>
          <h1 style={styles.title}>{property.title}</h1>
          <div style={styles.price}>
            <span style={styles.priceSymbol}>₺</span>
            {property.price.toLocaleString('tr-TR')}
          </div>
        </div>

        <div style={styles.badges}>
          <span style={styles.statusBadge}>{property.status}</span>
          <span style={styles.typeBadge}>{property.type}</span>
          {property.verified && <span style={styles.verifiedBadge}>✓ Onaylı</span>}
        </div>

        <div style={styles.details} className="property-detail-grid">
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Konum</span>
            <span style={styles.detailValue}>{property.location || "Belirtilmemiş"}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Oda Sayısı</span>
            <span style={styles.detailValue}>{property.rooms}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Alan</span>
            <span style={styles.detailValue}>{property.area} m²</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Tür</span>
            <span style={styles.detailValue}>{property.type}</span>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div style={styles.descriptionSection}>
            <h3 style={styles.descriptionTitle}>İlan Detayları</h3>
            <p style={styles.descriptionText}>{property.description}</p>
          </div>
        )}

        {/* Admin Actions */}
        {user && isFirebaseProperty && (
          <div style={styles.adminActions}>
            <button onClick={startEdit} style={styles.editBtn}>
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              style={{ ...styles.deleteBtn, opacity: deleting ? 0.5 : 1 }}
              disabled={deleting}
            >
              {deleting ? "Siliniyor..." : "İlanı Sil"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: '#666'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  notFound: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#666'
  },
  backBtn: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    color: '#333',
    marginBottom: '20px'
  },
  gallery: {
    marginBottom: '30px'
  },
  mainImageContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f3f4f6'
  },
  mainImage: {
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    display: 'block'
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    fontSize: '1.8em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },
  imageCounter: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.9em',
    fontWeight: '500'
  },
  thumbnails: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  thumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'opacity 0.2s'
  },
  infoSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  title: {
    fontSize: '1.6em',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  price: {
    color: '#f59e0b',
    fontSize: '1.8em',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  priceSymbol: {
    fontSize: '0.65em',
    marginRight: '2px'
  },
  badges: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  statusBadge: {
    background: '#f59e0b',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85em'
  },
  typeBadge: {
    background: '#2563eb',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85em'
  },
  verifiedBadge: {
    background: '#10b981',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85em'
  },
  details: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  detailItem: {
    background: '#f9fafb',
    padding: '16px',
    borderRadius: '8px'
  },
  detailLabel: {
    display: 'block',
    fontSize: '0.85em',
    color: '#666',
    marginBottom: '4px'
  },
  detailValue: {
    display: 'block',
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#333'
  },
  descriptionSection: {
    marginBottom: '24px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  descriptionTitle: {
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px'
  },
  descriptionText: {
    color: '#555',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap'
  },
  adminActions: {
    display: 'flex',
    gap: '12px'
  },
  editBtn: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteBtn: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // ---- Edit Mode Styles ----
  editRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  editGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px'
  },
  editLabel: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#333',
    fontSize: '0.95em'
  },
  editInput: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    boxSizing: 'border-box',
    outline: 'none',
    width: '100%'
  },
  editPhotoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  },
  editPhotoItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd',
    aspectRatio: '1'
  },
  editPhotoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  editRemoveBtn: {
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
  editCoverBadge: {
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
  moveButtons: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    display: 'flex',
    gap: '2px'
  },
  moveBtn: {
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '22px',
    height: '22px',
    fontSize: '0.7em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editAddBtn: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#666',
    cursor: 'pointer',
    aspectRatio: '1'
  },
  progressText: {
    textAlign: 'center',
    color: '#2563eb',
    marginTop: '16px',
    fontWeight: '500'
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '1em',
    cursor: 'pointer',
    color: '#333'
  },
  saveBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default PropertyDetail;
