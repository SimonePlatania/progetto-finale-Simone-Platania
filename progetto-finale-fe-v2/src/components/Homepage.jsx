// Homepage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Homepage() {
  const [user, setUser] = useState(null);
  const [asteAttive, setAsteAttive] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
        setUser(response.data);
      } catch (err) {
        console.error("Sessione non valida", err);
        navigate("/login");
      }
    };

    const fetchAste = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/aste/attive", {
          headers: { Authorization: sessionId }
        });
        setAsteAttive(response.data);
      } catch (err) {
        setError("Errore nel caricamento delle aste");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    fetchAste();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    navigate("/login");
  };

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* IL MIO HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sistema Aste</h1>
          
          <div className="flex items-center gap-4">
            {user?.ruolo === "GESTORE" && (
              <button
                onClick={() => navigate("/items")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                I Miei Items
              </button>
            )}
            
            {user?.ruolo === "PARTECIPANTE" && (
              <>
                <button
                  onClick={() => navigate("/aste-partecipate")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Le Mie Aste
                </button>
                <button
                  onClick={() => navigate("/aste-vinte")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Aste Vinte
                </button>
              </>
            )}
            
            <div className="flex items-center gap-2">

            {user?.ruolo === "GESTORE" ? (
                        <span className="font-semibold text-center">Account <p className="font-light text-center">{user?.username}</p>Gestore</span>
                      ) : user?.ruolo === "PARTECIPANTE" ? (
                        <span className="font-semibold text-center">Account <p className="font-light text-center">{user?.username}</p>Partecipante</span>
                      ) : null}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* IL MIO MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{asteAttive.map((asta) => (
  <div key={asta.id} className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl text-center font-semibold mb-2 space-y-2">{asta.nomeItem}</h3>
    
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div>
        <p className="text-gray-600 text-sm">Offerta Corrente</p>
        <p className="font-medium">
          €{asta.offertaCorrente?.toFixed(2) || "Nessuna offerta"}
        </p>
      </div>
      <div>
        <p className="text-gray-600 text-sm">Stato</p>
        <p className={`font-bold ${asta.startNow ? 'text-green-600' : 'text-yellow-600'}`}>
          {asta.startNow ? "Asta Attiva" : "Inizio Programmato"}
        </p>
      </div>
    </div>

    {user?.ruolo === "GESTORE" && asta.usernameOfferente && (
      <div className="mb-4 p-2 bg-blue-50 rounded">
        <p className="text-center font-thin text-black-800">
          Miglior Offerente: 
        </p>
        <p className="text-center font-bold text-black-800">{asta.usernameOfferente}</p>
      </div>
    )}

    <div className="mt-4 text-sm text-gray-500">
      {asta.startNow ? (
        <p>Scade il: {new Date(asta.dataFine).toLocaleString()}</p>
      ) : (
        <>
          <p>Inizia il: {new Date(asta.dataInizio).toLocaleString()}</p>
          <p>Termina il: {new Date(asta.dataFine).toLocaleString()}</p>
        </>
      )}
    </div>

    <button
      onClick={() => navigate(`/asta/${asta.id}`)}
      className={`mt-4 w-full py-2 rounded ${
        asta.startNow 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-100 text-gray-700 cursor-default'
      }`}
      disabled={!asta.startNow && user?.ruolo === "PARTECIPANTE"}
    >
      {user?.ruolo === "PARTECIPANTE" 
        ? (asta.startNow ? "Partecipa all'Asta" : "Asta non ancora iniziata")
        : "Visualizza Dettagli"
      }
    </button>
  </div>
))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Homepage;