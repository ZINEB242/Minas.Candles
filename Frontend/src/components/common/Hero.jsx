import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="container py-5"
      style={{ minHeight: "80vh" }}
    >
      <div className="row align-items-center">

        {/* Texte */}
        <div className="col-lg-6">

          <p
            className="text-uppercase fw-semibold"
            style={{ color: "#C98E7A" }}
          >
            Handmade with Love
          </p>

          <h1
            className="display-4 fw-bold"
            style={{ color: "#4E3A33" }}
          >
            Des bougies artisanales qui illuminent vos moments.
          </h1>

          <p
            className="lead mt-4"
            style={{ color: "#8E817A" }}
          >
            Découvrez des créations uniques aux senteurs délicates,
            fabriquées avec passion pour embellir votre intérieur.
          </p>

          <div className="mt-4 d-flex gap-3">

            <Link
              to="/shop"
              className="btn"
              style={{
                background: "#C98E7A",
                color: "white",
                padding: "12px 25px",
              }}
            >
              Découvrir
            </Link>

            <Link
              to="/order"
              className="btn btn-outline-dark"
            >
              Commander
            </Link>

          </div>

        </div>

        {/* Image */}
        <div className="col-lg-6 text-center">

          <img
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=700"
            alt="Bougie artisanale"
            className="img-fluid rounded-4 shadow"
          />

        </div>

      </div>
    </section>
  );
};

export default Hero;