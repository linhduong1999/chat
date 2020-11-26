import { app } from 'firebase';
import React from 'react';
import './NewConversation.css'; 
import firebase from 'firebase';

// check email see if valid?
export class NewConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:  {},
            conversationName : "",
            friendEmail: "",
            errorMessage: ""
        };
    }

    componentDidMount() {

        // authorizing users'login
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                this.setState({
                    loading: false,
                    userInfo: {
                        email: user.email,
                        name: user.displayName
                    }
                })          

            } else {
                this.setState({
                    loading: false,
                    userInfo: undefined
                })
            }

        })

    }


    saveConversationName = e => {
        this.setState({
            conversationName: e.target.value
        })
    }
    saveFriendEmail = e => {
        this.setState({
            friendEmail: e.target.value
        })
    }
   
    createConversation = async e => {
        e.preventDefault(); // what is this for?
        try {
            const newConversation = await firebase.firestore().collection('conversations').add({
                //...  members lacking the user itself?
                createdAt: new Date(),  
                members: [this.state.friendEmail, this.state.userInfo.email],
                name: this.state.conversationName,
                newMessage: false
            })
            this.props.history.push('/home')
        } catch (error) {
            this.setState({
                errorMessage: error
            })
            alert(error.message)
        }
    }

    cancelNewConversation = e => {
        e.preventDefault(); // what is this for?
        this.props.history.push('/home');
    }

    render() {
        return (<div className="new Conversation">
                <h1>Create a new conversation</h1>
                <input type="text" placeholder="Connversation name" onChange={this.saveConversationName}></input><br/>
                <input type="text" placeholder="Friend email" onChange={this.saveFriendEmail}></input><br/>
                <button onClick={this.createConversation}>Create</button>
                <button onClick={this.cancelNewConversation}>Cancel</button>
        </div>)
    }
}