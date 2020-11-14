import { render } from '@testing-library/react';
import React from 'react';
import './LogIn.css';
import firebase from 'firebase';

export class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailReminder: '',
            passwordReminder: '',
            errorMessage: '',
            showPassword: false
        };
    }

    saveEmailInput = e => {
        let emailAddress = e.target.value;
        this.setState({
            email: emailAddress
        })
    }

    checkEmail = () => {
        //regex validation
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === '') {
            this.setState({
                emailReminder: 'Please input your email address'
            })
        } else if (!pattern.test(String(this.state.email).toLowerCase())) {
            this.setState({
                emailReminder: 'Invalid email address'
            })
        } else {
            this.setState({
                emailReminder: ''
            })
        }
    }

    savePasswordInput = e => {
        this.setState({
            password: e.target.value
        })
    }

    checkPassword = () => {
        if (this.state.password === '') {
            this.setState({
                passwordReminder: 'Please input your password'
            })
        } else {
            this.setState({
                passwordReminder: ''
            })
        }
    }

    loggingIn = async () => {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            if (userCredential.user.emailVerified === false) {
                this.setState({
                    errorMessage: alert("You havent verified your email address. Please verify your email address so that you can log in"),
                })
                // delete info if email hasnt been verified
                firebase.auth().signOut()
            } else {
                // redirect to home.
                this.props.history.push('/home')
                this.setState({
                    errorMessage: ''
                })
            }
        } catch (error) {
            this.setState({
                errorMessage: alert(error.message)
            })
        }
    }


    showPassword = () => {
        if( this.state.showPassword  !== false) {
            this.setState({
                showPassword: false
            })
        } else {
            this.setState({
                showPassword: true
            })
        }
    }
    // duongphuonglinh1999@gmail.com
    render() {
        const warning = { color: 'red' };
        return (<div className="logIn">
            <h1>Login</h1>

            <input className="email" type="text" placeholder="Email" onChange={this.saveEmailInput} onBlur={this.checkEmail}></input><br />
            <p style={warning}>{this.state.emailReminder}</p>

            {/* where are all the buttons? chinh width va height de button duoc display*/}
            <span className="password">
                <input type={this.state.showPassword ? "text" : "password"} placeholder="Password" onChange={this.savePasswordInput} onBlur={this.checkPassword}></input>
                <button onClick={this.showPassword} type="button">{this.state.showPassword ? "Hide" : "Show"}</button>
            </span>

            <p style={warning}>{this.state.passwordReminder}</p>

            <button className="logInButton" onClick={this.loggingIn}>Log In</button>
            <p>{this.state.errorMessage}</p>
        </div>)
    }
}