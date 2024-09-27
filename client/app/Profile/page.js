"use client"

import React, { useState } from 'react';
import Header from '../Header/page';

export default function Profile() {
    const initialUser = {
        name: "Renushree",
        age: 20,
        bio: "I love Mahan...............................................",
        height: "5'6\"", // Height
        weight: "130 lbs", // Weight
        interests: ["Travel", "Photography", "Cooking", "Reading"],
        profilePicture: "https://www.themoviedb.org/t/p/original/ArmV1wqsz5kvwGw91R7BrVaHO4c.jpg"
    };

    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the submission logic, e.g., saving to a database
        console.log("Updated User:", user);
        setIsEditing(false); // Exit edit mode
    };

    return (
        <div className="bg-black min-h-screen flex flex-col">
            <Header className="fixed top-0 left-0 right-0 z-10" />
            <div className="flex-grow flex items-center justify-center mt-16"> {/* Adjust margin-top to account for fixed header */}
                <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <img src={user.profilePicture} alt={`${user.name}'s profile`} className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold text-center text-black">{user.name}, {user.age}</h1>
                    <p className="text-gray-700 text-center mt-2">{user.bio}</p>
                    
                    {/* Display height and weight */}
                    <div className="text-center mt-2 text-gray-700">
                        <p>Height: {user.height}</p>
                        <p>Weight: {user.weight}</p>
                    </div>
                    
                    <h2 className="mt-4 text-gray-400 text-lg font-semibold">Interests</h2>
                    <ul className="list-disc list-inside mt-2">
                        {user.interests.map((interest, index) => (
                            <li key={index} className="text-gray-600">{interest}</li>
                        ))}
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
                                    value={user.name} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border rounded" 
                                    placeholder="Name" 
                                />
                            </div>
                            <div className="mb-2">
                                <input 
                                    type="number" 
                                    name="age" 
                                    value={user.age} 
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
            </div>
        </div>
    );
}
