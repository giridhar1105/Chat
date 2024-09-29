"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../Header/page"; // Ensure this path is correct

export default function Chat1v1() {
    const [greetings] = useState([
        "Hi", "Hii", "Hiii", "Hiiii", "Hiiiii",
        "Hiiiiii", "Hiiiiiii", "Hiiiiiiii", "Hiiiiiiiii", "Hiiiiiiiiii"
    ]);
    const [selectedGreeting, setSelectedGreeting] = useState("");
    const [sentMessages, setSentMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null); // Assume user data is fetched or set in local storage
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleButtonClick = (text) => {
        setSelectedGreeting(text);
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
        // Fetch chat messages between the users
        const userId1 = 'yourUserId'; // Replace with actual user ID
        const userId2 = 'otherUserId'; // Replace with actual other user ID

        try {
            const response = await axios.get(`/api/messages/chat/${userId1}/${userId2}`);
            setSentMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify(user));
        setIsEditing(false);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="flex flex-col items-center mt-16 w-full">
                {selectedGreeting ? (
                    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="text-2xl font-semibold text-center text-black">{user.username}</h1>
                        <p className="text-gray-700 text-center mt-2">{user.bio}</p>
                        <h2 className="mt-4 text-gray-400 text-lg font-semibold">Selected Greeting: {selectedGreeting}</h2>
                        <h2 className="mt-4 text-gray-400 text-lg font-semibold">Messages</h2>
                        <ul className="list-disc list-inside mt-2">
                            {sentMessages.length > 0 ? sentMessages.map((msg, index) => (
                                <li key={index} className="text-gray-600">{msg.content}</li>
                            )) : <li className="text-gray-600">No messages sent.</li>}
                        </ul>
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                        >
                            Edit Profile
                        </button>

                        {isEditing && (
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mb-2">
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={user.name || ''} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Name" 
                                    />
                                </div>
                                <div className="mb-2">
                                    <input 
                                        type="number" 
                                        name="age" 
                                        value={user.age || ''} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Age" 
                                    />
                                </div>
                                <div className="mb-2">
                                    <textarea 
                                        name="bio" 
                                        value={user.bio} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Bio" 
                                    />
                                </div>
                                <div className="mb-2">
                                    <input 
                                        type="text" 
                                        name="height" 
                                        value={user.height} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Height" 
                                    />
                                </div>
                                <div className="mb-2">
                                    <input 
                                        type="text" 
                                        name="weight" 
                                        value={user.weight} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Weight" 
                                    />
                                </div>
                                <div className="mb-2">
                                    <input 
                                        type="text" 
                                        name="interests" 
                                        value={user.interests.join(', ')} 
                                        onChange={(e) => setUser({ ...user, interests: e.target.value.split(',').map(i => i.trim()) })} 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Interests (comma separated)" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    className="mt-2 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Select a Greeting</h2>
                        <div className="flex flex-wrap justify-center">
                            {greetings.map((greeting, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleButtonClick(greeting)}
                                    className="m-2 h-16 w-48 bg-red-500 text-white rounded cursor-pointer flex items-center justify-center transition hover:bg-red-600"
                                    aria-label={`Select greeting: ${greeting}`}
                                >
                                    {greeting}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="h-10 border rounded p-2 text-black"
                                aria-label="Message input"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 bg-green-500 text-white rounded h-10 px-4 flex items-center justify-center transition hover:bg-green-600"
                                aria-label="Send message"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
