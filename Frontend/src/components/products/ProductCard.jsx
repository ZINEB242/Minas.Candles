import { useState } from "react";
import {
  FaHeart,
  FaShoppingBag,
  FaStar
} from "react-icons/fa";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article className="product-card">

      {/* IMAGE */}
      <div className="product-image">

        <img
          src={product.image}
          alt={product.name}
        />

        <button
          className={`product-favorite ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          <FaHeart />
        </button>

      </div>

      {/* INFORMATIONS */}
      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>
          {product.name}
        </h3>

        {/* ÉTOILES */}
        <div className="product-rating">

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <span>
            ({product.reviews})
          </span>

        </div>

        {/* SENTEUR */}
        <p className="product-fragrance">
          Senteur :{" "}
          <strong>
            {product.fragrance}
          </strong>
        </p>

        {/* PRIX */}
        <div className="product-bottom">

          <strong className="product-price">
            {product.price} DA
          </strong>

          <button className="product-order">
            <FaShoppingBag />
            Commander
          </button>

        </div>

      </div>

    </article>
  );
};

export default ProductCard;