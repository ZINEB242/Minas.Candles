import { useState } from "react";
import "./Step3.css";

const Step3 = ({
  colors,
  setColors,
  customColor,
  setCustomColor,
  customImage,
  setCustomImage,
}) => {


  const colorOptions = [
    {
      id: "blanc",
      name: "Blanc",
      value: "#FFFDFB",
    },
    {
      id: "rose",
      name: "Rose poudré",
      value: "#E8B7B1",
    },
    {
      id: "beige",
      name: "Beige",
      value: "#DCC8B8",
    },
    {
      id: "marron",
      name: "Marron",
      value: "#9A7563",
    },
    {
      id: "terracotta",
      name: "Terracotta",
      value: "#C77F70",
    },
    {
      id: "vert",
      name: "Vert sauge",
      value: "#AAB7A0",
    },
    {
      id: "lavande",
      name: "Lavande",
      value: "#C8B9D8",
    },
    {
      id: "jaune",
      name: "Jaune doux",
      value: "#E8D38F",
    },
  ];

  const handleColorClick = (colorId) => {
    if (colors.includes(colorId)) {
      setColors(
        colors.filter((color) => color !== colorId)
      );

      return;
    }

    if (colors.length < 3) {
      setColors([
        ...colors,
        colorId,
      ]);
    }
  };

 const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    setCustomImage(URL.createObjectURL(file));
  }
};

  return (
    <section className="order-container">

      {/* PROGRESSION */}

      <div className="step-number">
        Étape 3 sur 5
      </div>

      <span className="order-subtitle">
        VOTRE CRÉATION
      </span>

      <h1>
        Choisissez vos couleurs
      </h1>

      <p>
        Sélectionnez jusqu'à 3 couleurs pour votre bougie.
      </p>

      {/* COMPTEUR */}

      <div className="color-counter">
        {colors.length} / 3 couleurs sélectionnées
      </div>

      {/* COULEURS PRÉDÉFINIES */}

      <div className="colors-grid">

        {colorOptions.map((color) => (

          <button
            type="button"
            key={color.id}
            className={`color-card ${
              colors.includes(color.id)
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleColorClick(color.id)
            }
          >

            <span
              className="color-circle"
              style={{
                backgroundColor: color.value,
              }}
            />

            <span className="color-name">
              {color.name}
            </span>

            {colors.includes(color.id) && (
              <span className="color-check">
                ✓
              </span>
            )}

          </button>

        ))}

      </div>

      {/* =========================
          COULEUR PERSONNALISÉE
      ========================= */}

      <div className="custom-color-section">

        <h3>
          Vous avez une autre idée ? 🎨
        </h3>

        <p>
          Indiquez-nous la couleur exacte que vous souhaitez.
        </p>

        {/* ÉCRIRE LA COULEUR */}

        <div className="custom-color-input">

          <label>
            Nom ou référence de la couleur
          </label>

          <input
            type="text"
            placeholder="Ex : bleu ciel, champagne, #D4A..."
            value={customColor}
            onChange={(e) =>
              setCustomColor(e.target.value)
            }
          />

        </div>

        {/* PHOTO */}

        <div className="custom-color-upload">

          <label>
            📷 Ajouter une photo comme référence
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {customImage && (
            <div className="custom-color-preview">

              <img
                src={customImage}
                alt="Référence couleur"
              />

              <span>
                Photo sélectionnée ✓
              </span>

            </div>
          )}

        </div>

      </div>

      {/* NAVIGATION */}

      

    </section>
  );
};

export default Step3;