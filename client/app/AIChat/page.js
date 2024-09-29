"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Header from "../Header/page"; // Ensure this path is correct

export default function AIChat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (message.trim()) {
            const userMessage = message;
            setMessages(prevMessages => [...prevMessages, { text: userMessage, sender: 'user' }]);
            setMessage(""); 
            setError(""); 

            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/message`, { 
                    message: userMessage 
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const aiResponse = response.data.response;
                setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
            } catch (err) {
                setError("Error fetching AI response.");
            } finally {
                setLoading(false);
            }
        } else {
            setError("Message cannot be empty.");
        }
    };

    const handleClearMessages = () => {
        if (window.confirm("Are you sure you want to clear all messages?")) {
            setMessages([]);
        }
    };

    return (
        <div className="min-h-screen">
            <Header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md" />
            <div className="pt-16 flex flex-col">
                <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`p-2 rounded mb-2 self-${msg.sender === 'user' ? 'end' : 'start'} 
                            bg-${msg.sender === 'user' ? 'gray-300' : 'blue-300'} 
                            animate-fade-in transition-all duration-300`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                {error && (
                    <div className="text-red-500 text-sm p-2">
                        {error}
                    </div>
                )}
                <div className="flex items-center p-2 bg-gray-900">
                    <input
                        type="text"
                        value={message}
                        maxLength={200}
                        onChange={({ target: { value } }) => setMessage(value)}
                        placeholder="Type your message here"
                        className="flex-grow h-10 border rounded p-2 text-white bg-gray-800 placeholder-gray-400"
                        aria-label="Message input"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading}
                        className={`ml-2 ${loading ? 'bg-gray-500' : 'bg-red-500'} text-white rounded h-10 px-4 flex items-center justify-center transition hover:bg-red-600`}
                        aria-label="Send message"
                    >
                        {loading ? 'Sending...' : <span>&rarr;</span>}
                    </button>
                    <button
                        onClick={handleClearMessages}
                        className="ml-2 bg-gray-700 text-white rounded h-10 px-4 flex items-center justify-center transition hover:bg-gray-800"
                        aria-label="Clear messages"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}