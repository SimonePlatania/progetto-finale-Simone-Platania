import React, { useState, useEffect } from "react";
import '../css/AstaCountdown.css';


const AstaCountdown = ({ dataFine }) => {
  const [timeLeft, setTimeLeft] = useState(calcolaTempoRimanente());
  
  function calcolaTempoRimanente() {
    const now = new Date();
    const end = new Date(dataFine);
    const diff = end - now;
    
    if (diff <= 0) {
      return { expired: true };
    }
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      expired: false
    };
  }
  
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calcolaTempoRimanente();
      setTimeLeft(remaining);
      
      if (remaining.expired) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [dataFine]);
  
  if (timeLeft.expired) {
    return (
      <div className="asta-terminata">
        Asta terminata
      </div>
    );
  }
  
  return (
    <div className="countdown-container">
      <div className="countdown-grid">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days}</div>
          <div className="countdown-label">Giorni</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours}</div>
          <div className="countdown-label">Ore</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes}</div>
          <div className="countdown-label">Minuti</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds}</div>
          <div className="countdown-label">Secondi</div>
        </div>
      </div>
    </div>
  );
};

export default AstaCountdown;