import React from 'react';

export class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstNameInputReminder : '',
            lastNameInputReminder : '',
            emailReminder : '',
            passwordReminder : '',
            confirmPasswordReminder : ''
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
    // delete warning after the user satisfies all the input requirements ?
        else {
            this.setState({
                firstNameInputReminder : ''
            })
        }
        
    }

    //save last name 
    saveLastNameInput = e => {
        this.setState({
            lastname: e.target.value
        })
    }

    

    checkLastName = () => {
        if (this.state.lastName === '') {
            this.setState({
                lastNameInputReminder : <p style={this.warning}>Please input your last name</p>
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
                emailReminder : <p style={this.warning}>Please input your email adress</p>
            })
        } else if (!pattern.test(String(this.state.email).toLowerCase())) {
            this.setState({
                emailReminder : <p style={this.warning}>Invalid email address</p>
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
                passwordReminder : <p style={this.warning}>Please input your password</p>
            })   
        } else if (this.state.password.length <= 6) {
            this.setState({
                passwordReminder : <p style={this.warning}>Password must be longer than 6 characters</p>
            }) 
        }
    }

    // save confirm password
    saveConfirmPass = e => {
        this.setState({
            confirmPassWord: e.target.value
        })
    }

    checkConfirmPassWord = () => {

        if (this.state.confirmPassword === ''){
            this.setState({
                confirmPasswordReminder : <p style={this.warning}>Please input your confirm password</p>
            })
        }
        else if (this.state.confirmPassword !== this.state.password) {
            this.setState({
                confirmPasswordReminder : <p style={this.warning}>Confirm password does not match inputted password</p>
            })
        }
    }


    //_________________________
    // CHECK BEFORE REGISTERING
    //_________________________

    //Fix all of the rendering of the reminder as fixed in firstNameInputReminder?

    render() {
        const warning = { color: 'red' };

        return (<div>
            <h1>Chat</h1>

            <span>
                <input type="text" placeholder="First Name" onChange={this.saveFirstNameInput} onBlur={this.checkFirstName}></input>
                <input type="text" placeholder="Last Name" onChange={this.saveLastNameInput}  onBlur={this.checkLastName}></input>
            </span><br />
            <span>
                <p style={warning}>{this.state.firstNameInputReminder}</p>
                {this.state.lastNameInputReminder}
            </span>

            <input type="text" placeholder="Email" onChange={this.saveEmailInput} onBlur={this.checkEmail}></input><br />
            {this.state.emailReminder}

            <input type="text" placeholder="Password" onChange={this.setPassword} onBlur={this.checkPassword}></input><br />
            {this.state.passwordReminder}

            <input type="text" placeholder="Confirm password" onChange={this.saveConfirmPass} onBlur={this.checkConfirmPassWord}></input><br />
            {this.state.confirmPasswordReminder}

            <span>
                <p>Already have an account? <a href="http://localhost:3000/login">Log in</a></p>
                <button onClick={this.check}>Register</button>
            </span>

        </div>
        )
    }
}