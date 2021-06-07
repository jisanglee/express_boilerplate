import React from "react";
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import Footer from './components/views/Footer/Footer';
import NavBar from './components/views/NavBar/NavBar';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LoginPage from './components/views/LoginPage/LoginPage';
function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
