import React, { useState } from "react";
import "./styles/Journal.css";

const Journal = () => {
  const [entry, setEntry] = useState("");

  const handleSave = () => {
    alert("Journal entry saved!");
    setEntry("");
  };

  return (
    <div className="journal-container">
      <h2 className="journal-heading">📝 Your Personal Journal</h2>
      <textarea
        className="journal-textarea"
        rows="10"
        cols="50"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts, dreams, and reflections here..."
      />
      <br />
      <button className="save-button" onClick={handleSave} disabled={!entry.trim()}>
        {entry.trim() ? "Save Entry" : "Start Writing..."}
      </button>
    </div>
  );
};

export default Journal;
