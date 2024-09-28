"use client"

import React, { useEffect, useState } from 'react';
import Header from '../Header/page';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from local storage
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
    // Update user data in local storage
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Updated User:", user);
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header className="fixed top-0 left-0 right-0 z-10" />
      <div className="flex-grow flex items-center justify-center mt-16">
        <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center text-black">{user.username}</h1>
          <p className="text-gray-700 text-center mt-2">{user.bio}</p>

          <h2 className="mt-4 text-gray-400 text-lg font-semibold">Interests</h2>
          <ul className="list-disc list-inside mt-2">
            {user.interests.length > 0 ? user.interests.map((interest, index) => (
              <li key={index} className="text-gray-600">{interest}</li>
            )) : <li className="text-gray-600">No interests added.</li>}
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
      </div>
    </div>
  );
}
