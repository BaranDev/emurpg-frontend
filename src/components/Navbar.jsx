import React, { useState } from 'react';
import { FaDiceD20, FaBars, FaTimes, FaGithub } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b-2 border-yellow-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
        <div className="flex flex-col items-start">
        <div className="flex items-center">
          <FaDiceD20 className="text-yellow-500 text-2xl" />
          <span className="ml-2 text-yellow-500 font-medieval text-lg">EMU RPG Club</span>
        </div>
        <div className="flex items-center text-[10px] text-yellow-500 mt-1">
          Made by
          <FaGithub className="ml-1 mr-1" />
          <a
            href="https://github.com/barandev"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Barandev
          </a>
        </div>
        </div>



          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              disabled 
              className="text-gray-400 px-3 py-2 rounded relative group cursor-not-allowed"
            >
              Home Page
              <span className="absolute -top-2 -right-2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
                Coming Soon
              </span>
            </button>
            <button 
              disabled 
              className="text-gray-400 px-3 py-2 rounded relative group cursor-not-allowed"
            >
              Character Roller
              <span className="absolute -top-2 -right-2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
                Coming Soon
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-yellow-500 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                disabled 
                className="text-gray-400 block px-3 py-2 rounded w-full text-left relative cursor-not-allowed"
              >
                Home
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
                  Coming Soon
                </span>
              </button>
              <button 
                disabled 
                className="text-gray-400 block px-3 py-2 rounded w-full text-left relative cursor-not-allowed"
              >
                Character Roller
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;