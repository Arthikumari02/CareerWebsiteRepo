import React, { useState, useEffect } from 'react';
import './styles/PersonalizedDashboard.css';
import JourneyAchievementDisplay from './JourneyAchievementDisplay';

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
  
  // Track if today's challenge is complete but user can continue adding entries
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  
  // Track which days are completed to show achievements
  const [completedDays, setCompletedDays] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('completedDays')) || [];
    return stored;
  });
  
  // Track daily entries (3 required per day, but can add more)
  const [dailyEntries, setDailyEntries] = useState(() => {
    const storedEntries = JSON.parse(localStorage.getItem('dailyEntries'));
    if (Array.isArray(storedEntries) && storedEntries.length === 7) {
      return storedEntries;
    } else {
      // Initialize with 7 empty arrays for each day
      return Array(7).fill().map(() => []); 
    }
  });
  
  // Check if user can advance to next day
  const [canAdvanceToNextDay, setCanAdvanceToNextDay] = useState(() => {
    const today = new Date().toLocaleDateString();
    return today !== lastCompletionDate;
  });
  
  // Check if user can complete today's challenge (needs 3 entries and hasn't completed today)
  const [canCompleteToday, setCanCompleteToday] = useState(false);
  
  // Track if day completion message should be shown
  const [showDayCompletionMessage, setShowDayCompletionMessage] = useState(false);
  
  // Add insights tab state
  const [activeTab, setActiveTab] = useState('daily');
  
  useEffect(() => {
    localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries));
    
    // Update canCompleteToday whenever dailyEntries changes
    // User can complete today if they have at least 3 entries and haven't completed this day yet
    const hasEnoughEntries = Array.isArray(dailyEntries[day]) && dailyEntries[day].length >= 3;
    const hasNotCompletedDay = !completedDays.includes(day);
    setCanCompleteToday(hasEnoughEntries && hasNotCompletedDay);
  }, [dailyEntries, day, completedDays]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setCanAdvanceToNextDay(today !== lastCompletionDate);
  }, [lastCompletionDate]);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentDay', day.toString());
  }, [day]);

  useEffect(() => {
    localStorage.setItem('cycleCount', cycleCount.toString());
  }, [cycleCount]);

  useEffect(() => {
    localStorage.setItem('lastCompletionDate', lastCompletionDate);
  }, [lastCompletionDate]);

  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    setIsDayCompleted(completedDays.includes(day));
  }, [day, completedDays]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const calculateProgress = () => {
    return (completedDays.length / 7) * 100;
  };

  const getLevelBadge = () => {
    const completedCount = completedDays.length;
    if (completedCount === 7) return "🏆 Gratitude Champion";
    if (completedCount >= 5) return "🌟 Almost There!";
    if (completedCount >= 3) return "💪 Keep Going!";
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
      
      if (!Array.isArray(updatedDailyEntries[day])) {
        updatedDailyEntries[day] = [];
      }
      
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
    const newCycleCount = cycleCount + 1;
    setCycleCount(newCycleCount);
    
    setDay(0);
    
    const resetDailyEntries = Array(7).fill().map(() => []);
    setDailyEntries(resetDailyEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(resetDailyEntries));
    
    setLastCompletionDate('');
    setCompletedDays([]);
    
    setShowCompletionMessage(false);
    setIsDayCompleted(false);
    setShowDayCompletionMessage(false);
    
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const handleSubmitDay = () => {
    // Only allow completion if user has 3+ entries and hasn't completed this day
    if (!canCompleteToday) return;
    
    const newCompletedDays = [...completedDays];
    if (!newCompletedDays.includes(day)) {
      newCompletedDays.push(day);
      setCompletedDays(newCompletedDays);
    }
    
    const updatedEntries = [...entries];
    updatedEntries[day] = dailyEntries[day];
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
    
    const updatedChallenges = [...completedChallenges];
    updatedChallenges.push({
      prompt: prompts[day],
      completedOn: new Date().getTime()
    });
    setCompletedChallenges(updatedChallenges);
    localStorage.setItem('completedChallenges', JSON.stringify(updatedChallenges));
    
    setIsDayCompleted(true);
    setShowDayCompletionMessage(true);
    
    // Set today's date as last completion date
    const today = new Date().toLocaleDateString();
    setLastCompletionDate(today);
    localStorage.setItem('lastCompletionDate', today);
  };
  
  const advanceToNextDay = () => {
    if (!canAdvanceToNextDay) return;
    
    if (day < 6) {
      const nextDay = day + 1;
      setDay(nextDay);
      setShowDayCompletionMessage(false);
      setIsDayCompleted(false);
    } else {
      setShowCompletionMessage(true);
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
    
    if (remaining <= 0) {
      if (isDayCompleted) {
        return "Day completed! You can keep adding more entries if you'd like.";
      } else if (!canAdvanceToNextDay) {
        return "You've completed today's entries. Come back tomorrow to continue your journey!";
      }
      return "All 3 entries complete! You can now complete this day's challenge.";
    } else if (remaining === 1) {
      return "1 more entry needed to complete today's challenge.";
    } else {
      return `${remaining} more entries needed to complete today's challenge.`;
    }
  };

  const getDayCompletionMessage = () => {
    return (
      <JourneyAchievementDisplay 
        day={day} 
        advanceToNextDay={advanceToNextDay} 
        canCompleteToday={canAdvanceToNextDay} 
      />
    );
  };

  // Calculate total entries across all days for insights
  const getTotalEntriesCount = () => {
    return entries.reduce((total, dayEntries) => {
      return total + (Array.isArray(dayEntries) ? dayEntries.length : 0);
    }, 0);
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
        
        {/* Enhanced progress visualization */}
        <div className="progress-container">
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
                className={`day-marker ${completedDays.includes(index) ? 'completed' : ''} ${day === index ? 'current' : ''}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Today's Challenge
        </button>
        <button 
          className={`tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          Gratitude Collection
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
        <button 
          className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`}
          onClick={() => setActiveTab('journey')}
        >
          Journey
        </button>
      </div>

      <div className="main-content">
        {activeTab === 'daily' && (
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
                
                {showDayCompletionMessage ? (
                  getDayCompletionMessage()
                ) : !canAdvanceToNextDay && isDayCompleted ? (
                  <div className="next-day-message">
                    <p>You've completed today's challenge! 🎉</p>
                    <p>Come back tomorrow to continue with Day {day + 2}'s challenge.</p>
                    <p className="next-unlock-time">Next challenge unlocks at midnight.</p>
                  </div>
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
                        Add Entry ({Array.isArray(dailyEntries[day]) ? dailyEntries[day].length : 0}{isDayCompleted ? '+' : '/3'})
                      </button>
                      
                      {!isDayCompleted && (
                        <button 
                          onClick={handleSubmitDay} 
                          className={`submit-btn ${canCompleteToday ? 'active' : 'disabled'}`}
                          disabled={!canCompleteToday}
                        >
                          Complete Day {day + 1}
                        </button>
                      )}
                    </div>
                  </>
                )}
                
                <div className="entries-status">
                  <p>{getRemainingEntriesText()}</p>
                  {isDayCompleted && !showDayCompletionMessage && (
                    <div className="day-completion-note">
                      <span className="checkmark">✓</span> Day {day + 1} completed! You can continue adding entries.
                    </div>
                  )}
                </div>
                
                {Array.isArray(dailyEntries[day]) && dailyEntries[day].length > 0 && (
                  <div className="todays-entries">
                    <h4>Today's Entries:</h4>
                    <ul className="entry-list">
                      {dailyEntries[day].map((entry, index) => (
                        <li key={index} className={`entry-item ${index >= 3 && isDayCompleted ? 'additional-entry' : ''}`}>
                          <div className={`entry-number ${index >= 3 && isDayCompleted ? 'bonus' : ''}`}>
                            {index >= 3 && isDayCompleted ? '★' : index + 1}
                          </div>
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
              </>
            )}
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="completed-challenges">
            <h3>Your Gratitude Collection</h3>
            {entries.some(dayEntries => Array.isArray(dayEntries) && dayEntries.length > 0) ? (
              <div className="gratitude-history">
                {entries.map((dayEntries, dayIndex) => {
                  if (!Array.isArray(dayEntries) || dayEntries.length === 0) return null;
                  
                  const dayInfo = completedChallenges.find(challenge => 
                    challenge.prompt === prompts[dayIndex]
                  );
                  const completionDate = dayInfo && dayInfo.completedOn ? 
                    formatDate(dayInfo.completedOn) : 
                    "Completed";
                  
                  return (
                    <div key={dayIndex} className="day-collection">
                      <h4 className="day-header">Day {dayIndex + 1}: {prompts[dayIndex]}</h4>
                      <div className="completion-date">Completed on: {completionDate}</div>
                      <ul className="gratitude-list">
                        {dayEntries.map((entry, entryIndex) => (
                          <li key={entryIndex} className={`gratitude-item ${entryIndex >= 3 ? 'additional-gratitude' : ''}`}>
                            <div className={`gratitude-icon ${entryIndex >= 3 ? 'bonus' : ''}`}>
                              {entryIndex >= 3 ? '★' : '✨'}
                            </div>
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
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>Complete your first challenge to start your gratitude collection!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-section">
            <h3>Your Gratitude Insights</h3>
            
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{completedDays.length}/7</div>
                <div className="stat-label">Days Completed</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">✍️</div>
                <div className="stat-value">{getTotalEntriesCount()}</div>
                <div className="stat-label">Total Entries</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🔄</div>
                <div className="stat-value">{cycleCount}</div>
                <div className="stat-label">Cycles Completed</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">
                  {(() => {
                    const bonusEntries = entries.reduce((total, dayEntries) => {
                      return total + (Array.isArray(dayEntries) && dayEntries.length > 3 
                        ? dayEntries.length - 3 : 0);
                    }, 0);
                    return bonusEntries;
                  })()}
                </div>
                <div className="stat-label">Bonus Entries</div>
              </div>
            </div>
            
            <div className="insights-content">
              <h4>Benefits of Your Gratitude Practice</h4>
              <ul className="benefits-list">
                <li className="benefit-item">
                  <div className="benefit-icon">🧠</div>
                  <div className="benefit-text">
                    <h5>Enhanced Mental Well-being</h5>
                    <p>Regular gratitude practice helps reduce stress and increase positive emotions.</p>
                  </div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">😴</div>
                  <div className="benefit-text">
                    <h5>Better Sleep</h5>
                    <p>Focusing on positive thoughts before bed can improve sleep quality.</p>
                  </div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">❤️</div>
                  <div className="benefit-text">
                    <h5>Stronger Relationships</h5>
                    <p>Expressing gratitude strengthens your connections with others.</p>
                  </div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">🌱</div>
                  <div className="benefit-text">
                    <h5>Increased Resilience</h5>
                    <p>Gratitude helps build mental strength to overcome challenges.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <JourneyAchievementDisplay 
            day={day} 
            advanceToNextDay={advanceToNextDay} 
            canCompleteToday={canAdvanceToNextDay} 
          />
        )}
      </div>
    </div>
  );
};

export default PersonalizedDashboard;