import React, { useEffect, useState } from 'react';
import './styles/JourneyAchievementDisplay.css';

const JourneyAchievementDisplay = ({ advanceToNextDay, canCompleteToday }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [email] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser?.email || null;
  });

  // Retrieve user-specific progress
  useEffect(() => {
    if (email) {
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      setCurrentDay(userProgress[email] || 0);
    }
  }, [email]);

  // Update progress for the specific user
  const handleAdvance = () => {
    if (canCompleteToday && currentDay < 6) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      userProgress[email] = nextDay;
      localStorage.setItem('userProgress', JSON.stringify(userProgress));

      advanceToNextDay();
    }
  };

  return (
    <div className="journey-achievement-container">
      <div className="achievement-scroll">
        <div className="journey-path">
          {Array(7).fill(0).map((_, index) => {
            const isPrevious = index < currentDay;
            const isCurrent = index === currentDay;
            const isNext = index > currentDay;

            return (
              <div 
                key={index} 
                className={`journey-step ${isPrevious ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isNext ? 'upcoming' : ''}`}
              >
                <div className="step-connector">{index > 0 && <div className="connector-line"></div>}</div>
                <div className="step-content">
                  <div className="step-banner">
                    <span className="step-name">Day {index + 1}</span>
                    {isPrevious || isCurrent ? 
                      <span className="step-status">✓ Completed</span> : 
                      <span className="step-status-pending">
                        {Math.max(index - (currentDay - 1), 0)} 
                        {index - (currentDay - 1) === 0 ? 'day' : 'days'} away
                      </span>
                    }
                  </div>
                  
                  {isCurrent && (
                    <div className="current-achievement">
                      <div className="achievement-badge">🏆</div>
                      <div className="achievement-message">
                        <h3>Achievement Unlocked!</h3>
                        <p>Day {currentDay + 1} Gratitude Master</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="step-icon">
                    {getIconForDay(index)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="achievement-actions">
        <p className="achievement-congrats">Congratulations on completing Day {currentDay + 1}!</p>
        
        {canCompleteToday ? (
          <button 
            onClick={handleAdvance} 
            className="achievement-continue-btn"
          >
            {currentDay < 6 ? `Continue to Day ${currentDay + 2}` : "Complete My Journey!"}
          </button>
        ) : (
          <button className="achievement-continue-btn" disabled>
            Next Challenge Unlocks at Midnight
          </button>
        )}
        
        {!canCompleteToday && (
          <p className="next-unlock-time">Come back tomorrow to continue your journey!</p>
        )}
      </div>
    </div>
  );
};

// Helper function to get thematic icons for each day
const getIconForDay = (dayIndex) => {
  const icons = [
    '🌱', // Growth - Day 1
    '📖', // Reflection - Day 2
    '🎯', // Focus - Day 3
    '💪', // Strength - Day 4
    '🌈', // Hope - Day 5
    '🔆', // Clarity - Day 6
    '🏆', // Achievement - Day 7
  ];
  return icons[dayIndex];
};

export default JourneyAchievementDisplay;
