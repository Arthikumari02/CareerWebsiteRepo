import React, { useState, useEffect } from "react";
import "./styles/Journal.css";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // For modal display

  // Load previous entries when component mounts
  useEffect(() => {
    const savedEntries =
      JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(savedEntries);
  }, []);

  const handleSave = () => {
    if (!entry.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: entry,
      date: new Date().toLocaleString(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));

    setEntry(""); // Clear input after saving
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  };

  return (
    <div className="journal-container">
      <h2 className="journal-heading">📝 Your Personal Journal</h2>

      {/* Journal Input */}
      <textarea
        className="journal-textarea"
        rows="5"
        cols="50"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts, dreams, and reflections here..."
      />
      <br />
      <button
        className="save-button"
        onClick={handleSave}
        disabled={!entry.trim()}
      >
        {entry.trim() ? "Save Entry" : "Start Writing..."}
      </button>

      {/* Display Previous Entries in Grid */}
      <div className="journal-entries">
        <h3>📖 Previous Entries</h3>
        {entries.length === 0 ? (
          <p>No previous entries yet. Start writing!</p>
        ) : (
          <div className="entries-grid">
            {entries.map(({ id, text, date }) => (
              <div
                key={id}
                className="entry"
                onClick={() => setSelectedEntry({ id, text, date })}
              >
                <p>
                  <strong>{date}</strong>
                </p>
                <p className="entry-preview">
                  {text.length > 50 ? text.substring(0, 50) + "..." : text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Full Entry */}
      {selectedEntry && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setSelectedEntry(null)}
            >
              ✖
            </button>
            <p>
              <strong>{selectedEntry.date}</strong>
            </p>
            <p>{selectedEntry.text}</p>
            <button
              className="delete-button"
              onClick={() => {
                handleDelete(selectedEntry.id);
                setSelectedEntry(null);
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
