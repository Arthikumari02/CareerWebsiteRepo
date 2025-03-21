import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LifeCraftHome.css';

const CareerWebsiteHome = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Daily To-Do List', path: '/todo' },
    { title: 'Life Goals', path: '/lifegoals' },
    { title: 'Checklists', path: '/checklists' },
    { title: 'Mental Health & Motivational Hub', path: "/mental-health" },
    { title: 'Buddy System', path: '/buddy-system' },
    { title: 'Self-Care Playlist', path: '/self-care-playlist' },
  ];

  return (
      <div className="main-container">
        <div className='card-container'>
        {features.map((feature, index) => (
          <div className="card" key={index} onClick={() => navigate(feature.path)}>
            {feature.title}
          </div>
        ))}
        </div>
        <div className="after-cards-section">
          {/* Who We Are Section */}
          <div className="who-we-are">
            <div className="who-we-are-text">
              <h1>Who We Are</h1>
              <p style={{fontSize:"30px"}}>
                Life Craft is designed to help you build productive habits, track goals,
                and stay motivated.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CareerWebsiteHome;
