// GestoreItems.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateAstaForm from "./CreateAstaForm";  // Aggiungi questa riga!


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
    rilancioMinimo: ""
  });
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
        // Verifica utente
        const userResponse = await axios.get("http://localhost:8080/api/utenti/me", {
          headers: { Authorization: sessionId }
        });
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
          rilancioMinimo: parseFloat(nuovoItem.rilancioMinimo)
        },
        {
          params: { gestoreId: user.id },
          headers: { Authorization: localStorage.getItem("sessionId") }
        }
      );

      setItems([...items, response.data]);
      setNuovoItem({
        nome: "",
        descrizione: "",
        prezzoBase: "",
        rilancioMinimo: ""
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
      await axios.post(
        "http://localhost:8080/api/aste",
        {
          itemId: formData.itemId,
          nomeItem: formData.nomeItem,
          dataInizio: formData.startNow ? null : formData.dataInizio,
          dataFine: formData.dataFine,
          startNow: formData.startNow,
          isAttiva: true  // Aggiungiamo questo campo
        },
        {
          params: { gestoreId: user.id },
          headers: { Authorization: localStorage.getItem("sessionId") }
        }
      );
  
      // Ricarica items
      const response = await axios.get(
        `http://localhost:8080/api/items/gestore/${user.id}`,
        { headers: { Authorization: localStorage.getItem("sessionId") } }
      );
      setItems(response.data);
      setShowAstaForm(false);
      setSelectedItem(null);
    } catch (err) {
      setError(err.response?.data || "Errore nella creazione dell'asta");
    }
  };
  
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
          <span>Gestore: {user?.username}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Form creazione item */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Crea Nuovo Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome item"
              value={nuovoItem.nome}
              onChange={(e) => setNuovoItem({ ...nuovoItem, nome: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Descrizione"
              value={nuovoItem.descrizione}
              onChange={(e) => setNuovoItem({ ...nuovoItem, descrizione: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Prezzo base"
                value={nuovoItem.prezzoBase}
                onChange={(e) => setNuovoItem({ ...nuovoItem, prezzoBase: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Rilancio minimo"
                value={nuovoItem.rilancioMinimo}
                onChange={(e) => setNuovoItem({ ...nuovoItem, rilancioMinimo: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Crea Item
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Lista items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{item.nome}</h3>
              <p className="text-gray-600 mb-4">{item.descrizione}</p>
              <div className="mb-4">
                <p>Prezzo Base: €{item.prezzoBase?.toFixed(2)}</p>
                <p>Rilancio Minimo: €{item.rilancioMinimo?.toFixed(2)}</p>
              </div>
              {!item.inAsta && (
                <button
                  onClick={() => handleCreateAstaClick(item)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Crea Asta
                </button>
              )}
              {item.inAsta && (
                <p className="text-center text-green-600 font-semibold">In Asta</p>
              )}
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