"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Header from "../Header/page"; // Ensure this path is correct
import Profile from "../Profile/page"; // Ensure this path is correct

const userProfiles = {
    "Alice": { name: "Alice", age: 25, email: "alice@example.com" },
    "Bob": { name: "Bob", age: 30, email: "bob@example.com" },
    "Charlie": { name: "Charlie", age: 22, email: "charlie@example.com" },
    "Diana": { name: "Diana", age: 28, email: "diana@example.com" },
    "Eve": { name: "Eve", age: 27, email: "eve@example.com" },
    "Frank": { name: "Frank", age: 29, email: "frank@example.com" },
    "Grace": { name: "Grace", age: 26, email: "grace@example.com" },
    "Hannah": { name: "Hannah", age: 31, email: "hannah@example.com" },
    "Ian": { name: "Ian", age: 24, email: "ian@example.com" },
    "Jack": { name: "Jack", age: 32, email: "jack@example.com" },
};

const getUserProfile = (name) => {
    return userProfiles[name] || { name: "Unknown", age: null, email: "unknown@example.com" };
};

export default function Chat1v1() {
    const [userNames] = useState(Object.keys(userProfiles)); // List of user names
    const [showMessagingTab, setShowMessagingTab] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [message, setMessage] = useState("");
    const [sentMessages, setSentMessages] = useState([]);
    const [currentProfile, setCurrentProfile] = useState({});

    const handleButtonClick = (name) => {
        setSelectedUser(name);
        setShowMessagingTab(true);
        setCurrentProfile(getUserProfile(name)); // Set current profile based on name
        fetchMessages(); // Fetch messages when a user is selected
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            const senderId = 'yourSenderId'; // Replace with actual sender ID
            const receiverId = 'yourReceiverId'; // Replace with actual receiver ID

            try {
                await axios.post('/api/messages/send', { senderId, receiverId, content: message });
                setSentMessages((prevMessages) => [...prevMessages, { sender: senderId, content: message }]);
                setMessage("");
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const fetchMessages = async () => {
        const userId1 = 'yourUserId'; // Replace with actual user ID
        const userId2 = 'otherUserId'; // Replace with actual other user ID

        try {
            const response = await axios.get(`/api/messages/chat/${userId1}/${userId2}`);
            setSentMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="flex justify-center mt-16">
                {/* Profile Section */}
                <div className="w-1/3 flex justify-center items-center">
                    <Profile user={currentProfile} />
                </div>

                {/* User Buttons */}
                <div className="w-2/3 flex flex-col items-center">
                    {userNames.map((name, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(name)}
                            className="relative mb-2 h-16 w-full bg-red-500 text-white rounded cursor-pointer flex items-center justify-between pl-5 pr-2 transition hover:bg-red-600"
                            aria-label={`Select user: ${name}`}
                        >
                            <div className="flex items-center">
                                <span>{name}</span>
                            </div>
                            <span className="text-sm">00:00</span>
                        </button>
                    ))}
                </div>

                {/* Messaging Tab */}
                {showMessagingTab && (
                    <div className="w-1/3 ml-5 bg-black border rounded p-4 flex flex-col">
                        <div className="mb-4 p-4 text-center text-white bg-gray-800 rounded">
                            <h2 className="text-lg font-bold">{selectedUser}</h2>
                        </div>
                        <div className="flex flex-col mb-4">
                            {sentMessages.map((msg, idx) => (
                                <div key={idx} className={`text-white p-2 rounded mb-2 ${msg.sender === 'yourSenderId' ? 'bg-gray-700 self-end' : 'bg-gray-600 self-start'}`}>
                                    <div className="flex justify-between">
                                        <span>{msg.content}</span>
                                        <span className="text-sm text-gray-400">10:00</span> {/* Example timestamp */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto flex items-center bg-black p-2 rounded">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-grow h-10 border rounded p-2 text-white bg-black placeholder-gray-400"
                                aria-label="Message input"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 bg-red-500 text-white rounded h-10 px-4 flex items-center justify-center transition hover:bg-red-600"
                                aria-label="Send message"
                            >
                                <span>&rarr;</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
