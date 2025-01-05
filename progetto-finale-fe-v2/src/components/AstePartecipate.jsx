// AstePartecipate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AstePartecipate() {
  const [user, setUser] = useState(null);
  const [astePartecipate, setAstePartecipate] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Verifica utente
        const userResponse = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
        setUser(userResponse.data);

        // Carica aste partecipate
        const asteResponse = await axios.get(
          `http://localhost:8080/api/aste/partecipate/${userResponse.data.id}`,
          { headers: { Authorization: sessionId } }
        );
        setAstePartecipate(asteResponse.data);
      } catch (err) {
        console.error("Errore:", err);
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
        <h2 className="text-2xl font-bold mb-6">Le Tue Aste</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astePartecipate.map((asta) => (
            <div
              key={asta.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-4">{asta.nomeItem}</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Offerta Corrente: €{asta.offertaCorrente?.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Scadenza: {new Date(asta.dataFine).toLocaleString()}
                </p>
                <p className={`font-semibold ${asta.isAttiva ? 'text-green-600' : 'text-red-600'}`}>
                  {asta.isAttiva ? 'In Corso' : 'Terminata'}
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

        {astePartecipate.length === 0 && (
          <p className="text-gray-600 text-center">
            Non hai ancora partecipato a nessuna asta.
          </p>
        )}
      </main>
    </div>
  );
}

export default AstePartecipate;