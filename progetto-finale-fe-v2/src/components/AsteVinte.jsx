// AsteVinte.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AsteVinte() {
  const [user, setUser] = useState(null);
  const [asteVinte, setAsteVinte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Carica i dati dell'utente
        const userResponse = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
        const userData = userResponse.data;
        setUser(userData);

        if (userData.ruolo !== "PARTECIPANTE") {
          navigate("/homepage");
          return;
        }

        // Carica le aste vinte
        const asteResponse = await axios.get(
          `http://localhost:8080/api/aste/vinte/${userData.id}`,
          { headers: { Authorization: sessionId } }
        );
        setAsteVinte(asteResponse.data);
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        setError("Errore nel caricamento delle aste vinte");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => navigate("/homepage")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Torna alla homepage
          </button>
          <span>Benvenuto, {user?.username}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Le Tue Aste Vinte</h2>
        
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {asteVinte.length === 0 ? (
          <p className="text-gray-600">Non hai ancora vinto nessuna asta.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asteVinte.map((asta) => (
              <div
                key={asta.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col min-h-[400px] 
              transform transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-4">{asta.nomeItem}</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Offerta Vincente: €{asta.offertaCorrente?.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Data Fine: {new Date(asta.dataFine).toLocaleString()}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Stato: {asta.stato}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/asta/${asta.id}`)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Visualizza Dettagli
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AsteVinte;