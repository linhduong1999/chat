import React from 'react';
import firebase, { firestore } from 'firebase';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            userInfo: {},
            messageInput: '',
            messages: [],
            errorMessage: '',
            activeConversation: '',
            participatedConversations: [],
            showTimeSent: undefined,
            notInitStatesNewMessage: [],
            notInitStateActiveConversation: false
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


                // when logged in successfully, display conversations that the signed in user is in.
                firebase.firestore().collection('conversations').where("members", "array-contains", user.email).onSnapshot(async querySnapshot => {
                    const newParticipatedConversations = []; // local participatedConversations contains only newly created conversation
                    const modifiedParticipatedConversations = [...this.state.participatedConversations]; // for modified ParticipatedConversations (by adding new member for example)
                    // querySnapshot is an array containing all info of newly added components.
                    
                    querySnapshot.docChanges().forEach(change => { // if conversation is new
                        if (change.type === "added") {                        
                            newParticipatedConversations.push({
                                id: change.doc.id,
                                ...change.doc.data()
                            })
                        }
                        if (change.type === "modified") { // if conver is modified (by adding new member for example)
                            

                            this.state.participatedConversations.forEach((conversation, idx) => {
                                console.log("conversation.id", conversation.id, "     change.doc.id", change.doc.id)
                                if(conversation.id === change.doc.id){
                                    modifiedParticipatedConversations[idx] = {
                                        id: change.doc.id,
                                        ...change.doc.data()
                                    }
                                }
                            })

                            if (this.state.activeConversation.id === change.doc.id) {
                                this.setState({
                                    activeConversation: {
                                        id: change.doc.id,
                                        ...change.doc.data()}
                                })
                            }

                        }
                    })
                    

                    // default active conversation to first conversation in the participatedConversations list if it's the first time
                    if (!this.state.notInitStateActiveConversation) {
                        this.setState({
                            participatedConversations: [...newParticipatedConversations, ...modifiedParticipatedConversations],
                            activeConversation: newParticipatedConversations[0]
                        })
                    } else {
                        this.setState({
                            participatedConversations: [...newParticipatedConversations, ...modifiedParticipatedConversations]
                        })
                    }


                    // checking whether newMessage is sent to active conversation or not. 
                    newParticipatedConversations.forEach((conversation, index) => {
                        firebase.firestore().collection("messages").where("conversation", "==", conversation.id).onSnapshot(querySnapshot => {

                            // check if onSnapshot is rendering for the first time or not to make newMessage true or not
                            if (!this.state.notInitStatesNewMessage[index]) {
                                let notInitStatesNewMessage = [...this.state.notInitStatesNewMessage];
                                notInitStatesNewMessage[index] = true;

                                this.setState({
                                    notInitStatesNewMessage: notInitStatesNewMessage
                                })
                            } else {
                                // if active -> display
                                if (conversation.id === this.state.activeConversation.id) {
                                    let newMessages = [];
                                    querySnapshot.docChanges().forEach(change => {
                                        newMessages.push({
                                            id: change.doc.id,
                                            ...change.doc.data()
                                        })
                                    })
                                    let messages = [...this.state.messages, ...newMessages];
                                    this.setState({
                                        messages: messages
                                    })

                                    // if not, display a red dot near conver's name.
                                } else {
                                    let conversationWNewMessage = this.state.participatedConversations.map((conver, index) => {
                                        if (conver.id === conversation.id) {
                                            return {
                                                ...conver,
                                                newMessage: true
                                            }
                                        } else {
                                            return conver;
                                        }
                                    })

                                    this.setState({
                                        participatedConversations: conversationWNewMessage
                                    })
                                    console.log(this.state.participatedConversations)
                                }
                            }


                        })
                    })

                    if (!this.state.notInitStateActiveConversation) {
                        // display messages when signed in 
                        // onSnapshot updates the whole thing when a new message is sent
                        try {
                            let querySnapshot = await firebase.firestore()
                                .collection('messages').where("conversation", "==", this.state.participatedConversations[0].id)
                                .orderBy("timeSent", "asc").get();
                            var messages = [];
                            querySnapshot.forEach(doc => {
                                messages.push(doc.data());
                            });
                            this.setState({
                                messages: messages,
                                notInitStateActiveConversation: true
                            })
                        } catch (err) {
                            alert("Messages failed to load")
                        }
                    }



                })


            } else {
                this.setState({
                    //loading: false,
                    userInfo: undefined
                })
                this.props.history.push('/login')
            }
        })



    }

    // map all conversations that user is in to sidebar
    renderSidebar = () => {
        return (
            <>
                {this.state.participatedConversations.map((conversation, index) => {
                    // double functions make sure that we dont call the renderActiveConversation in the 1st rendering, but only when it's clicked.
                    const backgroundColor = conversation["id"] === this.state.activeConversation["id"] ? "green" : "rgb(179, 175, 175)";
                    return <button style={{ backgroundColor }} onClick={() => {
                        this.renderActiveConversation(index)
                    }} className="friend">{conversation.name} {conversation.newMessage ? "*" : ""}</button>
                })}
            </>
        )
    }


    renderActiveConversation = async index => {
        //load messages of active conversation initiated by clicked button.
        try {
            let querySnapshot = await firebase.firestore().collection("messages").where("conversation", "==", this.state.participatedConversations[index].id)
                .orderBy("timeSent", "asc").get();
            let messages = [];

            querySnapshot.forEach(doc => {
                messages.push(doc.data());
            })


            this.setState({
                activeConversation: this.state.participatedConversations[index],
                messages: messages,
                participatedConversations: this.state.participatedConversations.map((conversation, i) => {
                    if (i === index) {
                        return {
                            ...conversation,
                            newMessage: false
                        }
                    } else {
                        return conversation
                    }
                })
            })
        } catch (error) {
            alert("Messages failed to reload...")
        }
    }

    saveTextInput = e => {
        this.setState({
            messageInput: e.target.value
        })
    }

    sendMessage = async e => {
        e.preventDefault();
        try {
            const newMessage = await firebase.firestore().collection('messages').add({
                // noi dung
                content: this.state.messageInput,
                // sender
                sender: this.state.userInfo,
                // which conversation does this belong to in the conversations collection
                conversation: this.state.activeConversation.id,
                // time at which message is sent
                timeSent: new Date()
            })
            // empty message after successfully sent message.
            this.setState({
                messageInput: ''
            })
        } catch (error) {
            this.setState({
                errorMessage: error
            })
            alert(error.message)
        }
    }

    displayMessage = () => {
        return (<div>
            {this.state.messages.map((message, index) => {
                if (this.state.showTimeSent === index) {
                    console.log(message.timeSent)
                    return (<span>
                        <div className="sender">
                            <p>{message.sender.name}</p>
                        </div>
                        <p className="messageContent" key={index} onMouseLeave={this.hideTimeSent}>{message.content}</p>
                    </span>)
                } else {
                    return (<span>
                        <div className="sender">
                            <p>{message.sender.name}</p>
                        </div>
                        <p className="messageContent" key={index} onMouseEnter={() => {
                            this.showTimeSent(index)
                        }}>{message.content}</p>
                    </span>)
                }
            })}
        </div>)
    }

    triggerSendButton = e => {
        if (e.keyCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            // Trigger the button element with a click
            this.sendMessage(e);
        }
    }


    showTimeSent = hoverIndex => {
        this.setState({
            showTimeSent: hoverIndex
        })

    }
    hideTimeSent = () => {
        this.setState({
            showTimeSent: undefined
        })
    }

    newConversation = async () => {
        this.props.history.push('/newConversation')
    }

    displayMembers = () => {
        if (this.state.activeConversation) {
            return (<div>
                {this.state.activeConversation.members.map((mem, idx) => {
                    return <p>{mem}</p>
                })}
            </div>)
        }

    }

    addMember = async () => {
        let newMember = prompt("Enter new member's email", "example@gmail.com")
        // option 1 to update member array
        try {
            // update members'list on firestore
            const activeConversation = await firebase.firestore().collection('conversations').doc(this.state.activeConversation.id).update({
                members : [...this.state.activeConversation.members, newMember]
            })
            
        } catch (error) {
            this.setState({
                errorMessage: error
            })
            alert(error.message)
        }
        // option 2 to update member array
    //     try {
    //         await firebase.firestore().collection('conversations').doc(this.state.activeConversation.id).update({
    //             members: firebase.firestore.FieldValue.arrayUnion(newMember)
    //         })
    //     } catch (err) {

    //     }
    }


    signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            this.setState({
                errorMessage: error
            })
            alert(error.message)
        }
        
    }

    render() {
        console.log(this.state.loading);
        if (this.state.loading) {
            return (<div>
                <h1>Loading</h1>
                <FontAwesomeIcon icon={faSpinner} className="loading" />
            </div>)
            

        } else {
            return (<div className="home">
                {/* Friends with whom you are chatting */}
                <aside className="leftSide">
                    <ul className="friends">
                        <h7 className="curConver">Current Conversations</h7>
                        <button className="btn btn-primary addConver" onClick={this.newConversation}><FontAwesomeIcon icon={faUserPlus} /></button>
                        
                        {this.renderSidebar()}
                    </ul>
                </aside>

                <main>
                    <header>
                        <h3 className="receiver">Messaging area</h3>
                    </header>
                    {/* Sent texts */}
                    <section className="conversation">
                        {this.displayMessage()}
                    </section>

                    {/* Messaging area */}
                    <textarea placeholder="Message @friend's name" onChange={this.saveTextInput} onKeyUp={this.triggerSendButton} value={this.state.messageInput} ></textarea>
                    <button id="myBtn" onClick={this.sendMessage}>Send</button>
                    {/* <form onSubmit={this.sendMessage}>
                    <input placeholder="Message @friend's name" onChange={this.saveTextInput} value={this.state.messageInput} />
                </form> */}

                </main>
                <aside className="rightSide">
                    <button onClick={this.addMember} className="btn btn-primary addMember">Add member</button>
                    <h3>Current members</h3>
                    
                    
                    {this.displayMembers()}
                    <button onClick={this.signOut} className="btn btn-primary signOut">Sign out</button>
                </aside>
            </div>)
        }

    }
}