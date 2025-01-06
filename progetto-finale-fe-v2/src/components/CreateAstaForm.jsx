// CreateAstaForm.jsx
import { useState } from "react";

function CreateAstaForm({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    itemId: item.id,
    nomeItem: item.nome,
    dataInizio: "",
    dataFine: "",
    startNow: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

  const dataToSubmit = {
    ...formData,
    dataInizio: formData.startNow ? null : formData.dataInizio,
  };

  await onSubmit(dataToSubmit);
}


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          Crea Asta per: {item.nome}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="startNow"
              checked={formData.startNow}
              onChange={(e) => setFormData({
                ...formData,
                startNow: e.target.checked,
                dataInizio: e.target.checked ? null : formData.dataInizio
              })}
              className="mr-2"
            />
            <label htmlFor="startNow">Inizia subito</label>
          </div>

          {!formData.startNow && (
            <div>
              <label className="block mb-2">Data Inizio</label>
              <input 
                type="datetime-local"
                value={formData.dataInizio}
                onChange={(e) => setFormData({
                  ...formData,
                  dataInizio: e.target.value
                })}
                className="w-full p-2 border rounded"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}

          <div>
            <label className="block mb-2">Data Fine</label>
            <input
              type="datetime-local"
              value={formData.dataFine}
              onChange={(e) => setFormData({
                ...formData,
                dataFine: e.target.value
              })}
              className="w-full p-2 border rounded-lg bg-gray-200"
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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