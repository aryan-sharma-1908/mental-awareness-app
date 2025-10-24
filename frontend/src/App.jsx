import React, { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Exercises } from "./pages/Exercises";
import { Community } from "./pages/Community";
import { LearnMore } from "./pages/LearnMore";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import AuthProvider from "./components/AuthContext";
export const LoginContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5143';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/community" element={<Community />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
