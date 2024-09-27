"use client";

import React, { useState } from 'react';
import Header from '../Header/page';

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the submission logic, e.g., sending data to a server
        console.log("Feedback submitted:", formData);
        // Reset form after submission
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-black min-h-screen flex flex-col">
            <Header className="fixed top-0 left-0 right-0 z-10 bg-white shadow" />
            <div className="flex-grow mt-16 flex items-center justify-center"> {/* Center the form vertically */}
                <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-white mb-4">Faceing Any Probem</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                                placeholder="Your Name" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                                placeholder="Your Email" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                name="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                                placeholder="Your Feedback" 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700 transition duration-200"
                        >
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
