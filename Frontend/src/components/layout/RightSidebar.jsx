import { FaCalendarAlt, FaUserPlus, FaStar } from "react-icons/fa";
import "./RightSidebar.css";

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">

      {/* Prochaines expositions */}
      <section className="right-card">
        <div className="right-card-header">
          <h3>Prochaines expositions</h3>
          <span>Voir tout →</span>
        </div>

        <div className="event-card">
          <div className="event-date">
            <strong>15</strong>
            <small>AOÛT</small>
          </div>

          <div className="event-info">
            <h4>Salon de l'Artisanat</h4>
            <p>Palais des Expositions, Alger</p>
            <button>Je participe</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-date">
            <strong>05</strong>
            <small>SEPT</small>
          </div>

          <div className="event-info">
            <h4>Expo Créations Féminines</h4>
            <p>Hôtel El Aurassi, Alger</p>
            <button>Je participe</button>
          </div>
        </div>
      </section>


      {/* Suggestions */}
      <section className="right-card">
        <div className="right-card-header">
          <h3>Suggestions d'amis</h3>
          <span>Voir tout →</span>
        </div>

        <div className="friend-suggestion">
          <div className="friend-avatar">A</div>

          <div className="friend-info">
            <strong>L'Artisanat d'Algérie</strong>
            <small>12 amis en commun</small>
          </div>

          <button>
            <FaUserPlus />
          </button>
        </div>

        <div className="friend-suggestion">
          <div className="friend-avatar">B</div>

          <div className="friend-info">
            <strong>Bougies & Co</strong>
            <small>8 amis en commun</small>
          </div>

          <button>
            <FaUserPlus />
          </button>
        </div>

        <div className="friend-suggestion">
          <div className="friend-avatar">C</div>

          <div className="friend-info">
            <strong>Crea Déco</strong>
            <small>5 amis en commun</small>
          </div>

          <button>
            <FaUserPlus />
          </button>
        </div>
      </section>


      {/* Les plus aimées */}
      <section className="right-card">
        <div className="right-card-header">
          <h3>Les plus aimées</h3>
          <span>Voir tout →</span>
        </div>

        <div className="popular-product">
          <div className="product-placeholder">
            🕯️
          </div>

          <div>
            <strong>Bougie Vanille & Coco</strong>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <span>2 500 DA</span>
          </div>
        </div>

        <div className="popular-product">
          <div className="product-placeholder">
            🕯️
          </div>

          <div>
            <strong>Bougie Pivoine</strong>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <span>2 200 DA</span>
          </div>
        </div>

        <div className="popular-product">
          <div className="product-placeholder">
            🕯️
          </div>

          <div>
            <strong>Coffret Douceur</strong>
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <span>4 500 DA</span>
          </div>
        </div>

      </section>

    </aside>
  );
};

export default RightSidebar;