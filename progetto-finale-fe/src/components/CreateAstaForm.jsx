// CreateAstaForm.jsx
import React, { useState } from 'react';
import '../css/CreateAstaForm.css';

function CreateAstaForm({ item, onSubmit, onCancel }) {
    const [astaData, setAstaData] = useState({
        dataInizio: '',
        dataFine: '',
        startNow: false,
        prezzoIniziale: item.prezzoBase 
    });

    const [error, setError] = useState('');

    const now = new Date();
    const minDate = new Date(now.getTime() + (15 * 60 * 1000)); 
    const maxDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); 

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!astaData.startNow && !astaData.dataInizio) {
            setError('Devi specificare una data di inizio o selezionare "Inizia subito"');
            return;
        }

        if (!astaData.dataFine) {
            setError('La data di fine è obbligatoria');
            return;
        }

        const dataInizioDate = astaData.startNow ? new Date() : new Date(astaData.dataInizio);
        const dataFineDate = new Date(astaData.dataFine);

        if (dataFineDate <= dataInizioDate) {
            setError('La data di fine deve essere successiva alla data di inizio');
            return;
        }

        onSubmit({
            ...astaData,
            itemId: item.id,
            prezzoIniziale: item.prezzoBase
        });
    };

    return (
        <div className="create-asta-form">
            <h3>Crea nuova asta per: {item.nome}</h3>
            <p className="item-price">Prezzo iniziale: €{item.prezzoBase.toFixed(2)}</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={astaData.startNow}
                            onChange={(e) => setAstaData({
                                ...astaData,
                                startNow: e.target.checked,
                                dataInizio: e.target.checked ? '' : astaData.dataInizio
                            })}
                        />
                        Inizia subito
                    </label>
                </div>

                {!astaData.startNow && (
                    <div className="form-group">
                        <label>Data e ora di inizio:</label>
                        <input
                            type="datetime-local"
                            value={astaData.dataInizio}
                            onChange={(e) => setAstaData({
                                ...astaData,
                                dataInizio: e.target.value
                            })}
                            min={minDate.toISOString().slice(0, 16)}
                            max={maxDate.toISOString().slice(0, 16)}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Data e ora di fine:</label>
                    <input
                        type="datetime-local"
                        value={astaData.dataFine}
                        onChange={(e) => setAstaData({
                            ...astaData,
                            dataFine: e.target.value
                        })}
                        min={minDate.toISOString().slice(0, 16)}
                        max={maxDate.toISOString().slice(0, 16)}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                    <button type="submit" className="submit-button">
                        Crea Asta
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-button">
                        Annulla
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateAstaForm;