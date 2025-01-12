// GestoreItems.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateAstaForm from "./CreateAstaForm";

function GestoreItems() {
  const [user, setUser] = useState(null);
  const [showAstaForm, setShowAstaForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuovoItem, setNuovoItem] = useState({
    nome: "",
    descrizione: "",
    prezzoBase: "",
    rilancioMinimo: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const modifica = (itemId) => {
    console.log("ID dell'item:", itemId); // Per debug
    navigate(`/modifica/${itemId}`);
  };

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

        if (userData.ruolo !== "GESTORE") {
          navigate("/homepage");
          return;
        }

        // Carica items
        const itemsResponse = await axios.get(
          `http://localhost:8080/api/items/gestore/${userData.id}`,
          { headers: { Authorization: sessionId } }
        );
        setItems(itemsResponse.data);
      } catch (err) {
        console.error("Errore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/items`,
        {
          ...nuovoItem,
          prezzoBase: parseFloat(nuovoItem.prezzoBase),
          rilancioMinimo: parseFloat(nuovoItem.rilancioMinimo),
        },
        {
          params: { gestoreId: user.id },
          headers: { Authorization: localStorage.getItem("sessionId") },
        }
      );

      setItems([...items, response.data]);
      setNuovoItem({
        nome: "",
        descrizione: "",
        prezzoBase: "",
        rilancioMinimo: "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data || "Errore nella creazione dell'item");
    }
  };

  const handleCreateAstaClick = (item) => {
    setSelectedItem(item);
    setShowAstaForm(true);
  };

  const handleCreaAsta = async (formData) => {
    try {
      console.log("Dati originali:", formData); // Debug originale

      // Creazione e formattazione corretta delle date
      const now = new Date();
      const dataFine = new Date(formData.dataFine);
      const dataInizio = formData.startNow
        ? now
        : new Date(formData.dataInizio);

      const requestData = {
        itemId: formData.itemId,
        startNow: formData.startNow,
        dataInizio: formData.startNow ? null : dataInizio.toISOString(),
        dataFine: dataFine.toISOString(),
      };

      console.log("Dati formattati da inviare:", requestData); // Debug dati formattati

      const response = await axios.post(
        "http://localhost:8080/api/aste",
        requestData,
        {
          params: { gestoreId: user.id },
          headers: {
            Authorization: localStorage.getItem("sessionId"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Risposta dal server:", response.data);

      const itemsResponse = await axios.get(
        `http://localhost:8080/api/items/gestore/${user.id}`,
        { headers: { Authorization: localStorage.getItem("sessionId") } }
      );
      setItems(itemsResponse.data);
      setShowAstaForm(false);
      setSelectedItem(null);
    } catch (err) {
      // Log più dettagliato dell'errore
      console.error("Errore completo:", err);
      console.error("Dettagli risposta:", err.response?.data);
      console.error("Status code:", err.response?.status);
      setError(err.response?.data || "Errore nella creazione dell'asta");
    }
  };

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
              onClick={() => navigate("/homepage")}
            >
              ← Torna indietro
            </a>

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              Gestore: {user?.username}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Form creazione item */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50 mb-8">
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Dettagli oggetto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome item"
              value={nuovoItem.nome}
              onChange={(e) =>
                setNuovoItem({ ...nuovoItem, nome: e.target.value })
              }
              className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              placeholder="Descrizione"
              value={nuovoItem.descrizione}
              onChange={(e) =>
                setNuovoItem({ ...nuovoItem, descrizione: e.target.value })
              }
              className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Prezzo base"
                value={nuovoItem.prezzoBase}
                onChange={(e) =>
                  setNuovoItem({ ...nuovoItem, prezzoBase: e.target.value })
                }
                className="p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Rilancio minimo"
                value={nuovoItem.rilancioMinimo}
                onChange={(e) =>
                  setNuovoItem({ ...nuovoItem, rilancioMinimo: e.target.value })
                }
                className="p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Immagine dell'oggetto
              </label>
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const response = await axios.post(
                        "http://localhost:8080/api/items/uploads",
                        formData,
                        {
                          headers: {
                            Authorization: localStorage.getItem("sessionId"),
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );

                      setNuovoItem((prev) => ({
                        ...prev,
                        imageUrl: response.data,
                      }));
                    } catch (err) {
                      setError("Errore nel caricamento dell'immagine");
                    }
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                accept="image/*"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Inserisci oggetto nell'inventario
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-600 bg-red-50/50 backdrop-blur-sm p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Lista items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col min-h-[400px] border border-white/50 w-full max-w-sm transform transition-all duration-300 hover:scale-105"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {item.nome}
                </h3>
              </div>

              <div className="border-t border-b border-gray-100/50 py-4 flex-grow">
                <p className="text-gray-600 mb-4">{item.descrizione}</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-600 text-sm font-medium">
                      Prezzo Base
                    </p>
                    <p className="text-lg font-semibold">
                      €{item.prezzoBase?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-600 text-sm font-medium">
                      Rilancio Minimo
                    </p>
                    <p className="text-lg font-semibold">
                      €{item.rilancioMinimo?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {!item.inAsta ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCreateAstaClick(item)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Crea Asta
                    </button>
                    <button
                      onClick={() => modifica(item.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Modifica
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50/80 backdrop-blur-sm p-3 rounded-xl text-emerald-600 font-semibold text-center">
                    In Asta
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAstaForm && selectedItem && (
          <CreateAstaForm
            item={selectedItem}
            onClose={() => {
              setShowAstaForm(false);
              setSelectedItem(null);
            }}
            onSubmit={handleCreaAsta}
          />
        )}
      </main>
    </div>
  );
}

export default GestoreItems;
