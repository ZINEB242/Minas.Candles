
import { Link, useParams } from "react-router-dom";
import products from "../../data/products";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-details-page">
        <h1>Modèle introuvable</h1>
        <Link to="/shop">Retour à la boutique</Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link to={`/shop/${product.categoryId || ""}`} className="product-details-back">
        ← Retour à la collection
      </Link>

      <section className="product-details-content">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <span className="product-details-brand">MINAS CANDLES</span>

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            {product.price.toLocaleString("fr-FR")} DA
          </p>

          {product.description && (
            <p className="product-details-description">
              {product.description}
            </p>
          )}

          {product.fragrance && (
            <p className="product-details-fragrance">
              Senteur : <strong>{product.fragrance}</strong>
            </p>
          )}

          <p className="product-details-note">
            Une création artisanale préparée avec soin.
          </p>

          <Link to="/order" className="product-details-order">
            Passer commande
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
