import { render } from '@testing-library/react';
import React from 'react';

export class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailReminder : '',
            passwordReminder : '',
        };
    }
    checkEmail = () => {
        //regex validation
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === '') {
            this.setState({
                emailReminder : <p style={this.warning}>Please input your email adress</p>
            })
        } else if (!pattern.test(String(this.state.email).toLowerCase())) {
            this.setState({
                emailReminder : <p style={this.warning}>Invalid email address</p>
            })
        }
    }

    checkPassword = () => {   
        if (this.state.password === '') {
            this.setState({
                passwordReminder : <p style={this.warning}>Please input your password</p>
            })   
        } 
    }   
    // how to have email and password reminder exactly as in SignUp.js ?
    render() {
        return (<div>
            <h1>Login</h1>

            <input type="text" placeholder="Email" onChange={this.saveEmailInput} onBlur={this.checkEmail}></input><br />
            {this.state.emailReminder}

            <input type="text" placeholder="Password" onChange={this.setPassword} onBlur={this.checkPassword}></input><br />
            {this.state.passwordReminder}
        </div>)
    }
}