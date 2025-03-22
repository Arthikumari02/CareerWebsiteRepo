import React, { useState, useEffect } from 'react';
import './styles/PersonalizedDashboard.css';

// Sample challenge data
const prompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's something beautiful you noticed today?",
  "What challenge are you thankful for?",
  "Name three things you appreciate about yourself.",
  "What's a small victory you had today?",
  "Reflect on a happy memory that brings you joy."
];

const PersonalizedDashboard = () => {
  const [day, setDay] = useState(parseInt(localStorage.getItem('currentDay')) || 0);
  const [entries, setEntries] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('entries'));
    return stored || Array(7).fill().map(() => []);
  });
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [completedChallenges, setCompletedChallenges] = useState(JSON.parse(localStorage.getItem('completedChallenges')) || []);
  const [currentEntry, setCurrentEntry] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [cycleCount, setCycleCount] = useState(parseInt(localStorage.getItem('cycleCount')) || 0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  
  // Track last completion date
  const [lastCompletionDate, setLastCompletionDate] = useState(localStorage.getItem('lastCompletionDate') || '');
  
  // Track daily entries (3 required per day)
  const [dailyEntries, setDailyEntries] = useState(() => {
    const storedEntries = JSON.parse(localStorage.getItem('dailyEntries'));
    if (Array.isArray(storedEntries) && storedEntries.length === 7) {
      return storedEntries;
    } else {
      // Initialize with 7 empty arrays for each day
      return Array(7).fill().map(() => []); 
    }
  });
  
  // Check if user can proceed to next day
  const [canCompleteToday, setCanCompleteToday] = useState(() => {
    const today = new Date().toLocaleDateString();
    return today !== lastCompletionDate;
  });
  
  useEffect(() => {
    // Store entries in localStorage, ensuring it is always an array
    localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries));
  }, [dailyEntries]);

  useEffect(() => {
    // Check if user can complete today's challenge
    const today = new Date().toLocaleDateString();
    setCanCompleteToday(today !== lastCompletionDate);
  }, [lastCompletionDate]);

  useEffect(() => {
    // Add entrance animation
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update localStorage when day changes
    localStorage.setItem('currentDay', day.toString());
  }, [day]);

  useEffect(() => {
    // Store cycle count in localStorage
    localStorage.setItem('cycleCount', cycleCount.toString());
  }, [cycleCount]);

  useEffect(() => {
    localStorage.setItem('lastCompletionDate', lastCompletionDate);
  }, [lastCompletionDate]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const calculateProgress = () => {
    return (day / 7) * 100;
  };

  const getLevelBadge = () => {
    if (day === 7) return "🏆 Gratitude Champion";
    if (day >= 5) return "🌟 Almost There!";
    if (day >= 3) return "💪 Keep Going!";
    return "🌱 Start Your Journey!";
  };

  const handleInputChange = (e) => {
    setCurrentEntry(e.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const addEntry = () => {
    if (currentEntry.trim()) {
      const updatedDailyEntries = [...dailyEntries];
      
      // Ensure updatedDailyEntries[day] is an array
      if (!Array.isArray(updatedDailyEntries[day])) {
        updatedDailyEntries[day] = [];
      }
      
      // Add entry with timestamp
      updatedDailyEntries[day] = [...updatedDailyEntries[day], {
        text: currentEntry,
        timestamp: new Date().getTime()
      }];
      
      setDailyEntries(updatedDailyEntries);
      setCurrentEntry('');

      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
    }
  };

  const resetJourney = () => {
    // Increase cycle count
    const newCycleCount = cycleCount + 1;
    setCycleCount(newCycleCount);
    
    // Reset to day 0
    setDay(0);
    
    // Clear daily entries
    const resetDailyEntries = Array(7).fill().map(() => []);
    setDailyEntries(resetDailyEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(resetDailyEntries));
    
    // Reset last completion date
    setLastCompletionDate('');
    
    // Keep the old entries in the gratitude collection
    // We don't reset or clear 'entries' and 'completedChallenges'
    
    setShowCompletionMessage(false);
    
    // Show animation for reset
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const handleSubmitDay = () => {
    // Can only complete one day per calendar day
    if (!canCompleteToday) {
      return;
    }
    
    // Check if 3 entries have been made for the day
    if (dailyEntries[day] && dailyEntries[day].length >= 3) {
      // Current date as string for tracking
      const today = new Date().toLocaleDateString();
      
      // Set last completion date to today
      setLastCompletionDate(today);
      
      // Update entries for the day
      const updatedEntries = [...entries];
      updatedEntries[day] = dailyEntries[day];
      setEntries(updatedEntries);
      localStorage.setItem('entries', JSON.stringify(updatedEntries));
      
      // Add to completed challenges with timestamp
      const updatedChallenges = [...completedChallenges];
      updatedChallenges.push({
        prompt: prompts[day],
        completedOn: new Date().getTime()
      });
      setCompletedChallenges(updatedChallenges);
      localStorage.setItem('completedChallenges', JSON.stringify(updatedChallenges));
      
      // Advance to next day if not the last day
      if (day < 6) {
        const nextDay = day + 1;
        setDay(nextDay);
      } else {
        // Completed all 7 days
        setShowCompletionMessage(true);
      }
      
      // User can't complete another day today
      setCanCompleteToday(false);
      
      // Show success animation
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Gratitude turns what we have into enough.",
      "Happiness is not something ready-made. It comes from your own actions.",
      "The more you practice gratitude, the more you see to be grateful for.",
      "Appreciate the little things, for one day you may look back and realize they were the big things.",
      "Gratitude is the healthiest of all human emotions.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getRemainingEntriesText = () => {
    const currentDayEntries = Array.isArray(dailyEntries[day]) ? dailyEntries[day].length : 0;
    const remaining = 3 - currentDayEntries;
    
    if (remaining === 0) {
      if (!canCompleteToday) {
        return "You've completed today's entries. Come back tomorrow to continue your journey!";
      }
      return "All 3 entries complete! You can now complete this day's challenge.";
    } else if (remaining === 1) {
      return "1 more entry needed to complete today's challenge.";
    } else {
      return `${remaining} more entries needed to complete today's challenge.`;
    }
  };

  const getNextDayMessage = () => {
    if (!canCompleteToday) {
      return (
        <div className="next-day-message">
          <p>You've completed today's challenge! 🎉</p>
          <p>Come back tomorrow to continue with Day {day + 1}'s challenge.</p>
          <p className="next-unlock-time">Next challenge unlocks at midnight.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-container ${theme} ${showAnimation ? 'fade-in' : ''}`}>
      <div className="theme-selector">
        <button 
          onClick={() => handleThemeChange('light')} 
          className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        >
          ☀️ Light
        </button>
        <button 
          onClick={() => handleThemeChange('dark')} 
          className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        >
          🌙 Dark
        </button>
        <button 
          onClick={() => handleThemeChange('custom')} 
          className={`theme-btn ${theme === 'custom' ? 'active' : ''}`}
        >
          🌈 Calm
        </button>
      </div>

      <div className="profile-section">
        <div className="welcome-header">
          <h1>Your Gratitude Journey</h1>
          <div className="level-badge">
            <span>{getLevelBadge()}</span>
          </div>
          {cycleCount > 0 && (
            <div className="cycle-count">
              <span>🔄 Cycles completed: {cycleCount}</span>
            </div>
          )}
        </div>
        <p className="motivational-quote">"{getMotivationalQuote()}"</p>
      </div>

      <div className="main-content">
        <div className="challenge-section">
          {showCompletionMessage ? (
            <div className="completion-message">
              <h2>🎊 Congratulations! 🎊</h2>
              <p>You've completed all 7 days of the gratitude challenge!</p>
              <p>You've built a wonderful habit of expressing gratitude that will contribute to your well-being.</p>
              <button onClick={resetJourney} className="reset-journey-btn">
                Start a New 7-Day Journey
              </button>
            </div>
          ) : (
            <>
              <h2>Day {day + 1} of 7</h2>
              <div className="prompt-card">
                <p>{prompts[day]}</p>
              </div>
              
              {!canCompleteToday ? (
                getNextDayMessage()
              ) : (
                <>
                  <textarea
                    value={currentEntry}
                    onChange={handleInputChange}
                    placeholder="Write your gratitude entry here..."
                    className="reflection-input"
                  />
                  
                  <div className="button-group">
                    <button onClick={addEntry} className="add-entry-btn">
                      Add Entry ({Array.isArray(dailyEntries[day]) ? dailyEntries[day].length : 0}/3)
                    </button>
                    
                    <button 
                      onClick={handleSubmitDay} 
                      className={`submit-btn ${Array.isArray(dailyEntries[day]) && dailyEntries[day].length >= 3 ? 'active' : 'disabled'}`}
                      disabled={!Array.isArray(dailyEntries[day]) || dailyEntries[day].length < 3}
                    >
                      {day < 6 ? "Complete & Continue" : "Complete Challenge"}
                    </button>
                  </div>
                </>
              )}
              
              <div className="entries-status">
                <p>{getRemainingEntriesText()}</p>
              </div>
              
              {Array.isArray(dailyEntries[day]) && dailyEntries[day].length > 0 && (
                <div className="todays-entries">
                  <h4>Today's Entries:</h4>
                  <ul className="entry-list">
                    {dailyEntries[day].map((entry, index) => (
                      <li key={index} className="entry-item">
                        <div className="entry-number">{index + 1}</div>
                        <div className="entry-content">
                          <div className="entry-text">{entry.text || entry}</div>
                          {entry.timestamp && (
                            <div className="entry-timestamp">{formatDate(entry.timestamp)}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="progress-container">
                <div className="progress-label">
                  <span>Your Progress</span>
                  <span>{calculateProgress().toFixed(0)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{width: `${calculateProgress()}%`}}
                  ></div>
                </div>
                <div className="day-markers">
                  {Array(7).fill(0).map((_, index) => (
                    <div 
                      key={index} 
                      className={`day-marker ${index <= day - 1 ? 'completed' : ''}`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="completed-challenges">
          <h3>Your Gratitude Collection</h3>
          {entries.some(dayEntries => Array.isArray(dayEntries) && dayEntries.length > 0) ? (
            <div className="gratitude-history">
              {entries.map((dayEntries, dayIndex) => {
                if (!Array.isArray(dayEntries) || dayEntries.length === 0) return null;
                
                // Get completion date for this day if available
                const dayInfo = completedChallenges[dayIndex];
                const completionDate = dayInfo && dayInfo.completedOn ? 
                  formatDate(dayInfo.completedOn) : 
                  "Completed";
                
                return (
                  <div key={dayIndex} className="day-collection">
                    <h4 className="day-header">Day {dayIndex + 1}: {prompts[dayIndex]}</h4>
                    <div className="completion-date">Completed on: {completionDate}</div>
                    <ul className="gratitude-list">
                      {dayEntries.map((entry, entryIndex) => (
                        <li key={entryIndex} className="gratitude-item">
                          <div className="gratitude-icon">✨</div>
                          <div className="gratitude-content">
                            <span>{entry.text || entry}</span>
                            {entry.timestamp && (
                              <div className="gratitude-timestamp">{formatDate(entry.timestamp)}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">Complete your first challenge to start your gratitude collection!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;