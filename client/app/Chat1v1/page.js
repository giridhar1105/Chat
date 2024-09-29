"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../Header/page"; // Ensure this path is correct
import Profile from "../Profile/page"; // Ensure this path is correct

export default function Chat1v1() {
    const [greetings] = useState([
        "Hi", "Hii", "Hiii", "Hiiii", "Hiiiii",
        "Hiiiiii", "Hiiiiiii", "Hiiiiiiii", "Hiiiiiiiii", "Hiiiiiiiiii"
    ]);
    const [showMessagingTab, setShowMessagingTab] = useState(false);
    const [selectedGreeting, setSelectedGreeting] = useState("");
    const [message, setMessage] = useState("");
    const [sentMessages, setSentMessages] = useState([]);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleButtonClick = (text) => {
        setSelectedGreeting(text);
        setShowMessagingTab(true);
        fetchMessages(); // Fetch messages when greeting is selected
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

    const sendOtp = async () => {
        try {
            await axios.post('/send-otp', { email });
            setIsOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="flex justify-center mt-16">
                {/* Messaging Buttons */}
                <div className="w-2/3 flex flex-col items-center">
                    {greetings.map((greeting, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(greeting)}
                            className="relative mb-2 h-16 w-full bg-red-500 text-white rounded cursor-pointer flex items-center justify-between pl-5 pr-2 transition hover:bg-red-600"
                            aria-label={`Select greeting: ${greeting}`}
                        >
                            <div className="flex items-center">
                                <span>{greeting}</span>
                            </div>
                            <span className="text-sm">00:00</span>
                        </button>
                    ))}
                </div>

                {/* Profile Section */}
                <div className="w-1/3 flex justify-center items-center">
                    <Profile />
                </div>

                {/* Messaging Tab */}
                {showMessagingTab && (
                    <div className="w-1/3 ml-5 bg-black border rounded p-4 flex flex-col">
                        <div className="mb-4 p-4 text-center text-white bg-gray-800 rounded">
                            <h2 className="text-lg font-bold">{selectedGreeting}</h2>
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
