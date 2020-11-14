import { app } from 'firebase';
import React from 'react';
import './SignUp.css'; 
import firebase from 'firebase';

export class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            
            firstNameInputReminder : '',
            lastNameInputReminder : '',
            emailReminder : '',
            passwordReminder : '',
            confirmPasswordReminder : '',
            errorMessage: '',
            succesfullySignedUp: ''
        };
    }

    //___________________________
    // FIRST AND LAST NAME INPUTS
    //___________________________
    //save first name 
    saveFirstNameInput = e => {
        this.setState({
            firstName: e.target.value
        })
    }

    checkFirstName = () => {
        if (this.state.firstName === '') {
            this.setState({
                firstNameInputReminder : 'Please input your first name'
            })
        }
        else {
            this.setState({
                firstNameInputReminder : ''
            })
        }
        
    }

    //save last name 
    saveLastNameInput = e => {
        this.setState({
            lastName: e.target.value
        })
    }

    

    checkLastName = () => {
        if (this.state.lastName === '') {
            this.setState({
                lastNameInputReminder : 'Please input your last name'
            })       
        } else {
            this.setState({
                lastNameInputReminder : ''
            })
        }
 
    }

    //___________
    // EMAIL INPUT
    //___________
    //save email 
    saveEmailInput = e => {
        let emailAddress = e.target.value;
        this.setState({
            email: emailAddress
        })
    }

    // check email. 
    checkEmail = () => {
        //regex validation
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === '') {
            this.setState({
                emailReminder : 'Please input your email adress'
            })
        } else if (!pattern.test(String(this.state.email).toLowerCase())) {
            this.setState({
                emailReminder : 'Invalid email address'
            })
        } else {
            this.setState({
                emailReminder : ''
            })
        }

    }


    //_______________
    // PASSWORD INPUT
    //_______________
    //save the set password into password
    savePasswordInput = e => {
        this.setState({
            password: e.target.value
        })
    }

    checkPassword = () => {   
        if (this.state.password === '') {
            this.setState({
                passwordReminder : 'Please input your password'
            })   
        } else if (this.state.password.length <= 6) {
            this.setState({
                passwordReminder : 'Password must be longer than 6 characters'
            }) 
        } else {
            this.setState({
                passwordReminder : ''
            })
        }
    }

    // save confirm password
    saveConfirmPass = e => {
        this.setState({
            confirmPassword: e.target.value
        })
    }

    checkConfirmPassWord = () => {
        if (this.state.confirmPassword === ''){
            this.setState({
                confirmPasswordReminder : 'Please input your confirm password'
            })
        }
        else if (this.state.confirmPassword !== this.state.password) {
            this.setState({
                confirmPasswordReminder : 'Confirm password does not match inputted password'
            })
        } else {
            this.setState({
                confirmPasswordReminder : ''
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
    
    //_______________
    // REGISTERING
    //_______________
    // duongphuonglinh1999@gmail.com
    register = async () => {

        if (this.state.firstNameInputReminder === '' && this.state.lastNameInputReminder === '' && this.state.emailReminder === '' && this.state.passwordReminder === '' && this.state.confirmPasswordReminder === ''){

            // create an account on Firebase
            try {
                await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)           
                await firebase.auth().currentUser.updateProfile({
                    displayName: this.state.lastName + ' ' + this.state.firstName
                })
                this.setState({
                    errorMessage: '',
                    succesfullySignedUp: alert("Register!!! Now verify your email.")
                }) 
                window.location.href = "http://localhost:3000/login";
                // send email authentification when succesfully registered
                firebase.auth().currentUser.sendEmailVerification();
                
            } catch (error) {
                this.setState({
                    errorMessage : error.message
                })
            }          
        }
    }

    render() {

        return (<div className="signUp">
            <h1>Chat</h1>

            {/* first name input*/}
            <span className="name">
                <input id="firstName" type="text" placeholder="First Name" onChange={this.saveFirstNameInput} onBlur={this.checkFirstName}></input>
                <input id="lastName" type="text" placeholder="Last Name" onChange={this.saveLastNameInput}  onBlur={this.checkLastName}></input>
            </span><br />

             {/* last name input*/}
            <span className="name">
                <p className="warning">{this.state.firstNameInputReminder}</p>
                <p className="warning">{this.state.lastNameInputReminder}</p>
            </span>

            {/* email input*/}
            <input id="email" type="text" placeholder="Email" onChange={this.saveEmailInput} onBlur={this.checkEmail}></input><br />
            <p className="warning">{this.state.emailReminder}</p>
            

            {/* password input */}
            <span className="password">
                <input id="password" type={this.state.showPassword ? "text" : "password"} placeholder="Password" onChange={this.savePasswordInput} onBlur={this.checkPassword}></input>
                <button onClick={this.showPassword}>{this.state.showPassword ? "Hide" : "Show"}</button>
            </span> <br />
            <p className="warning">{this.state.passwordReminder}</p>

            {/* confirm password input */}
            <span className="password">
                <input id="confirmPassword" type={this.state.showPassword ? "text" : "password"} placeholder="Confirm password" onChange={this.saveConfirmPass} onBlur={this.checkConfirmPassWord}></input>
                <button onClick={this.showPassword}>{this.state.showPassword ? "Hide" : "Show"}</button>
            </span> <br />
            <p className="warning">{this.state.confirmPasswordReminder}</p>

            {/* register button */}
            <span>
                <button id='register' onClick={this.register}>Register</button>
                <p>Already have an account? <a href="http://localhost:3000/login">Log in</a></p>
                <p>{this.state.errorMessage}</p>
                <p>{this.state.succesfullySignedUp}</p>
            </span>
        </div>
        )
    }
}