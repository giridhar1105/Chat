"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../Header/page";

const userProfiles = { /* Your userProfiles object here */ };

const getUserProfile = (name) => { /* Your getUserProfile function here */ };

export default function Chat1v1() {
    const [userNames] = useState(Object.keys(userProfiles));
    const [showMessagingTab, setShowMessagingTab] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [message, setMessage] = useState("");
    const [sentMessages, setSentMessages] = useState([]);
    const [currentProfile, setCurrentProfile] = useState({});
    const [ws, setWs] = useState(null);
    const [user, setUser] = useState(null); // To hold user details

    useEffect(() => {
        // Retrieve user data from local storage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }

        const socket = new WebSocket('ws://localhost:3000');
        setWs(socket);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'message') {
                setSentMessages(prev => [...prev, { sender: data.sender, content: data.content }]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleButtonClick = (name) => {
        setSelectedUser(name);
        setShowMessagingTab(true);
        setCurrentProfile(getUserProfile(name));
        
        // Join the chat room
        if (ws) {
            ws.send(JSON.stringify({
                type: 'join',
                userId1: user ? user.username : 'yourUserId', // Use username from local storage
                userId2: name // Replace with the selected user ID
            }));
        }
    };

    const handleSendMessage = () => {
        if (message.trim() && ws) {
            ws.send(JSON.stringify({
                type: 'message',
                content: message,
            }));
            setSentMessages(prev => [...prev, { sender: user ? user.username : 'yourUserId', content: message }]); // Use username from local storage
            setMessage("");
        }
    };

    return (
        <>
            <Header />
            <div className="chat-container">
                {/* Render user names */}
                <div className="user-list">
                    {userNames.map((name, index) => (
                        <button key={index} onClick={() => handleButtonClick(name)}>
                            {name}
                        </button>
                    ))}
                </div>

                {/* Show messaging tab if a user is selected */}
                {showMessagingTab && (
                    <div className="messaging-tab">
                        <h2>Chat with {selectedUser}</h2>
                        <div className="messages">
                            {sentMessages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender === (user ? user.username : 'yourUserId') ? 'sent' : 'received'}`}>
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            placeholder="Type your message..." 
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                )}
            </div>
        </>
    );
}
