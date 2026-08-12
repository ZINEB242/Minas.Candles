import { useState } from "react";
import "./Step4.css";

const Step4 = ({
  message,
  setMessage,
  messageImage,
  setMessageImage,
  onNext,
  onBack,
}) => {
  const [imagePreview, setImagePreview] = useState(messageImage || null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setMessageImage(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const removeImage = () => {
    setMessageImage(null);
    setImagePreview(null);
  };

  return (
    <section className="order-container">

      {/* PROGRESSION */}

      <div className="step-number">
        Étape 4 sur 5
      </div>

      <span className="order-subtitle">
        VOTRE CRÉATION
      </span>

      <h1>
        Ajoutez votre message
      </h1>

      <p>
        Personnalisez votre bougie avec un message qui vous ressemble.
      </p>

      {/* MESSAGE */}

      <div className="message-section">

        <label htmlFor="candle-message">
          Votre message
        </label>

        <textarea
          id="candle-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex : Joyeux anniversaire Sarah ❤️"
          maxLength={150}
        />

        <div className="message-counter">
          {message.length} / 150 caractères
        </div>

      </div>

      {/* IMAGE */}

      <div className="message-image-section">

        <label>
          📷 Ajouter une image
        </label>

        <p>
          Vous pouvez ajouter une photo ou une image comme inspiration.
        </p>

        <label className="upload-image-btn">
          Choisir une image

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {/* APERÇU */}

        {imagePreview && (
          <div className="message-image-preview">

            <img
              src={imagePreview}
              alt="Aperçu"
            />

            <button
              type="button"
              onClick={removeImage}
            >
              Supprimer
            </button>

          </div>
        )}

      </div>

      {/* NAVIGATION */}

      <div className="order-navigation">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Retour
        </button>

        <button
          className="next-btn"
          disabled={
            message.trim() === "" &&
            !messageImage
          }
          onClick={onNext}
        >
          Continuer →
        </button>

      </div>

    </section>
  );
};

export default Step4;