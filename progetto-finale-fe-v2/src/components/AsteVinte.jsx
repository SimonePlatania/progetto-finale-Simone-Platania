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
        const userResponse = await axios.get(
          "http://localhost:8080/api/utenti/me",
          {
            headers: { Authorization: sessionId },
          }
        );
        const userData = userResponse.data;
        setUser(userData);

        if (userData.ruolo !== "PARTECIPANTE") {
          navigate("/homepage");
          return;
        }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-300/90 via-zinc-400/35 to-indigo-400/35 min-h-screen w-full overflow-x-hidden pb-24 rounded-lg">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a
              className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-green-700 rounded-full backdrop-blur-sm border border-white/30 shadow-sm transition-all hover:shadow-lg cursor-pointer"
              onClick={() => window.history.back()}
              >
                ← Torna indietro
              </a>

              
              <p className=" text-3xl pl-20 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center cursor-pointer "
      onClick={() => navigate ("/homepage") }>
              Sistema Aste
            </p>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              Aste vinte | {user?.username}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
          Le Tue Aste Vinte
        </h2>

        {error && (
          <div className="mb-6 bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {asteVinte.map((asta) => (
            <div
              key={asta.id}
              className="relative bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col min-h-[500px] gap-4 border border-white/50 w-full max-w-sm transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div
                className="absolute -top-3 -right-3 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg"
              >
                Vinta
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {asta.nomeItem}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  <p>ID Asta: {asta.id}</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-100 py-4 flex-grow">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-md text-gray-600 pb-2">Offerta Vincente</p>
                    <p className="font-medium text-lg text-emerald-600">
                      €{asta.offertaCorrente?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-md text-gray-600 pb-2">
                      Data Aggiudicazione
                    </p>
                    <p className="font-medium">
                      {new Date(asta.dataFine).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <button
                  onClick={() => navigate(`/asta/${asta.id}`)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Visualizza Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>

        {asteVinte.length === 0 && (
          <div className="text-center bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white/50">
            <p className="text-gray-600 text-lg">
              Non hai ancora vinto nessuna asta.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AsteVinte;
