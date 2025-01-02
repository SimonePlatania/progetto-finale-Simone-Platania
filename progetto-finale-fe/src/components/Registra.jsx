import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Registra() {

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 const [datiRegistrazione, setDatiRegistrazione] = useState({
    username: "",
    email: "",
    password: ""
 });



 const vaiAlGestore = () => {
    navigate("/registra-gestore"); 
}

const vaiAllaLogin = () => {
    navigate("/login");  
}

 const [error, setError] = useState();
 const navigate = useNavigate();

 const [isDisabled, setIsDisabled] = useState(true);

useEffect(() => {
    const errors = validateForm();
    setIsDisabled(errors.length > 0);
}, [datiRegistrazione]);

 const handleChange = (e) => {
    const {name, value} = e.target;
    setDatiRegistrazione (prev => ({
        ...prev, [name]: value
    }))
 }

 const validateForm = () => {
    try {
        const errors = [];
        
        if (!datiRegistrazione.username || !datiRegistrazione.email || !datiRegistrazione.password) {
            errors.push("ERRORE: I campi non possono essere vuoti");
            return errors;
        }

        if (datiRegistrazione.username.length < 3) {
            errors.push("ERRORE: Lo username deve avere almeno 3 caratteri");
        }
        if (datiRegistrazione.username.length > 30) {
            errors.push("ERRORE: Lo username può avere massimo 30 caratteri");
        }

        if (!emailRegex.test(datiRegistrazione.email)) {
            errors.push("ERRORE: Formato email non valido");
        }

        if (datiRegistrazione.password.length < 6) {
            errors.push("ERRORE: La password deve essere di almeno 6 caratteri");
        }
        if (!/[A-Z]/.test(datiRegistrazione.password)) {
            errors.push("ERRORE: La password deve contenere almeno una maiuscola");
        }
        if (!/[0-9]/.test(datiRegistrazione.password)) {
            errors.push("ERRORE: La password deve contenere almeno un numero");
        }

        return errors;
    } catch (error) {
        console.error("Errore durante la validazione:", error);
        return ["Si è verificato un errore durante la validazione"];
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const errors = validateForm();
        if (errors && errors.length > 0) {
            setError(errors.join(" | "));
            return;
        }

        const response = await axios.post('http://localhost:8080/api/utenti/registra', datiRegistrazione);
        console.log("Registrazione avvenuta con successo: ", response.data);
        navigate('/login');
    } catch (err) {
        const errorMessage = err.response?.data || err.message;
        setError(typeof errorMessage === 'string' ? errorMessage : 'Errore durante la registrazione');
        console.error("Dettagli errore:", {
            status: err.response?.status,
            data: err.response?.data,
            headers: err.response?.headers
        });
    }
};

return (
    <div className="mio-div">
        <form className="form" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-center mb-8">Registrazione Partecipante</h2><br/>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">

                <input 
                    type="text"
                    id="username"
                    name="username"
                    value={datiRegistrazione.username}
                    required
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Inserisci username"
                />
            </div>

            <div className="mb-4">

                <input 
                    type="email"
                    id="email"
                    name="email"
                    value={datiRegistrazione.email}
                    required
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Inserisci email"
                />
            </div>

            <div className="mb-6">

                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    required
                    value={datiRegistrazione.password}
                    className="w-full"
                    placeholder="Inserisci password"
                />
            </div>

            <button 
            type="submit" 
            className="btn registrati"
            disabled={isDisabled}>
                Registrati come partecipante
            </button><br/>

            <div className="mt-6 text-center">
            <p><br/>
                Vuoi registrarti come gestore?
                <p className="mb-3">
                    <button 
                        type="button"
                        onClick={vaiAlGestore}
                        className="btn reset">
                        Registrati
                    </button>
                    </p>
                </p><br/>
                <p>
                    Sei già registrato?
                    <button 
                        type="button"
                        onClick={vaiAllaLogin}
                        className="btn reset ml-2">
                        Vai alla login
                    </button>
                </p>
            </div>
        </form>
    </div>
);

}


export default Registra;