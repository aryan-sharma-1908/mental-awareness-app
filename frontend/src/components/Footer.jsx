import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-6 w-6" />
              <span className="text-xl font-semibold text-gray-800">TogetEase</span>
            </Link>
            <p className="text-sm text-gray-600">
              Find peace of mind, together with our supportive community.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/exercises" className="text-gray-600 hover:text-purple-600">
                  Exercises
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-600 hover:text-purple-600">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-purple-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-purple-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-purple-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">support@togetease.com</li>
              <li className="text-gray-600">1-800-WELLNESS</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          © 2024 TogetEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}