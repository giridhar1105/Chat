"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Open() {
    const router = useRouter();

    return (
        <div className="bg-black h-screen flex flex-col items-center justify-center">
            <button
                className="bg-red-500 text-white px-6 py-3 text-lg rounded mb-4 w-48"
                onClick={() => router.push("/Register")}
            >
                Register
            </button>
            <button
                className="bg-red-500 text-white px-6 py-3 text-lg rounded w-48"
                onClick={() => router.push("/Login")}
            >
                Login
            </button>
        </div>
    );
}
