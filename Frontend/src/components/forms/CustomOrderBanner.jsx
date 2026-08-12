import { Link } from "react-router-dom";

const CustomOrderBanner = () => {
  return (
    <section
      className="container my-5 p-5"
      style={{
        backgroundColor: "#F8F3EC",
        borderRadius: "25px",
      }}
    >
      <div className="row align-items-center">

        <div className="col-lg-7">

          <h2
            className="fw-bold"
            style={{ color: "#4E3A33" }}
          >
            Créez votre bougie personnalisée
          </h2>

          <p
            className="mt-3"
            style={{
              color: "#7B6D67",
              fontSize: "18px",
            }}
          >
            Choisissez votre senteur, vos couleurs,
            votre message et l'occasion.
            Minas Candles réalisera une création unique,
            entièrement faite pour vous.
          </p>

          <Link
            to="/order"
            className="btn mt-3"
            style={{
              backgroundColor: "#C98E7A",
              color: "white",
              padding: "12px 30px",
              borderRadius: "12px",
            }}
          >
            Commencer ma commande
          </Link>

        </div>

        <div className="col-lg-5 text-center">

          <div
            style={{
              fontSize: "130px",
            }}
          >
            🕯️
          </div>

        </div>

      </div>
    </section>
  );
};

export default CustomOrderBanner;