import React, { useState, useEffect } from 'react';
import './styles/GratitudeChallenge.css';

const prompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's something beautiful you noticed today?",
  "What challenge are you thankful for?",
  "Name three things you appreciate about yourself.",
  "What’s a small victory you had today?",
  "Reflect on a happy memory that brings you joy."
];

const GratitudeChallenge = () => {
  const [day, setDay] = useState(parseInt(localStorage.getItem('currentDay')) || 0);
  const [entries, setEntries] = useState(JSON.parse(localStorage.getItem('entries')) || Array(7).fill(''));
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    localStorage.setItem('currentDay', day);
    localStorage.setItem('entries', JSON.stringify(entries));

    if (day < 7) {
      const timer = setTimeout(() => setReminder(true), 5000); // Reminder after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [day, entries]);

  const handleInputChange = (e) => {
    const updatedEntries = [...entries];
    updatedEntries[day] = e.target.value;
    setEntries(updatedEntries);
  };

  const handleNextDay = () => {
    if (day < 6) {
      setDay(day + 1);
      setReminder(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(entries[day]);
    alert('Reflection copied to clipboard!');
  };

  return (
    <div className="gratitude-container">
      {day < 7 ? (
        <>
          <h1>Day {day + 1} - Gratitude Challenge</h1>
          <p>{prompts[day]}</p>
          <textarea
            value={entries[day]}
            onChange={handleInputChange}
            placeholder="Write your thoughts here..."
          />
          <div className="button-group">
            {reminder && <p className="reminder">Don't forget to complete your journal today!</p>}
            <button onClick={handleNextDay}>Next Day</button>
            <button onClick={handleShare}>Share Reflection</button>
          </div>
        </>
      ) : (
        <div className="completion-section">
          <h1>Congratulations! 🎉</h1>
          <p>You’ve completed the 7-Day Gratitude Challenge.</p>
          <p>Here’s your completion badge:</p>
          <div className="badge">🏆 Gratitude Champion</div>
        </div>
      )}
    </div>
  );
};

export default GratitudeChallenge;
