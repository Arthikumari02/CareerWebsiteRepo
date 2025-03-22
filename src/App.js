import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./component/SignInAndOut/AuthContext";
import PrivateRoute from "./component/SignInAndOut/PrivateRoute";

import LifeCraftHome from "./component/LifeCraftHome";
import LifeCraftHomeNavbar from "./component/LifeCraftHomeNavbar";
import MentalHealthNavbar from "./component/mental-health-motivation-hub/pages/Navbar";
import MentalHealthMotivationalHub from "./component/mental-health-motivation-hub/pages/Home";
import DailyTask from "./component/daily-tasks/DailyTask";
import Quotes from "./component/mental-health-motivation-hub/pages/Quotes";
import Journal from "./component/mental-health-motivation-hub/pages/Journal";
import PersonalizedDashboard from "./component/mental-health-motivation-hub/pages/PersonalizedDashboard";
import SignUp from "./component/SignInAndOut/SignUp";
import SignIn from "./component/SignInAndOut/SignIn";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

function MainApp() {
  const location = useLocation();
  const isMentalHealthPage =
    location.pathname === "/mental-health" ||
    location.pathname === "/quotes" ||
    location.pathname === "/journal"||
    location.pathname === "/gratitude" || 
    location.pathname === "/personalized-dashboard"
    ;

  return (
    <div className="App">
      {isMentalHealthPage ? <MentalHealthNavbar /> : <LifeCraftHomeNavbar />}
      <div className="content">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/career-website-repo" element={<LifeCraftHome />}/>
          <Route
            path="/mental-health"
            element={<PrivateRoute > <MentalHealthMotivationalHub /> </PrivateRoute >}
          />
          <Route path="/todo" element={<PrivateRoute > <DailyTask /> </PrivateRoute>} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/personalized-dashboard" element={<PersonalizedDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
