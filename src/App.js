import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LifeCraftHome from "./component/LifeCraftHome";
import LifeCraftHomeNavbar from "./component/LifeCraftHomeNavbar"
import MentalHealthMotivationalHub from "../src/component/mental-health-motivation-hub/pages/Home"
import DailyTask from "../src/component/daily-tasks/DailyTask"

function App() {
  return (
    <Router>
      <div className="App">
        <LifeCraftHomeNavbar/>
        <div className="content">
          <Routes>
            <Route path="/career-website-repo" element={<LifeCraftHome />} />
            <Route path="/mental-health" element={<MentalHealthMotivationalHub />} />
            <Route path="/todo" element={<DailyTask />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
