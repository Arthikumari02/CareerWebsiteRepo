import "./styles/Home.css";
import React, { useState } from "react";

const affirmations = [
  "You are capable of amazing things.",
  "Believe in yourself and all that you are.",
  "You are worthy of love and kindness.",
  "Every day is a fresh start.",
  "You have the power to create change.",
  "Breathe in confidence, exhale doubt.",
  "Your potential is limitless.",
  "You are stronger than you think.",
];

function AffirmationGenerator() {
  const [affirmation, setAffirmation] = useState(affirmations[0]);

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  return (
    <div>
      <p className="affirmation">"{affirmation}"</p>
      <button className="cta-button" onClick={getRandomAffirmation}>
        New Affirmation
      </button>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Your Mental Health Hub</h1>
        <p>Find peace, motivation, and space to reflect. 🌸</p>
        <button className="cta-button">Explore Now</button>
      </div>

      <div className="affirmation-section">
        <h2>Affirmation ✨</h2>
        <AffirmationGenerator />
      </div>

      <div className="features-section">
        <div className="feature-card">
          <i className="fas fa-quote-left"></i>
          <h3>Daily Motivation</h3>
          <p>Start your day with a powerful quote to lift your spirits.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-book"></i>
          <h3>Journal Writing</h3>
          <p>Write, reflect, and keep track of your thoughts and progress.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-heartbeat"></i>
          <h3>Breathing Exercises</h3>
          <p>Practice mindfulness and calm your mind with guided breathing.</p>
        </div>
      </div>

      <div className="quick-access">
        <button>Go to Journal</button>
        <button>Try Breathing Exercise</button>
      </div>
    </div>
  );
}

export default Home;
