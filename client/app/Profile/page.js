"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../Header/page"; // Ensure this path is correct

export default function Profile() {
    const [user, setUser] = useState(null); // User data from local storage
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

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
                <h1 className="text-2xl font-semibold text-center text-black">{user.username}</h1>
                <p className="text-gray-700 text-center mt-2">{user.bio || "No bio available."}</p>

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
                                name="bio" 
                                value={user.bio || ''} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded" 
                                placeholder="Bio" 
                            />
                        </div>
                        <div className="mb-2">
                            <input 
                                type="text" 
                                name="height" 
                                value={user.height || ''} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded" 
                                placeholder="Height" 
                            />
                        </div>
                        <div className="mb-2">
                            <input 
                                type="text" 
                                name="weight" 
                                value={user.weight || ''} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded" 
                                placeholder="Weight" 
                            />
                        </div>
                        <div className="mb-2">
                            <input 
                                type="text" 
                                name="interests" 
                                value={user.interests ? user.interests.join(', ') : ''} 
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
        </>
    );
}
