
import { Link, useParams } from "react-router-dom";
import categories from "../../data/categories";
import products from "../../data/products";
import babyBoyModels from "../../data/babyBoyModels";
import babyGirlModels from "../../data/babyGirlModels";
import flowersModels from "../../data/flowersModels";

import mariageModels from "../../data/mariageModels";

import "./Category.css";

const Category = () => {
  const { categoryId } = useParams();

  const category = categories.find(
    (item) => item.id === categoryId
  );

  if (!category) {
    return (
      <main className="category-page">
        <h1>Catégorie introuvable</h1>
        <Link to="/shop">Retour à la boutique</Link>
      </main>
    );
  }

  const categoryProducts = products.filter(
    (product) => product.categoryId === category.id
  );

  return (
    <main className="category-page">
      <header className="category-header">
        <span className="shop-subtitle">MINAS CANDLES</span>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </header>

      


<section className="category-products">
  {["baby-boy", "baby-girl", "flowers", "mariage"].includes(category.id) ? (
    <div className="baby-boy-gallery">
      <div className="baby-boy-intro">
        <span className="shop-subtitle">
          {category.id === "flowers"
            ? "COLLECTION FLORALE"
            : category.id === "mariage"
            ? "COLLECTION MARIAGE"
            : "COLLECTION NAISSANCE"}
        </span>

        <h2>
          {category.id === "baby-boy"
            ? "Nos modèles Baby Boy"
            : category.id === "baby-girl"
            ? "Nos modèles Baby Girl"
            : category.id === "flowers"
            ? "Nos bouquets et compositions florales"
            : "Nos créations pour le mariage"}
        </h2>

        <p>
          {category.id === "flowers"
            ? "Découvrez nos bouquets et créations florales. Composez votre bouquet selon vos envies et votre budget. Chaque modèle peut être personnalisé."
            : category.id === "mariage"
            ? "Découvrez nos créations pour accompagner vos moments précieux. Choisissez votre modèle et renseignez-vous sur les possibilités de personnalisation."
            : "Découvrez nos créations et choisissez le modèle qui vous ressemble. Certaines couleurs et personnalisations peuvent être adaptées à votre demande."}
        </p>
      </div>

      <div className="baby-boy-grid">
        {(category.id === "baby-boy"
          ? babyBoyModels
          : category.id === "baby-girl"
          ? babyGirlModels
          : category.id === "flowers"
          ? flowersModels
          : mariageModels
        ).map((model) => (
          <article className="baby-boy-card" key={model.id}>
            <div className="baby-boy-images">
              {model.images.map((image, index) => (
                <img
                  src={image}
                  alt={`${model.name} — photo ${index + 1}`}
                  key={image}
                  loading="lazy"
                />
              ))}
            </div>

            {model.onOrder && (
              <span className="baby-boy-order">SUR COMMANDE</span>
            )}

            <div className="baby-boy-card-content">
              <h3>{model.name}</h3>
              <p>{model.description}</p>

              <a
                href="tel:+213552416270"
                className="baby-boy-contact"
              >
                Se renseigner
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  ) : categoryProducts.length === 0 ? (
    <p className="category-empty">
      Les modèles de cette collection seront bientôt disponibles.
    </p>
  ) : (
    <div className="products-grid">
      {categoryProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.price} DA</p>
          <Link to={`/product/${product.id}`}>
            Découvrir ce modèle
          </Link>
        </article>
      ))}
    </div>
  )}
</section>




      <Link className="category-back" to="/shop">
        ← Retour à la boutique
      </Link>
    </main>
  );
};

export default Category;
