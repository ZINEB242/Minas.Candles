
import "./DiscoverMinas.css";
import { FaInstagram, FaTiktok } from "react-icons/fa";
const DiscoverMinas = () => {
  return (
    <main className="discover-minas">
      <section className="discover-hero">
        <div className="discover-hero-content">
          <span className="discover-eyebrow">
            BIENVENUE DANS NOTRE UNIVERS
          </span>

          <h1>
            Minas Candles,
            <br />
            <span>des créations qui racontent une histoire.</span>
          </h1>

          <p>
            Des créations artisanales imaginées avec soin pour accompagner
            vos moments précieux, embellir votre intérieur et offrir des
            cadeaux qui ont du sens.
          </p>

          <a href="#notre-histoire" className="discover-button">
            Découvrir notre univers
          </a>
        </div>

       
<div className="discover-hero-decoration">
  <img
    src="/images/discover/minas-hero.jpg"
    alt="Minas Candles — Une création, une émotion"
    className="discover-photo"
  />
</div>

      </section>

      <section className="discover-story" id="notre-histoire">
        <div className="discover-section-label">NOTRE HISTOIRE</div>

        <h2>Une attention particulière aux petits détails</h2>

        <p>
          Minas Candles est un univers dédié aux créations artisanales,
          aux cadeaux personnalisés et aux attentions qui rendent les
          moments ordinaires plus mémorables.
        </p>

        <p>
          Chaque création est pensée pour s'adapter à vos envies, à vos
          occasions et à votre budget. Nous croyons que ce sont les détails,
          les couleurs et le soin apporté à chaque finition qui rendent
          un cadeau unique.
        </p>
      </section>

      <section className="discover-values">
        <div className="discover-section-label">CE QUI NOUS ANIME</div>
        <h2>Nos valeurs</h2>

        <div className="discover-values-grid">
          <article className="discover-value-card">
            <span>✿</span>
            <h3>La créativité</h3>
            <p>
              Des idées personnalisées pour donner vie à vos envies et
              imaginer des créations qui vous ressemblent.
            </p>
          </article>

          <article className="discover-value-card">
            <span>♡</span>
            <h3>Le soin du détail</h3>
            <p>
              Une attention portée aux associations de couleurs, aux
              finitions et à la présentation de chaque création.
            </p>
          </article>

          <article className="discover-value-card">
            <span>🎁</span>
            <h3>La personnalisation</h3>
            <p>
              Des compositions adaptées à vos occasions, à vos préférences
              et au budget que vous souhaitez consacrer.
            </p>
          </article>
        </div>
      </section>

      <section className="discover-craft">
       <div className="discover-craft-image">
  <img
    src="/images/discover/cree-avec-soin.JPG"
    alt="Une création artisanale réalisée avec soin par Minas Candles"
    className="discover-photo"
  />
</div>

        <div className="discover-craft-content">
          <div className="discover-section-label">NOTRE SAVOIR-FAIRE</div>
          <h2>Chaque détail compte</h2>

          <p>
            De la sélection des éléments décoratifs à l'assemblage final,
            chaque étape contribue à créer un ensemble harmonieux.
          </p>

          <p>
            Bougies, compositions florales, cadeaux personnalisés et
            décorations : notre univers évolue au fil de vos idées et
            des occasions à célébrer.
          </p>

          <p>
            Vous avez une idée en tête ? Nous pouvons réfléchir ensemble
            à une création qui correspond à votre occasion et à votre budget.
          </p>
        </div>
      </section>

      <section className="discover-gallery">
        <div className="discover-section-label">NOTRE UNIVERS EN IMAGES</div>
        <h2>Des créations pour chaque occasion</h2>

        <p className="discover-gallery-intro">
          Anniversaires, cadeaux, événements ou petites attentions :
          trouvez l'inspiration dans notre univers.
        </p>

        <div className="discover-gallery-grid">
          
<div className="discover-gallery-item gallery-one">
  <img
    src="/images/discover/bougies.jpg"
    alt="Bougies Minas Candles"
  />
  <span>Bougies</span>
</div>

<div className="discover-gallery-item gallery-two">
  <img
    src="/images/discover/cadeaux.jpg"
    alt="Cadeaux personnalisés Minas Candles"
  />
  <span>Cadeaux personnalisés</span>
</div>

<div className="discover-gallery-item gallery-three">
  <img
    src="/images/discover/compositions-florales.jpg"
    alt="Compositions florales Minas Candles"
  />
  <span>Compositions florales</span>
</div>

        </div>

        <a href="/shop" className="discover-button">
          Explorer la boutique
        </a>
      </section>

      

<section className="discover-footer">
  <p className="footer-brand">MINAS CANDLES</p>

  <h2>Une création pensée pour vous.</h2>

  <a href="/shop" className="discover-button discover-button-light">
    Découvrir nos créations
  </a>

  <div className="discover-contact">
    <p className="discover-contact-title">CONTACT & RÉSEAUX SOCIAUX</p>

    <a href="tel:+213552416270" className="discover-contact-phone">
      0552 41 62 70
    </a>

    
<div className="discover-socials">
  <a
    href="https://www.instagram.com/minas.candles/?hl=ar"
    target="_blank"
    rel="noopener noreferrer"
    className="discover-social-icon"
    aria-label="Instagram Minas Candles"
  >
    <FaInstagram />
    <span>Instagram</span>
  </a>

  <a
    href="https://www.tiktok.com/@minas.candles?_r=1&_t=ZS-9At1EPM2vOa"
    target="_blank"
    rel="noopener noreferrer"
    className="discover-social-icon"
    aria-label="TikTok Minas Candles"
  >
    <FaTiktok />
    <span>TikTok</span>
  </a>
</div>

  </div>

  <div className="discover-footer-bottom">
    <span>© {new Date().getFullYear()} Minas Candles</span>
    <span>Fait avec soin.</span>
  </div>
</section>


    </main>
  );
};

export default DiscoverMinas;
