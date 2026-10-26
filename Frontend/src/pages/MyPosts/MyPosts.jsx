import { useEffect, useState } from "react";
import "./MyPosts.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("minasToken");

        const response = await fetch(
          "http://localhost:3000/api/posts/my-posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de charger tes publications."
          );
        }

        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return <p className="my-posts-message">Chargement des publications...</p>;
  }

  if (error) {
    return <p className="my-posts-error">{error}</p>;
  }

  const statusLabels = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
  };

  return (
    <main className="my-posts-page">
      <h1>Mes publications</h1>
      <p className="my-posts-subtitle">
        Retrouvez ici l'historique de vos publications.
      </p>

      {posts.length === 0 ? (
        <div className="my-posts-empty">
          <h2>Aucune publication pour le moment</h2>
          <p>Vos publications apparaîtront ici après leur création.</p>
        </div>
      ) : (
        <div className="my-posts-list">
          {posts.map((post) => (
            <article className="my-post-card" key={post._id}>
              {post.title && <h2>{post.title}</h2>}

              <p className="my-post-content">{post.content}</p>

              {post.image && (
                <img
                  className="my-post-image"
                  src={post.image}
                  alt="Ma publication"
                />
              )}

              <div className="my-post-footer">
                <span className={`post-status status-${post.status}`}>
                  {statusLabels[post.status] || post.status}
                </span>

                <small>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("fr-FR")
                    : ""}
                </small>
              </div>

              {post.status === "rejected" && post.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Motif du rejet</strong>
                  <p>{post.rejectionReason}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyPosts;