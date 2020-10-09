import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LogIn></LogIn>
        </Route>

        {/* fix to /signup  later. Set as such for conveniency*/}
        <Route path="/signup">
          <SignUp></SignUp>
        </Route>
      </Switch>
    </Router>


  );
}

export default App;
