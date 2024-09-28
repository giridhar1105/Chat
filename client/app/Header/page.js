"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const MenuButton = ({ label, path }) => (
    <button
      className="text-lg mb-2 text-red-500"
      onClick={() => { router.push(path); setIsOpen(false); }}
    >
      {label}
    </button>
  );

  return (
    <motion.header
      className="fixed w-full bg-black text-white shadow-md z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="flex items-center justify-between p-4 mx-auto max-w-screen-xl">
        {/* Logo */}
        <motion.div
          className="font-bold text-2xl cursor-pointer flex-shrink-0 ml-[-1rem] pr-6 text-red-500"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => router.push("/")}
        >
          Chat-IB
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 bg-gray-200 rounded-md ml-4"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isOpen ? 'X' : '☰'}
        </motion.button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-grow items-center justify-center gap-8">
          {["/Chat1v1", "/Search", "/GroupChat", "/AIChat", "/Videocall", "/Feedback", "/Profile"].map((path, index) => (
            <button key={index} className="hover:text-red-500" onClick={() => router.push(path)}>
              {path.split('/')[1] || 'Home'}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-auto pl-7">
          <motion.button
            className="hidden lg:inline-flex bg-red-500 text-white py-2 px-4 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => { router.push("/Register"); setIsOpen(false); }}
          >
            Register
          </motion.button>
          <motion.button
            className="hidden lg:inline-flex bg-red-500 text-white py-2 px-4 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => { router.push("/Login"); setIsOpen(false); }}
          >
            Login
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-white p-4 flex flex-col items-start z-40 lg:hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {["/Chat1v1", "/Search", "/GroupChat", "/AIChat", "/VideoCall", "/Feedback"].map((path, index) => (
              <MenuButton key={index} label={path.split('/')[1] || 'Home'} path={path} />
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
