"use client";

import React, { useState } from 'react';
import Header from '../Header/page';

export default function Search() {
    const [query, setQuery] = useState("");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [country, setCountry] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(`Searching for: ${query}, Age: ${age}, Height: ${height}, Weight: ${weight}, Country: ${country}`);
    };

    const handleSubmit = () => {
        console.log(`Submitted: Age: ${age}, Height: ${height}, Weight: ${weight}, Country: ${country}`);
        setAge("");
        setHeight("");
        setWeight("");
        setCountry("");
    };

    return (
        <div className='mt-0'>
            <Header />
            <div className="flex flex-col items-center justify-center mt-20 pt-16"> {/* Add padding top */}
                <form onSubmit={handleSearch} className="flex mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="border rounded-l p-3 outline-none w-96 text-white bg-black"
                    />
                    <button
                        type="submit"
                        className="bg-red-500 text-white rounded-full p-3 ml-2"
                    >
                        Search
                    </button>
                </form>

                {/* Filtering Options */}
                <div className="flex flex-col w-full max-w-xl">
                    <div className="flex space-x-6 mb-4">
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Age"
                            className="border rounded p-3 outline-none text-white bg-black flex-1"
                        />
                        <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Height (cm)"
                            className="border rounded p-3 outline-none text-white bg-black flex-1"
                        />
                    </div>
                    <div className="flex space-x-6 mb-4">
                        <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Weight (kg)"
                            className="border rounded p-3 outline-none text-white bg-black flex-1"
                        />
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            className="border rounded p-3 outline-none text-white bg-black flex-1"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-red-500 text-white rounded-full p-3 w-full"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
