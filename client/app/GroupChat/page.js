"use client";

import React, { useEffect, useState } from 'react';
import Header from "../Header/page"; // Ensure this path is correct

export default function GroupChat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Connect to WebSocket server
        const websocket = new WebSocket('ws://localhost:3000');

        websocket.onmessage = (event) => {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        setWs(websocket);

        // Clean up on component unmount
        return () => {
            websocket.close();
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            ws.send(message);
            console.log(`Message sent: ${message}`);
            setMessage("");
            setError(""); // Clear error if message is sent
        } else {
            setError("Message cannot be empty."); // Set error message
        }
    };

    return (
        <div className="min-h-screen">
            <Header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md" />
            <div className="pt-16 flex">
                <div className="w-full flex flex-col">
                    <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="text-black bg-gray-300 p-2 rounded mb-2 self-end">
                                {msg}
                            </div>
                        ))}
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm p-2">
                            {error} {/* Display error message */}
                        </div>
                    )}
                    <div className="flex items-center p-2 bg-gray-900">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-grow h-10 border rounded p-2 text-white bg-gray-800 placeholder-gray-400"
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
            </div>
        </div>
    );
}
