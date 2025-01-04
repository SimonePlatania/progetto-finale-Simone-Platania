// CreateItem.jsx
import React, { useState } from 'react';
import '../css/CreateItem.css';

function CreateItem({ user, onItemCreated, disabled }) {
    const [formData, setFormData] = useState({
        nome: '',
        descrizione: '',
        prezzoBase: '',
        rilancioMinimo: ''
    });

    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nome.trim()) return "Il nome è obbligatorio";
        if (!formData.prezzoBase || parseFloat(formData.prezzoBase) <= 0) {
            return "Il prezzo base deve essere maggiore di zero";
        }
        if (!formData.rilancioMinimo || parseFloat(formData.rilancioMinimo) <= 0) {
            return "Il rilancio minimo deve essere maggiore di zero";
        }
        if (parseFloat(formData.rilancioMinimo) >= parseFloat(formData.prezzoBase)) {
            return "Il rilancio minimo deve essere minore del prezzo base";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/items?gestoreId=${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('sessionId')
                },
                body: JSON.stringify({
                    ...formData,
                    prezzoBase: parseFloat(formData.prezzoBase),
                    rilancioMinimo: parseFloat(formData.rilancioMinimo)
                })
            });

            if (!response.ok) throw new Error('Errore nella creazione dell\'oggetto');

            const newItem = await response.json();
            onItemCreated(newItem);
            
            // Reset del form
            setFormData({
                nome: '',
                descrizione: '',
                prezzoBase: '',
                rilancioMinimo: ''
            });

        } catch (err) {
            setFormError(err.message || 'Si è verificato un errore durante la creazione dell\'oggetto');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-item-form">
            {formError && (
                <div className="form-error">{formError}</div>
            )}

            <div className="form-group">
                <label htmlFor="nome">Nome dell'oggetto *</label>
                <input
                    id="nome"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    disabled={disabled}
                    maxLength={100}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="descrizione">Descrizione</label>
                <textarea
                    id="descrizione"
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                    disabled={disabled}
                    rows={4}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="prezzoBase">Prezzo Base (€) *</label>
                    <input
                        id="prezzoBase"
                        type="number"
                        name="prezzoBase"
                        value={formData.prezzoBase}
                        onChange={handleChange}
                        disabled={disabled}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rilancioMinimo">Rilancio Minimo (€) *</label>
                    <input
                        id="rilancioMinimo"
                        type="number"
                        name="rilancioMinimo"
                        value={formData.rilancioMinimo}
                        onChange={handleChange}
                        disabled={disabled}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit" 
                className="submit-button"
                disabled={disabled}
            >
                {disabled ? 'Creazione in corso...' : 'Crea Oggetto'}
            </button>
        </form>
    );
}

export default CreateItem;