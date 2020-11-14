import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
//why does newconver need .js but others dont?
import { NewConversation } from "./pages/NewConversation.js";
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyBkzUn9AgAexTsC0Qsa6EPUKNDuwfkTt_0",
  authDomain: "chat-app-570c1.firebaseapp.com",
  databaseURL: "https://chat-app-570c1.firebaseio.com",
  projectId: "chat-app-570c1",
  storageBucket: "chat-app-570c1.appspot.com",
  messagingSenderId: "397430317190",
  appId: "1:397430317190:web:ff18165f5c1d7390f7f107"
};

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/home'component={Home}/>
        <Route path='/login' component={LogIn} />
        <Route path='/signup' component={SignUp} />
        <Route path='/newConversation' component={NewConversation} />
      </Switch>
    </Router>


  );
}

export default App;
