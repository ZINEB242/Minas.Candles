import { useEffect, useState } from "react";

import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import PostCard from "../../components/community/PostCard";

import "./Home.css";

const API_URL = "http://localhost:3000";
const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const postTypes = [
  { value: "photo", label: "Photo / Vidéo", icon: "▧" },
  { value: "atelier", label: "Atelier", icon: "♧" },
  { value: "evenement", label: "Événement", icon: "▦" },
  { value: "produit", label: "Produit", icon: "◇" },
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [activeFilter, setActiveFilter] = useState("tout");

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("minasToken");
  const savedUser = localStorage.getItem("minasUser");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger les publications."
        );
      }

      setPosts(data.posts || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCategoryClick = (value) => {
    setSelectedType((current) =>
      current === value ? null : value
    );
    setMessage("");
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    setMessage("");

    if (images.length + files.length > MAX_IMAGES) {
      setMessage(`Tu peux ajouter ${MAX_IMAGES} photos maximum.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setMessage(`${file.name} n'est pas une image.`);
        return false;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setMessage(`${file.name} dépasse la limite de 2 Mo.`);
        return false;
      }

      return true;
    });

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                name: file.name,
                data: reader.result,
              });
            };

            reader.onerror = () =>
              reject(new Error(`Impossible de lire ${file.name}.`));

            reader.readAsDataURL(file);
          })
      )
    )
      .then((newImages) => {
        setImages((current) => [
          ...current,
          ...newImages,
        ].slice(0, MAX_IMAGES));
      })
      .catch((err) => setMessage(err.message));
  };

  const removeImage = (id) => {
    setImages((current) =>
      current.filter((image) => image.id !== id)
    );
  };

  const resetForm = () => {
    setSelectedType(null);
    setContent("");
    setImages([]);
    setProductName("");
    setProductPrice("");
    setMessage("");
  };

  const handlePublish = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!token || !user) {
      setMessage("Connecte-toi pour publier.");
      return;
    }

    if (!selectedType) {
      setMessage("Choisis une catégorie.");
      return;
    }

    if (!content.trim()) {
      setMessage("Écris un texte avant de publier.");
      return;
    }

    if (selectedType === "produit") {
      if (!productName.trim()) {
        setMessage("Ajoute le nom du produit.");
        return;
      }

      if (
        productPrice === "" ||
        !Number.isFinite(Number(productPrice)) ||
        Number(productPrice) < 0
      ) {
        setMessage("Indique un prix valide en DA.");
        return;
      }
    }

    setPublishing(true);

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          type: selectedType,

          // Nouveau format : plusieurs photos.
          images: images.map((image) => image.data),

          // Compatibilité avec l'ancien format.
          image: images[0]?.data || "",

          productName:
            selectedType === "produit"
              ? productName.trim()
              : "",
          productPrice:
            selectedType === "produit"
              ? Number(productPrice)
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de publier."
        );
      }

      setPosts((current) => [
        data.post,
        ...current,
      ]);

      resetForm();
    } catch (err) {
      setMessage(err.message || "Une erreur est survenue.");
    } finally {
      setPublishing(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "tout") return true;
    return post.type === activeFilter;
  });

  return (
    <main className="home-page">
      <LeftSidebar />

      <section className="news-feed">
        {/* Zone de partage */}
        
<div className="share-card">
  <div className="share-header">
    <div className="share-avatar">
      {user?.name
        ? user.name.charAt(0).toUpperCase()
        : "M"}
    </div>

    <button
      type="button"
      className="share-open-button"
      onClick={() => handleCategoryClick("photo")}
    >
      Que voulez-vous partager aujourd'hui ?
    </button>
  </div>

  <div className="share-options">
    {postTypes.map((item) => (
      <button
        key={item.value}
        type="button"
        className={
          selectedType === item.value ? "active" : ""
        }
        aria-pressed={selectedType === item.value}
        onClick={() => handleCategoryClick(item.value)}
      >
        <span className={`share-option-icon icon-${item.value}`}>
          {item.icon}
        </span>
        {item.label}
      </button>
    ))}
  </div>

 {selectedType && (
  <form className="share-form" onSubmit={handlePublish}>
    <textarea
      value={content}
      onChange={(event) => setContent(event.target.value)}
      placeholder="Que voulez-vous partager aujourd'hui ?"
      maxLength={3000}
      rows={3}
      required
      aria-label="Texte de la publication"
    />

    {selectedType === "produit" && (
      <div className="product-fields">
        <label>
          Nom du produit
          <input
            type="text"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="Ex. Bougie parfumée"
            required
          />
        </label>

        <label>
          Prix (DA)
          <input
            type="number"
            min="0"
            value={productPrice}
            onChange={(event) => setProductPrice(event.target.value)}
            placeholder="Ex. 2500"
            required
          />
        </label>
      </div>
    )}

   <div className="share-upload-label">
  <label className="share-file-button">
    <span className="share-file-icon">＋</span>
    Ajouter des photos
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImagesChange}
    />
  </label>

  <small>{images.length}/10 photos sélectionnées</small>
</div>

    {images.length > 0 && (
      <div className="share-gallery-preview">
        {images.map((image) => (
          <div className="share-preview-item" key={image.id}>
            <img src={image.data} alt={image.name} />
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              aria-label={`Supprimer ${image.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}

    {message && (
      <p className="share-message" role="alert">
        {message}
      </p>
    )}

    <div className="share-form-actions">
      <button type="button" onClick={resetForm}>
        Annuler
      </button>

      <button type="submit" disabled={publishing}>
        {publishing ? "Publication..." : "Publier"}
      </button>
    </div>
  </form>
)}
</div>


        {/* Filtres du fil */}
        <nav className="feed-filters" aria-label="Filtrer les publications">
          {[
            { value: "tout", label: "Tout" },
            { value: "photo", label: "Publications" },
            { value: "atelier", label: "Ateliers" },
            { value: "evenement", label: "Événements" },
            { value: "produit", label: "Produits" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                activeFilter === filter.value ? "active" : ""
              }
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </nav>

        {!token && (
          <p>
            Connecte-toi pour partager tes créations avec la communauté.
          </p>
        )}

        {loading && <p>Chargement des publications...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && filteredPosts.length === 0 && (
          <p className="empty-feed">
            Aucune publication pour le moment.
          </p>
        )}

        {!error &&
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={{
                ...post,
                images:
                  post.images?.length > 0
                    ? post.images
                    : post.image
                      ? [post.image]
                      : [],
                author:
                  typeof post.author === "object"
                    ? post.author?.name || "Minas Candles"
                    : "Minas Candles",
                time: post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString(
                      "fr-FR"
                    )
                  : "",
                likes: post.likes || 0,
                shares: post.shares || 0,
                comments: post.comments || 0,
              }}
            />
          ))}
      </section>

      <RightSidebar />
    </main>
  );
};

export default Home;