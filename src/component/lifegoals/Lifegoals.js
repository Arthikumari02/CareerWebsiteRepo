import React, { useRef } from "react";
import "./Style/Lifegoals.css";

const matches = [
  {
    title: "PAK vs NZ 2025",
    subtitle: "5th T20 , Sky Stadium, Wellington",
    teams: ["New Zealand", "Pakistan"],
    time: "33s",
  },
  {
    title: "AUSW vs NZW 2025",
    subtitle: "3rd T20 , Sky Stadium, Wellington",
    score: { team1: "NZW 172/8 (20.0)", team2: "AUSW 180/4 (20.0)" },
    result: "AUSW won by 8 runs",
  },
  {
    title: "National T20 Cup 2025",
    subtitle: "1st Semi-Final , Iqbal Stadium, Faisalabad",
    teams: ["Abbottabad Region", "Peshawar Region"],
    time: "08h : 55m",
  },
  {
    title: "National T20 Cup 2025",
    subtitle: "1st Semi-Final , Iqbal Stadium, Faisalabad",
    teams: ["Abbottabad Region", "Peshawar Region"],
    time: "08h : 55m",
  },
  {
    title: "National T20 Cup 2025",
    subtitle: "1st Semi-Final , Iqbal Stadium, Faisalabad",
    teams: ["Abbottabad Region", "Peshawar Region"],
    time: "08h : 55m",
  },
  {
    title: "National T20 Cup 2025",
    subtitle: "1st Semi-Final , Iqbal Stadium, Faisalabad",
    teams: ["Abbottabad Region", "Peshawar Region"],
    time: "08h : 55m",
  },
];

const Lifegoals = () => {
  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const cardWidth = carousel.querySelector(".carousel-card").offsetWidth;
      const scrollAmount = cardWidth + 16; // Card width + gap

      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Matches for you</h2>
      </div>
      <div className="carousel-wrapper">
        <div className="carousel-inner" ref={carouselRef}>
          {matches.map((match, index) => (
            <div key={index} className="carousel-card">
              <p className="match-time">{match.time || ""}</p>
              <h3 className="match-title">{match.title}</h3>
              <p className="match-subtitle">{match.subtitle}</p>
              <div className="match-content">
                {match.teams ? (
                  match.teams.map((team, i) => (
                    <p key={i} className="match-team">
                      {team}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="match-score">{match.score.team1}</p>
                    <p className="match-score">{match.score.team2}</p>
                    <p className="match-result">{match.result}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-navigation">
        <button
          className="carousel-btn left"
          onClick={() => handleScroll("left")}
        >
          ❮
        </button>
        <button
          className="carousel-btn right"
          onClick={() => handleScroll("right")}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Lifegoals;
