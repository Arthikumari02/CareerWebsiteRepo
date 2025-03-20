import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import LifeCraftHome from "./component/LifeCraftHome";
import LifeCraftHomeNavbar from "./component/LifeCraftHomeNavbar";
import MentalHealthNavbar from "./component/mental-health-motivation-hub/pages/Navbar";
import MentalHealthMotivationalHub from "./component/mental-health-motivation-hub/pages/Home";
import DailyTask from "./component/daily-tasks/DailyTask";
import Quotes from "./component/mental-health-motivation-hub/pages/Quotes";
import Journal from "./component/mental-health-motivation-hub/pages/Journal";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();

  // Show Mental Health Navbar only on these pages
  const isMentalHealthPage =
    location.pathname === "/mental-health" ||
    location.pathname === "/quotes" ||
    location.pathname === "/journal";

  return (
    <div className="App">
      {isMentalHealthPage ? <MentalHealthNavbar /> : <LifeCraftHomeNavbar />}
      <div className="content">
        <Routes>
          <Route path="/career-website-repo" element={<LifeCraftHome />} />
          <Route
            path="/mental-health"
            element={<MentalHealthMotivationalHub />}
          />
          <Route path="/todo" element={<DailyTask />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
