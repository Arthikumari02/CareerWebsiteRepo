import React, { useState, useEffect } from "react";
import "./styles/Quotes.css";

const Quotes = () => {
  const [quote, setQuote] = useState("Loading your quote...");

  const fetchQuote = () => {
    const lastFetchTime = localStorage.getItem("lastFetchTime") || 0;
    const now = Date.now();

    if (now - lastFetchTime < 5000) {
      console.warn("Too many requests! Try again later.");
      return;
    }

    fetch("https://api.adviceslip.com/advice")
      .then((response) => response.json())
      .then((data) => setQuote(data.slip.advice));
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quotes-page">
      <div className="quote-card">
        <h2 className="quote-heading">🌟 Words of Wisdom 🌟</h2>
        <p className="fade-in">{quote}</p> {/* No need for key */}
        <button className="new-quote-button" onClick={fetchQuote}>
          New
        </button>
      </div>
    </div>
  );
};

export default Quotes;
