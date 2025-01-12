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
        const userResponse = await axios.get(
          "http://localhost:8080/api/utenti/me",
          {
            headers: { Authorization: sessionId },
          }
        );
        setUser(userResponse.data);

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

              <p className=" text-3xl pl-28 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center cursor-pointer "
      onClick={() => navigate ("/homepage") }>
              Sistema Aste
            </p>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              Aste partecipate | {user?.username}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
          Le Tue Aste
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {astePartecipate.map((asta) => (
           <div
           key={asta.id}
           className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col min-h-[600px] gap-4 border border-white/50 w-full max-w-sm transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
         >
           <div className="text-center mb-4 flex-grow">
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
                 <p className="text-md text-gray-600 pb-2">Offerta Corrente</p>
                 <p className="font-medium text-lg">
                   €{asta.offertaCorrente?.toFixed(2)}
                 </p>
               </div>
               <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                 <p className="text-md text-gray-600 pb-2">Stato</p>
                 <p className={`font-medium text-lg ${
                   asta.isAttiva ? "text-green-600" : "text-red-600"
                 }`}>
                   {asta.isAttiva ? "In Corso" : "Terminata"}
                 </p>
               </div>
             </div>
           </div>
         
           <div className="mt-auto space-y-4">
             <div className="text-sm text-gray-500 mb-4">
               <p>Scadenza: {new Date(asta.dataFine).toLocaleString()}</p>
             </div>
         
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

        {astePartecipate.length === 0 && (
          <div className="text-center bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
            <p className="text-gray-600">
              Non hai ancora partecipato a nessuna asta.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AstePartecipate;
