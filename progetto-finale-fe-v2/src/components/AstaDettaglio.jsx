// AstaDettaglio.jsx corretto
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AstaDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [asta, setAsta] = useState(null);
  const [item, setItem] = useState(null);
  const [offerte, setOfferte] = useState([]);
  const [importoOfferta, setImportoOfferta] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
        setUser(userResponse.data);

        const astaResponse = await axios.get(`http://localhost:8080/api/aste/${id}`, {
          headers: { Authorization: sessionId }
        });
        setAsta(astaResponse.data);

        const itemResponse = await axios.get(
          `http://localhost:8080/api/items/${astaResponse.data.itemId}`,
          { headers: { Authorization: sessionId } }
        );
        setItem(itemResponse.data);

        const offerteResponse = await axios.get(
          `http://localhost:8080/api/aste/${id}/offerte`,
          {
            params: { userId: userResponse.data.id },
            headers: { Authorization: sessionId }
          }
        );
        setOfferte(offerteResponse.data);

      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleOfferta = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:8080/api/aste/${id}/offerte`,
        null,
        {
          params: {
            userId: user.id,
            importoOfferta: parseFloat(importoOfferta)
          },
          headers: { Authorization: sessionId }
        }
      );
  
      const [astaResponse, offerteResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/aste/${id}`, {
          headers: { Authorization: sessionId }
        }),
        axios.get(`http://localhost:8080/api/aste/${id}/offerte`, {
          params: { userId: user.id },
          headers: { Authorization: sessionId }
        })
      ]);
  
      setAsta(astaResponse.data);
      setOfferte(offerteResponse.data);
      setImportoOfferta("");
      setError("");
  
    } catch (err) {
      if (err.response?.status === 401) {
        // Sessione scaduta
        localStorage.removeItem("sessionId");
        navigate("/login");
      } else if (err.response?.status === 400) {
        setError(err.response?.data || "Offerta non valida");
      } else {
        setError("Errore durante l'offerta. Riprova.");
        try {
          const [astaResponse, offerteResponse] = await Promise.all([
            axios.get(`http://localhost:8080/api/aste/${id}`, {
              headers: { Authorization: sessionId }
            }),
            axios.get(`http://localhost:8080/api/aste/${id}/offerte`, {
              params: { userId: user.id },
              headers: { Authorization: sessionId }
            })
          ]);
  
          setAsta(astaResponse.data);
          setOfferte(offerteResponse.data);
        } catch (refreshErr) {
          console.error("Errore nel refresh dei dati:", refreshErr);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => navigate("/homepage")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Torna alla lista
          </button>
          <div className="flex items-center gap-2">
            <span>Benvenuto, {user.username}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">{asta.nomeItem}</h2>
          <p className="text-gray-600 mb-4">{item.descrizione}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Rilancio minimo</p>
              <p className="text-xl font-medium">€{item.rilancioMinimo.toFixed(2) || "N/D"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Offerta Corrente</h3>
              <p className="text-2xl">€{asta.offertaCorrente?.toFixed(2) || "Nessuna offerta"}</p>
            </div>
            {user.ruolo === "GESTORE" && asta.usernameOfferente && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Miglior Offerente</h3>
                <p className="text-xl">{asta.usernameOfferente}</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              Stato: {asta.stato || (asta.isAttiva ? "ATTIVA" : "TERMINATA")}
            </p>
            <p className="text-gray-600">
              Scadenza: {new Date(asta.dataFine).toLocaleString()}
            </p>
          </div>

          {user.ruolo === "PARTECIPANTE" && asta.isAttiva && (
            <form onSubmit={handleOfferta} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  value={importoOfferta}
                  onChange={(e) => setImportoOfferta(e.target.value)}
                  placeholder="Inserisci la tua offerta"
                  className="flex-1 border rounded-lg p-2"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Fai Offerta
                </button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">Storico Offerte</h3>
            <div className="space-y-2">
              {offerte.map((offerta) => (
                <div
                  key={offerta.id}
                  className="border-b border-gray-200 py-2 flex justify-between"
                >
                  <div>
                    <span className="font-medium">€{offerta.importo?.toFixed(2)}</span>
                    {user.ruolo === "GESTORE" && (
                      <span className="ml-2 text-gray-600">
                        da {offerta.usernameOfferente}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {new Date(offerta.dataOfferta).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AstaDettaglio;