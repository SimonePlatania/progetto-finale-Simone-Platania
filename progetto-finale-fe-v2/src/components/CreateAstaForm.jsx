import { useState } from "react";

function CreateAstaForm({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    itemId: item.id,
    startNow: false,
    dataInizio: "",
    dataFine: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-md w-full mx-4 border border-white/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Crea Nuova Asta
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Dettagli Oggetto</h4>
            <p className="text-gray-600">{item.nome}</p>
            <p className="text-sm text-gray-500 mt-1">ID: {item.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
            <label className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                checked={formData.startNow}
                onChange={(e) =>
                  setFormData({ ...formData, startNow: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-gray-700">Inizia subito</span>
            </label>

            {!formData.startNow && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Data Inizio</label>
                <input
                  type="datetime-local"
                  value={formData.dataInizio}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInizio: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-white/70 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Data Fine</label>
              <input
                type="datetime-local"
                value={formData.dataFine}
                onChange={(e) =>
                  setFormData({ ...formData, dataFine: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-white/70 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl backdrop-blur-sm transition-all shadow-md hover:shadow-lg border border-white/50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Crea Asta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAstaForm;