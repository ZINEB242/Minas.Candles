
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de créer le compte.");
      }

      setSuccess("Votre compte a été créé avec succès ! Vous pouvez vous connecter.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Rejoignez Minas Candles 🕯️</h1>
        <p>Créez votre compte pour profiter de votre espace personnel.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">Nom complet</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Votre nom complet"
            autoComplete="name"
            required
          />

          <label htmlFor="register-email">Adresse email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="votre@email.com"
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">Mot de passe</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="register-confirm-password">Confirmer le mot de passe</label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Retapez votre mot de passe"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-switch">
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
