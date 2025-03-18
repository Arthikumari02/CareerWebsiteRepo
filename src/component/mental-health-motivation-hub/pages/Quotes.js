import React, { useState, useEffect } from "react";
import "./styles/Quotes.css";

const Quotes = () => {
  const [quote, setQuote] = useState("Loading your quote...");

  const fetchQuote = () => {
    fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch((error) => {
        console.error("Fetch error:", error);
        setQuote("Believe you can, and you're halfway there. - Theodore Roosevelt");
      });
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quotes-page">
      <div className="quote-card">
        <h2 className="quote-heading">🌟 Your Daily Dose of Inspiration 🌟</h2>
        <p>{quote}</p>
        <button className="new-quote-button" onClick={fetchQuote}>New Quote</button>
      </div>
    </div>
  );
};

export default Quotes;