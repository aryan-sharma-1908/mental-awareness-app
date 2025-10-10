import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isAuthPage) return null;

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-800">TogetEase</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/exercises" className="text-gray-600 hover:text-purple-600">
              Exercises
            </Link>
            <Link to="/community" className="text-gray-600 hover:text-purple-600">
              Community
            </Link>
            <Link
              to="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/exercises"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Exercises
              </Link>
              <Link
                to="/community"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}