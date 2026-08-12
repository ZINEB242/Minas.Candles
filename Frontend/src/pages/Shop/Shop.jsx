import ProductCard from "../../components/products/ProductCard";
import products from "../../data/products";

import "./Shop.css";

const Shop = () => {
  return (
    <main className="shop-page">

      {/* HEADER */}
      <section className="shop-header">

        <span className="shop-subtitle">
          MINAS CANDLES
        </span>

        <h1>
          Notre Boutique
        </h1>

        <p>
          Découvrez nos bougies artisanales parfumées.
        </p>

      </section>


      {/* PRODUITS */}
      <section className="products-section">

        <div className="products-grid">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </section>

    </main>
  );
};

export default Shop;