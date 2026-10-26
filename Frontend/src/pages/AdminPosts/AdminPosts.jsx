
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaClipboardList,
  FaTrash,
} from "react-icons/fa";import "./AdminPosts.css";

const API_URL = "http://localhost:3000";

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const token = localStorage.getItem("minasToken");
  let user = null;

  try {
    const savedUser = localStorage.getItem("minasUser");
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const fetchPendingPosts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/posts/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger les publications."
        );
      }

      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

const fetchApprovedPosts = async () => {
  try {
    const token = localStorage.getItem("minasToken");

    const response = await fetch(`${API_URL}/api/admin/posts/approved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de récupérer les publications approuvées."
      );
    }

    setApprovedPosts(data.posts || []);
  } catch (err) {
    console.error(
      "Erreur de récupération des publications approuvées :",
      err
    );
  }
};

useEffect(() => {
  if (token && user?.role === "admin") {
    fetchPendingPosts();
    fetchApprovedPosts();
  } else {
    setLoading(false);
  }
}, []);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const moderatePost = async (postId, status) => {
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason = window.prompt(
        "Indique le motif du rejet de cette publication :"
      );

      if (rejectionReason === null) {
        return;
      }

      rejectionReason = rejectionReason.trim();

      if (!rejectionReason) {
        alert("Merci de préciser le motif du rejet.");
        return;
      }

      if (rejectionReason.length > 1000) {
        alert("Le motif ne doit pas dépasser 1000 caractères.");
        return;
      }
    }

    setUpdatingId(postId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/posts/${postId}/moderation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, rejectionReason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "La modération a échoué.");
      }

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== postId)
      );
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setUpdatingId("");
    }
  };

const deletePost = async (postId) => {
  const confirmed = window.confirm(
    "Voulez-vous vraiment supprimer définitivement cette publication ?"
  );

  if (!confirmed) return;

  try {
    setUpdatingId(postId);

    const token = localStorage.getItem("minasToken");

    const response = await fetch(`${API_URL}/api/admin/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Impossible de supprimer la publication.");
    }

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId)
    );

    setApprovedPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId)
    );

    alert("Publication supprimée avec succès.");
  } catch (err) {
    alert(err.message || "Une erreur est survenue lors de la suppression.");
  } finally {
    setUpdatingId(null);
  }
};

  return (
    <main className="admin-posts-page">
      <header className="admin-posts-header">
        <div>
          <p className="admin-posts-eyebrow">MINAS CANDLES · ADMINISTRATION</p>
          <h1>Gestion des publications</h1>
          <p>
            Consulte les publications en attente et décide de leur approbation.
          </p>
        </div>

        <FaClipboardList className="admin-posts-header-icon" />
      </header>

      <section className="admin-posts-section">
        <div className="admin-posts-heading">
          <div>
            <h2>Publications en attente</h2>
            <p>
              {posts.length} publication(s) à examiner
            </p>
          </div>

          <button
            type="button"
            className="admin-posts-refresh"
            onClick={() => fetchPendingPosts(true)}
            disabled={refreshing || loading}
          >
            <FaSyncAlt />
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
        </div>

        {error && (
          <p className="admin-posts-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-posts-message">
            Chargement des publications...
          </p>
        ) : posts.length === 0 ? (
          <div className="admin-posts-empty">
            <FaClipboardList />
            <h3>Aucune publication en attente</h3>
            <p>Les nouvelles publications à modérer apparaîtront ici.</p>
          </div>
        ) : (
          <div className="admin-posts-list">
            {posts.map((post) => (
              <article className="admin-post-card" key={post._id}>
                <div className="admin-post-card-header">
                  <div>
                    <h3>{post.title || "Nouvelle publication"}</h3>
                    <p>
                      Par {post.author?.name || "Utilisateur"}
                    </p>
                  </div>

                  <span className="admin-post-pending">
                    En attente
                  </span>
                </div>

                <p className="admin-post-content">{post.content}</p>

                {post.image && (
                  <img
                    className="admin-post-image"
                    src={post.image}
                    alt="Illustration de la publication"
                  />
                )}

                <div className="admin-post-actions">
                  <button
                    type="button"
                    className="admin-post-approve"
                    onClick={() => moderatePost(post._id, "approved")}
                    disabled={updatingId === post._id}
                  >
                    <FaCheck />
                    {updatingId === post._id
                      ? "Traitement..."
                      : "Approuver"}
                  </button>

                  <button
                    type="button"
                    className="admin-post-reject"
                    onClick={() => moderatePost(post._id, "rejected")}
                    disabled={updatingId === post._id}
                  >
                    <FaTimes />
                    Rejeter
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
     
      </section>

      <section className="admin-posts-section">
        <div className="admin-posts-heading">
          <div>
            <h2>Publications approuvées</h2>
            <p>
              {approvedPosts.length} publication(s) publiée(s)
            </p>
          </div>

          <button
            type="button"
            className="admin-posts-refresh"
            onClick={fetchApprovedPosts}
            disabled={loading || updatingId !== null}
          >
            <FaSyncAlt />
            Actualiser
          </button>
        </div>

        {approvedPosts.length === 0 ? (
          <div className="admin-posts-empty">
            <FaClipboardList />
            <h3>Aucune publication approuvée</h3>
            <p>Les publications approuvées apparaîtront ici.</p>
          </div>
        ) : (
          <div className="admin-posts-list">
            {approvedPosts.map((post) => (
              <article className="admin-post-card" key={post._id}>
                <div className="admin-post-card-header">
                  <div>
                    <h3>{post.title || "Publication sans titre"}</h3>
                    <p>
                      Par {post.author?.name || "Utilisateur"}
                    </p>
                  </div>

                  <span className="admin-post-pending">
                    Publiée
                  </span>
                </div>

                <p className="admin-post-content">{post.content}</p>

                {post.image && (
                  <img
                    className="admin-post-image"
                    src={post.image}
                    alt="Illustration de la publication"
                  />
                )}

                <div className="admin-post-actions">
                  <button
                    type="button"
                    className="admin-post-reject"
                    onClick={() => deletePost(post._id)}
                    disabled={updatingId === post._id}
                  >
                    <FaTrash />
                    {updatingId === post._id
                      ? "Suppression..."
                      : "Supprimer"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );

}

export default AdminPosts;
