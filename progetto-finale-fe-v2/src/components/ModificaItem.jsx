import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ModificaItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [item, setItem] = useState({
    nome: "",
    descrizione: "",
    prezzoBase: "",
    rilancioMinimo: "",
    imageUrl: ""
  });

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
        const userData = userResponse.data;
        setUser(userData);

        if (userData.ruolo !== "GESTORE") {
          navigate("/homepage");
          return;
        }

        const itemResponse = await axios.get(
          `http://localhost:8080/api/items/${itemId}`,
          { headers: { Authorization: sessionId } }
        );
        
        const itemData = itemResponse.data;
        setItem({
          nome: itemData.nome || "",
          descrizione: itemData.descrizione || "",
          prezzoBase: itemData.prezzoBase?.toString() || "",
          rilancioMinimo: itemData.rilancioMinimo?.toString() || "",
          imageUrl: itemData.imageUrl || ""
        });
      } catch (err) {
        console.error("Errore:", err);
        setError(err.response?.data || "Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [navigate, itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("sessionId");

    try {
      await axios.put(
        `http://localhost:8080/api/items/${itemId}`,
        {
          ...item,
          prezzoBase: parseFloat(item.prezzoBase),
          rilancioMinimo: parseFloat(item.rilancioMinimo)
        },
        {
          params: { gestoreId: user.id },
          headers: { Authorization: sessionId }
        }
      );
      navigate("/items");
    } catch (err) {
      setError(err.response?.data || "Errore durante l'aggiornamento dell'item");
    }
  };

  const handleDelete = async () => {
    const sessionId = localStorage.getItem("sessionId");
    
    try {
      await axios.delete(`http://localhost:8080/api/items/${itemId}`, {
        params: { gestoreId: user.id },
        headers: { Authorization: sessionId }
      });
      navigate("/items");
    } catch (err) {
      setError(err.response?.data || "Errore durante l'eliminazione dell'item");
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
                    onClick={() => navigate("/items")}
            >
              ← Torna indietro
            </a>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              Gestore: {user?.username}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
            Modifica oggetto
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Item */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Nome oggetto
              </label>
              <input
                type="text"
                placeholder="Nome item"
                value={item.nome}
                onChange={(e) => setItem({ ...item, nome: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Descrizione
              </label>
              <textarea
                placeholder="Descrizione"
                value={item.descrizione}
                onChange={(e) => setItem({ ...item, descrizione: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>

            {/* Prezzi */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Prezzo base
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prezzo base"
                  value={item.prezzoBase}
                  onChange={(e) => setItem({ ...item, prezzoBase: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Rilancio minimo
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Rilancio minimo"
                  value={item.rilancioMinimo}
                  onChange={(e) => setItem({ ...item, rilancioMinimo: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 bg-red-50/50 backdrop-blur-sm p-3 rounded-lg">
                {error}
              </p>
            )}

            {/* Bottoni */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Salva Modifiche
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Elimina Oggetto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ModificaItem;