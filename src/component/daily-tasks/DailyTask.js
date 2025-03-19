import React from "react";
import "./styles/DailyTask.css";

const DailyTask = () => {
  return (
    <div className="container">
      <nav className="sidebar">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <main className="content">
        <p>
            Welcome
        </p>
      </main>
    </div>
  );
};

export default DailyTask;