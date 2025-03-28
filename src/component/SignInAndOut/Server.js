import React, { useState, useEffect } from "react";
import { useAuth } from '../../SignInAndOut/AuthContext'; // Assuming you have an auth context
import "./styles/Journal.css";

const Journal = () => {
  const { user } = useAuth(); // Get current user from authentication context
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch entries from backend when component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/journal/entries`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }

        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  const handleSave = async () => {
    if (!entry.trim() || !user) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: entry,
          date: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      const newEntry = await response.json();
      setEntries([newEntry, ...entries]);
      setEntry(""); // Clear input after saving
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/journal/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      const updatedEntries = entries.filter((entry) => entry.id !== entryId);
      setEntries(updatedEntries);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailStorage = async () => {
    if (!user) {
      alert('Please log in to store entries via email');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/journal/email-backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entries: entries
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email backup');
      }

      const result = await response.json();
      alert('Entries successfully backed up to email!');
    } catch (err) {
      setError(err.message);
      alert('Failed to backup entries: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="journal-container">
        <h1>📝 Your Personal Journal</h1>
        <p>Please log in to access your journal</p>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <h1>📝 Your Personal Journal</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Journal Input */}
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts, dreams, and reflections here..."
        disabled={isLoading}
      />
      <div className="journal-actions">
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!entry.trim() || isLoading}
        >
          {isLoading ? "Saving..." : (entry.trim() ? "Save Entry" : "Start Writing...")}
        </button>
        
        {entries.length > 0 && (
          <button
            className="email-backup-button"
            onClick={handleEmailStorage}
            disabled={isLoading}
          >
            📧 Email Backup
          </button>
        )}
      </div>

      {/* Display Previous Entries in Grid */}
      <div className="journal-entries">
        <h2>📖 Previous Entries</h2>
        {isLoading ? (
          <p>Loading entries...</p>
        ) : entries.length === 0 ? (
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
                  <strong>{new Date(date).toLocaleString()}</strong>
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
              <strong>{new Date(selectedEntry.date).toLocaleString()}</strong>
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