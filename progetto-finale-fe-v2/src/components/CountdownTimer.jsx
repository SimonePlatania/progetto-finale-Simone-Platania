import { useEffect, useState } from "react";

const CountDownTimer = ({ targetDate }) => {
    const [tempoRimanente, setTempoRimanente] = useState({
        ore: 0,
        minuti: 0,
        secondi: 0
    });

    const tempoTotaleSecondi = tempoRimanente.ore * 3600 + tempoRimanente.minuti * 60 + tempoRimanente.secondi;

    const calcolaTempoRimanente = () => {
        const dataFinale = typeof targetDate === "string"
            ? new Date(targetDate)
            : targetDate;

        const adesso = new Date();
        const differenza = dataFinale.getTime() - adesso.getTime();

        if (differenza > 0) {
            const giorni = Math.floor(differenza / (1000 * 60 * 60 * 24));
            const ore = Math.floor((differenza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minuti = Math.floor((differenza % (1000 * 60 * 60)) / (1000 * 60));
            const secondi = Math.floor((differenza % (1000 * 60)) / 1000);

            setTempoRimanente({ giorni, ore, minuti, secondi });
        } else {
            setTempoRimanente({ giorni: 0, ore: 0, minuti: 0, secondi: 0 });
        }
    };

    useEffect(() => {
        calcolaTempoRimanente();
        const intervallo = setInterval(calcolaTempoRimanente, 1000);
        return () => clearInterval(intervallo);
    }, [targetDate]);

    const formattaNumero = (numero) => {
        return String(numero).padStart(2, '0');
    };

    const getContainerStyle = () => {
        if (tempoTotaleSecondi <= 20) {
            return "animate-pulse bg-red-100 text-red-800";
        } else if (tempoTotaleSecondi <= 300) {
            return "bg-orange-100 text-orange-800";
        }
        return "bg-blue-100 text-blue-800";
    };

    return (
        <div className="flex items-center gap-2 text-sm">
            {tempoRimanente.giorni > 0 && (
                <span className={`px-2 py-1 rounded ${getContainerStyle()}`}>
                    {tempoRimanente.giorni}g
                </span>
            )}

            <span className={`px-2 py-1 rounded ${getContainerStyle()}`}>
                {formattaNumero(tempoRimanente.ore)}h
            </span>

            <span className={`px-2 py-1 rounded ${getContainerStyle()}`}>
                {formattaNumero(tempoRimanente.minuti)}m
            </span>

            <span className={`px-2 py-1 rounded ${getContainerStyle()}`}>
                {formattaNumero(tempoRimanente.secondi)}s
            </span>
        </div>
    );
};

export default CountDownTimer;