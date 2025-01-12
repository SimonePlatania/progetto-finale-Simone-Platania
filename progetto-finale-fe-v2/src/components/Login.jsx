import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

function Login() {
  const [datiLogin, setDatiLogin] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState();
  const navigate = useNavigate();

  const vaiAllaRegistrazione = () => {
    navigate("/registra");
  };
  const vaiAlGestore = () => {
    navigate("/registra-gestore");
  };

  const validateForm = () => {
    const errors = [];

    if (!datiLogin.username || !datiLogin.password) {
      errors.push("I campi non possono essere vuoti");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatiLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/utenti/login",
        datiLogin,
        {
          withCredentials: true,
        }
      );

      console.log("Login effettuato: ", response.data);
      localStorage.setItem("sessionId", response.data.sessionId);
      localStorage.setItem("user", JSON.stringify(response.data.utente));

      axios.defaults.headers.common["Authorization"] = response.data.sessionId;
      navigate("/homepage");
    } catch (err) {
      setError("Username o password non validi");
      console.error("Errore durante la login", err);
    }
  };

  return (
    <div className="mio-div">
      <form className="form" onSubmit={handleSubmit}>
        <h1 class="text-3xl font-bold text-transparent text-center bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Login
        </h1>
        <br />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            id="username"
            name="username"
            value={datiLogin.username}
            required
            onChange={handleChange}
            className="w-full"
            placeholder="Inserisci username"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
            value={datiLogin.password}
            className="w-full"
            placeholder="Inserisci password"
          />
        </div>

        <button type="submit" className="btn registrati">
          Accedi
        </button>

        <div className="mt-6 text-center">
          <p>
            <br />
            Non hai un account?
          </p>
          <div className="mb-3">
            <button
              type="button"
              onClick={vaiAllaRegistrazione}
              className="btn reset"
            >
              Registrati come partecipante
            </button>
          </div>
          <br />
          <p>Vuoi creare aste?</p>
          <button
            type="button"
            onClick={vaiAlGestore}
            className="btn reset ml-2"
          >
            Registrati come gestore
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
