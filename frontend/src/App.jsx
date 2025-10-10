import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Exercises } from './pages/Exercises';
import { Community } from './pages/Community';
import { LearnMore } from './pages/LearnMore';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/community" element={<Community />} />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;