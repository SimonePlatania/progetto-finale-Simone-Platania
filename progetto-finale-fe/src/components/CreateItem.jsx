import { useState } from "react";
function CreateItem ({user, onItemCreated}) {
    const [datiItem, setDatiItem] = useState({
        nome: "",
        descrizione: "",
        prezzoBase: "",
        rilancioMinimo: ""

    })

    const [error, setError] = useState ("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatiItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!datiItem.nome || !datiItem.prezzoBase || !datiItem.rilancioMinimo) {
            setError("I campi tranne la descrizione non possono essere vuoti")
            setLoading(false);
            return;
        }

        const prezzoBase = parseFloat(datiItem.prezzoBase);
        const rilancioMinimo = parseFloat(datiItem.rilancioMinimo);

        if (isNaN(prezzoBase) || isNaN(rilancioMinimo)) {
            setError("I valori numerici non sono validi")
            setLoading(false);
            return;
        }

        try {

            const response = await axios.post("http://localhost:8080/api/items?gestoreId=${user.id}", {
                nome: datiItem.nome,
                descrizione: datiItem.descrizione,
                prezzoBase: datiItem.prezzoBase,
                rilancioMinimo: rilancioMinimo
            });

            setDatiItem({
                nome: "",
                descrizione: "",
                prezzoBase: "",
                rilancioMinimo: ""
            })

            if (onItemCreated) {
                onItemCreated(response.data);
            }
        } catch (err) {
            setError(err.response?.data || "Errore durante la creazione dell'oggetto");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="container-creazione-oggetti">
            <h3>Inserisci dati dell'oggetto da mettere all'asta</h3>
            <form onSubmit={handleSubmit} className="creazione-oggetti-form">
                <div className="form-group">
                    <label>Nome:</label>
                    <input 
                        type="text"
                        name="nome"
                        value={datiItem.nome}
                        onChange={handleChange}
                        placeholder="Inserisci il nome dell'oggetto"
                        maxLength={100}
                        required
                        />
                        </div>
                    <div className="form-group">
                        <label>Descrizione</label>
                        <textarea
                            name ="descrizione"
                            value={datiItem.descrizione}
                            onChange={handleChange}
                            placeholder="Inserisci una descrizione"
                            rows={4}
                            />
                    </div>
                    <div className="form-group">
                        <label>Prezzo Base (€) </label>
                        <input
                            type = "number"
                            name="prezzoBase"
                            value={datiItem.prezzoBase}
                            onChange={handleChange}
                            step = "0.01"
                            min="0"
                            placeholder="0.00"
                            />
                    </div>
                    <div className="form-group">
                        <label>Rilancio minimo</label>
                        <input 
                            type = "number"
                            name = "rilancioMinimo"
                            value = {datiItem.rilancioMinimo}
                            onChange={handleChange}
                            step = "0.01"
                            min = "0"
                            placeholder="0.00"/>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submite"
                        className="submit-button"
                        disabled={loading}
                        >
                            {loading ? "Inserimenti oggetto in corso..." : "Inserisci oggetto"}
                            </button>
            </form>
        </div>
    )
}

export default CreateItem;