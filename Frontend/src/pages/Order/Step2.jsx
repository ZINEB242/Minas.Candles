import "./Step2.css";

const Step2 = ({ fragrance, setFragrance }) => {

  const fragrances = [
    {
      id: "coco",
      name: "Lait de coco",
      emoji: "🥥",
    },
    {
      id: "amande",
      name: "Lait d'amande",
      emoji: "🌰",
    },
    {
      id: "jasmin",
      name: "Jasmin",
      emoji: "🌼",
    },
    {
      id: "rose",
      name: "Rose",
      emoji: "🌹",
    },
    {
      id: "rose-petal",
      name: "Rose Petal",
      emoji: "🌸",
    },
    {
      id: "lovely",
      name: "Lovely",
      emoji: "✨",
    },
  ];

  return (
    <section className="order-container">

      <div className="step-number">
        Étape 2 sur 5
      </div>

      <span className="order-subtitle">
        VOTRE CRÉATION
      </span>

      <h1>
        Choisissez votre senteur
      </h1>

      <p>
        Quelle ambiance souhaitez-vous donner à votre bougie ?
      </p>

      <div className="fragrance-grid">

        {fragrances.map((item) => (

          <button
            key={item.id}
            className={`fragrance-card ${
              fragrance === item.id ? "selected" : ""
            }`}
            onClick={() => setFragrance(item.id)}
          >

            <span className="fragrance-emoji">
              {item.emoji}
            </span>

            <span className="fragrance-name">
              {item.name}
            </span>

          </button>

        ))}

      </div>

      
    </section>
  );
};

export default Step2;