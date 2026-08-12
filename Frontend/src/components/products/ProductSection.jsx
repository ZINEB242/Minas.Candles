const products = [
  {
    id: 1,
    name: "Bougie Jasmin",
    fragrance: "Jasmin",
    price: "2200 DA",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
  },
  {
    id: 2,
    name: "Bougie Rose",
    fragrance: "Rose",
    price: "2500 DA",
    image: "https://images.unsplash.com/photo-1602872030219-ad2b9d2e3c8b?w=600",
  },
  {
    id: 3,
    name: "Lovely",
    fragrance: "Exotique",
    price: "2400 DA",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600",
  },
];
const ProductSection = () => {
  return (
    <section className="container py-5">

      <h2
        className="text-center fw-bold mb-5"
        style={{ color: "#4E3A33" }}
      >
        Nos Bougies
      </h2>

      <div className="row g-4">

        {products.map((product) => (

          <div className="col-lg-4" key={product.id}>

            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "20px" }}
            >

              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{
                  height: "320px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">

                <h4>{product.name}</h4>

                <p className="text-muted">
                  {product.fragrance}
                </p>

                <h5
                  style={{
                    color: "#C98E7A",
                  }}
                >
                  {product.price}
                </h5>

                <button
                  className="btn w-100 mt-3"
                  style={{
                    background: "#C98E7A",
                    color: "white",
                  }}
                >
                  Ajouter au panier
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default ProductSection;