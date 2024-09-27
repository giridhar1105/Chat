"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMale, FaFemale } from "react-icons/fa"; // Importing icons 

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  async function onRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { username, password, gender, email, otp };
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        setUsername("");
        setPassword("");
        setGender("Male");
        setEmail("");
        setOtp("");
        window.alert("Registration successful!");
        router.push("/Login");
      } else {
        window.alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err.message);
      window.alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost:3000/send-otp", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
        window.alert("OTP sent to your email address.");
      } else {
        window.alert("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err.message);
      window.alert("An error occurred while sending the OTP. Please try again later.");
    }
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-center w-full bg-black cursor-pointer font-bold text-red-500 py-2 text-5xl"
        onClick={() => router.push("/")}>
        Chat-IB
      </motion.div>
      <div className="bg-black flex items-center justify-center h-screen">
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center font-bold mb-6 text-3xl text-red-500">Register</h1>
          <form onSubmit={onRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-red-400">Username</label>
              <motion.input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-4 text-lg w-full border rounded-md border-gray-600 bg-gray-900 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition-shadow duration-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-red-400 mb-2">Gender</label>
              <div className="flex items-center justify-around">
                <motion.label className="flex items-center">
                  <input
                    type="radio"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={() => setGender("Male")}
                    className="mr-2"
                  />
                  <FaMale className="text-red-400 text-2xl" />
                  <span className="ml-1 text-lg text-red-400">Male</span>
                </motion.label>
                <motion.label className="flex items-center">
                  <input
                    type="radio"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={() => setGender("Female")}
                    className="mr-2"
                  />
                  <FaFemale className="text-red-400 text-2xl" />
                  <span className="ml-1 text-lg text-red-400">Female</span>
                </motion.label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-red-400">Email Address</label>
              <motion.input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-4 text-lg w-full border rounded-md border-gray-600 bg-gray-900 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition-shadow duration-300"
                placeholder="example@example.com"
              />
              <motion.button
                type="button"
                onClick={handleSendOtp}
                className="mt-2 bg-red-500 text-white p-2 w-full rounded-md hover:bg-red-600 transition-transform duration-300"
              >
                Get OTP
              </motion.button>
            </div>
            {otpSent && (
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-red-400">OTP</label>
                <motion.input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 p-4 text-lg w-full border rounded-md border-gray-600 bg-gray-900 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition-shadow duration-300"
                  placeholder="Enter OTP"
                />
              </div>
            )}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-red-400">Password</label>
              <motion.input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-4 text-lg w-full border rounded-md border-gray-600 bg-gray-900 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition-shadow duration-300"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className={`bg-red-500 text-white p-3 w-full rounded-md mt-5 ${
                loading ? "bg-red-300 cursor-not-allowed" : "hover:bg-red-600"
              } shadow-md transition-transform duration-300 ${!loading ? "hover:scale-105" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Register;
