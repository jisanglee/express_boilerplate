import React from "react";
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
// import Footer from './components/views/Footer/Footer';
// import NavBar from './components/views/NavBar/NavBar';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LoginPage from './components/views/LoginPage/LoginPage';

import Auth from './hoc/auth';

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/" component={Auth(LandingPage,null)} />
          <Route path="/login" component={Auth(LoginPage,false)} />
          <Route path="/register" component={Auth(RegisterPage,false)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
