
import { useEffect, useState } from "react";

import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";

import "./PostCard.css";

const API_URL = "http://localhost:3000";

const PostCard = ({ post }) => {
  const token = localStorage.getItem("minasToken");
  const savedUser = localStorage.getItem("minasUser");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const userId = user?.id || user?._id;

  const [liked, setLiked] = useState(
    Boolean(
      userId &&
        post.likedBy?.some(
          (id) => String(id?._id || id) === String(userId)
        )
    )
  );

  const [likes, setLikes] = useState(
    post.likedBy?.length ?? post.likes ?? 0
  );

  const [liking, setLiking] = useState(false);
  const [likeError, setLikeError] = useState("");

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [shares, setShares] = useState(post.shares || 0);
  const [saved, setSaved] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!token || !userId || !post._id) {
      setSaved(false);
      return;
    }

    const fetchSavedStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/saved-ids`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSaved(
            (data.savedPostIds || []).some(
              (id) => String(id) === String(post._id)
            )
          );
        }
      } catch (error) {
        console.error(
          "Erreur de chargement des publications enregistrées :",
          error
        );
      }
    };

    fetchSavedStatus();
  }, [token, userId, post._id]);

  useEffect(() => {
    setLikes(post.likedBy?.length ?? post.likes ?? 0);

    setLiked(
      Boolean(
        userId &&
          post.likedBy?.some(
            (id) => String(id?._id || id) === String(userId)
          )
      )
    );
  }, [post._id, post.likedBy, post.likes, userId]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentError("");

      try {
        const response = await fetch(
          `${API_URL}/api/posts/${post._id}/comments`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Impossible de charger les commentaires."
          );
        }

        setComments(data.comments || []);
      } catch (error) {
        setCommentError(
          error.message || "Erreur de chargement des commentaires."
        );
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [post._id]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedImage]);

  const handleSavePost = async () => {
    if (!token || savingPost) return;

    setSavingPost(true);

    try {
      const response = await fetch(`${API_URL}/api/posts/${post._id}/save`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Impossible d'enregistrer la publication."
        );
      }

      setSaved(data.saved);
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      alert(error.message || "Une erreur est survenue.");
    } finally {
      setSavingPost(false);
    }
  };

  const handleLike = async () => {
    if (!token || !userId) {
      setLikeError("Connecte-toi pour aimer cette publication.");
      return;
    }

    if (liking) return;

    setLiking(true);
    setLikeError("");

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${post._id}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le like.");
      }

      setLiked(data.liked);
      setLikes(data.likes);
    } catch (error) {
      setLikeError(error.message || "Une erreur est survenue.");
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!token || !userId) {
      setCommentError("Connecte-toi pour publier un commentaire.");
      return;
    }

    if (!comment.trim() || commentSubmitting) return;

    setCommentSubmitting(true);
    setCommentError("");

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: comment.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Impossible de publier le commentaire."
        );
      }

      setComments(data.comments || []);
      setComment("");
    } catch (error) {
      setCommentError(error.message || "Une erreur est survenue.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Minas Candles",
          text: post.content,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setLikeError("Lien copié ! Tu peux le partager.");
      } else {
        setLikeError("Le partage n'est pas disponible sur ce navigateur.");
        return;
      }

      setShares((previous) => previous + 1);
    } catch (error) {
      if (error.name !== "AbortError") {
        setLikeError("Impossible de partager cette publication.");
      }
    }
  };

  const postImages =
    post.images?.length > 0
      ? post.images
      : post.image
        ? [post.image]
        : [];

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {(post.author || "M").charAt(0).toUpperCase()}
        </div>

        <div className="post-author">
          <strong>{post.author || "Membre Minas Candles"}</strong>
          <small>{post.time}</small>
        </div>

        <div className="post-menu-container">
          <button
            type="button"
            className="post-menu"
            aria-label="Options de la publication"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((previous) => !previous)}
          >
            <FaEllipsisH />
          </button>

          {showMenu && (
            <div className="post-menu-dropdown">
              <button
                type="button"
                disabled={savingPost}
                onClick={async () => {
                  await handleSavePost();
                  setShowMenu(false);
                }}
              >
                <FaBookmark />
                {savingPost
                  ? "Enregistrement..."
                  : saved
                    ? "Retirer des enregistrements"
                    : "Enregistrer"}
              </button>

              <button
                type="button"
                onClick={() => setShowMenu(false)}
              >
                Signaler la publication
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Galerie de la publication */}
      {postImages.length > 0 && (
        <div
          className={`post-gallery post-gallery-count-${Math.min(
            postImages.length,
            4
          )}`}
        >
          {postImages.slice(0, 4).map((image, index) => (
            <div className="post-gallery-item" key={index}>
              <button
                type="button"
                className="post-gallery-image-button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Agrandir la photo ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Photo ${index + 1} de la publication`}
                  loading="lazy"
                />
              </button>

              {index === 3 && postImages.length > 4 && (
                <span className="post-gallery-more">
                  +{postImages.length - 4}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fenêtre de photo agrandie */}
      {selectedImage && (
        <div
          className="post-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo agrandie"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="post-image-modal-close"
            aria-label="Fermer la photo"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <img
            className="post-image-modal-content"
            src={selectedImage}
            alt="Photo agrandie de la publication"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {/* Carte produit avec prix et commande */}
      {post.type === "produit" && (
        <div className="post-product">
          <div className="post-product-info">
            <strong>
              {post.productName ||
                post.product?.name ||
                "Produit Minas Candles"}
            </strong>

            {(post.productPrice ?? post.product?.price) != null && (
              <span>
                {Number(
                  post.productPrice ?? post.product?.price
                ).toLocaleString("fr-FR")}{" "}
                DA
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (post._id) {
                window.location.href =
                  `/commande?productId=${encodeURIComponent(post._id)}`;
              }
            }}
          >
            Commander
          </button>
        </div>
      )}

      {post.product?.name && (
        <div className="post-product">
          <div>
            <strong>{post.product.name}</strong>
            <span>{post.product.price} DA</span>
          </div>
          <button type="button">Commander</button>
        </div>
      )}

      <div className="post-stats">
        <span>❤️ {likes}</span>
        <span>{comments.length} commentaires</span>
        <span>{shares} partages</span>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={liked ? "liked" : ""}
          onClick={handleLike}
          disabled={liking}
        >
          <FaHeart />
          {liking ? "..." : "J'aime"}
        </button>

        <button
          type="button"
          onClick={() => setShowComments((previous) => !previous)}
        >
          <FaComment />
          Commenter
        </button>

        <button type="button" onClick={handleShare}>
          <FaShare />
          Partager
        </button>

        <button
          type="button"
          className={saved ? "saved" : ""}
          disabled={savingPost}
          onClick={handleSavePost}
        >
          <FaBookmark />
          {savingPost
            ? "Enregistrement..."
            : saved
              ? "Enregistré"
              : "Enregistrer"}
        </button>
      </div>

      {likeError && (
        <p className="post-feedback" role="status">
          {likeError}
        </p>
      )}

      {showComments && (
        <div className="comments-section">
          <div className="comment-form">
            <input
              type="text"
              placeholder="Écrire un commentaire..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleComment();
                }
              }}
            />

            <button
              type="button"
              onClick={handleComment}
              disabled={commentSubmitting}
            >
              {commentSubmitting ? "Publication..." : "Publier"}
            </button>
          </div>

          {commentError && (
            <p className="post-feedback" role="alert">
              {commentError}
            </p>
          )}

          <div className="comments-list">
            {commentsLoading && <p>Chargement des commentaires...</p>}

            {!commentsLoading &&
              comments.map((item) => (
                <div className="comment" key={item._id}>
                  <div className="comment-avatar">
                    {(item.user?.name || "M").charAt(0).toUpperCase()}
                  </div>

                  <div className="comment-content">
                    <strong>
                      {item.user?.name || "Membre Minas Candles"}
                    </strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;