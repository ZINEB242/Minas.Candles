import { useState } from "react";

import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH
} from "react-icons/fa";

import "./PostCard.css";


const PostCard = ({ post }) => {

  // =========================
  // STATES
  // =========================

  // Like
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  // Commentaires
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Partages
  const [shares, setShares] = useState(post.shares);

  // Enregistrer
  const [saved, setSaved] = useState(false);


  // =========================
  // LIKE
  // =========================

  const handleLike = () => {

    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }

  };


  // =========================
  // COMMENTAIRE
  // =========================

  const handleComment = () => {

    if (comment.trim() === "") {
      return;
    }

    setComments([
      ...comments,
      comment
    ]);

    setComment("");

  };


  // =========================
  // PARTAGER
  // =========================

  const handleShare = () => {

    setShares(shares + 1);

  };


  // =========================
  // RETURN
  // =========================

  return (

    <article className="post-card">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="post-header">

        <div className="post-avatar">
          {post.author.charAt(0)}
        </div>


        <div className="post-author">

          <strong>
            {post.author}
          </strong>

          <small>
            {post.time}
          </small>

        </div>


        <button className="post-menu">

          <FaEllipsisH />

        </button>

      </div>



      {/* ================================= */}
      {/* CONTENU */}
      {/* ================================= */}

      <div className="post-content">

        <p>
          {post.content}
        </p>

      </div>



      {/* ================================= */}
      {/* IMAGE */}
      {/* ================================= */}

      {post.image && (

        <div className="post-image">

          <img
            src={post.image}
            alt={post.title || "Publication Minas Candles"}
          />

        </div>

      )}



      {/* ================================= */}
      {/* PRODUIT */}
      {/* ================================= */}

      {post.product && (

        <div className="post-product">

          <div>

            <strong>
              {post.product.name}
            </strong>

            <span>
              {post.product.price} DA
            </span>

          </div>


          <button>
            Commander
          </button>

        </div>

      )}



      {/* ================================= */}
      {/* STATISTIQUES */}
      {/* ================================= */}

      <div className="post-stats">

        <span>
          ❤️ {likes}
        </span>


        <span>
          {comments.length > 0
            ? comments.length
            : post.comments
          } commentaires
        </span>


        <span>
          {shares} partages
        </span>

      </div>



      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="post-actions">


        {/* LIKE */}

        <button
          className={liked ? "liked" : ""}
          onClick={handleLike}
        >

          <FaHeart />

          J'aime

        </button>



        {/* COMMENTAIRE */}

        <button
          onClick={() =>
            setShowComments(!showComments)
          }
        >

          <FaComment />

          Commenter

        </button>



        {/* PARTAGER */}

        <button
          onClick={handleShare}
        >

          <FaShare />

          Partager

        </button>



        {/* ENREGISTRER */}

        <button
          className={saved ? "saved" : ""}
          onClick={() =>
            setSaved(!saved)
          }
        >

          <FaBookmark />

          {saved
            ? "Enregistré"
            : "Enregistrer"
          }

        </button>

      </div>



      {/* ================================= */}
      {/* SECTION COMMENTAIRES */}
      {/* ================================= */}

      {showComments && (

        <div className="comments-section">


          {/* FORMULAIRE */}

          <div className="comment-form">

            <input
              type="text"
              placeholder="Écrire un commentaire..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  handleComment();
                }

              }}
            />


            <button
              onClick={handleComment}
            >
              Publier
            </button>

          </div>



          {/* LISTE DES COMMENTAIRES */}

          <div className="comments-list">

            {comments.map((item, index) => (

              <div
                className="comment"
                key={index}
              >


                {/* AVATAR */}

                <div className="comment-avatar">

                  M

                </div>



                {/* CONTENU */}

                <div className="comment-content">

                  <strong>
                    Vous
                  </strong>

                  <p>
                    {item}
                  </p>

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