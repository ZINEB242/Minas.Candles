import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import PostCard from "../../components/community/PostCard";
import posts from "../../data/posts";

import "./Home.css";

const Home = () => {
  return (
    <main className="home-page">

      {/* LEFT SIDEBAR */}
      <LeftSidebar />


      {/* NEWS FEED */}
      <section className="news-feed">

        {/* SHARE CARD */}
        <div className="share-card">

          <div className="share-header">

            <div className="share-avatar">
              M
            </div>

            <span>
              Que voulez-vous partager aujourd'hui ?
            </span>

          </div>


          <div className="share-options">

            <button>
              📷 Photo / Vidéo
            </button>

            <button>
              🕯️ Atelier
            </button>

            <button>
              📅 Événement
            </button>

            <button>
              🛍️ Produit
            </button>

          </div>

        </div>


        {/* POSTS */}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}

      </section>


      {/* RIGHT SIDEBAR */}
      <RightSidebar />

    </main>
  );
};

export default Home;