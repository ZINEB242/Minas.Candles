
import { Link } from "react-router-dom";
import categories from "../../data/categories";

import "./Shop.css";

const Shop = () => {
  return (
    <main className="shop-page">
      <section className="shop-header">
        <span className="shop-subtitle">MINAS CANDLES</span>
        <h1>Notre Boutique</h1>
        <p>
          Découvrez nos créations artisanales pour chaque occasion.
        </p>
      </section>

      <section className="products-section">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/shop/${category.id}`}
              className="category-card"
              key={category.id}
            >
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />
              </div>

              <div className="category-info">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <span className="category-discover">
                  Découvrir la collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Shop;
