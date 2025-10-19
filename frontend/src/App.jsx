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

export const LoginContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5143';

function App() {
  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('/boy.png');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}/api/profile`, {
      method: 'get',
      headers: {
        'Content-Type' : 'application/json'
      },
      credentials: 'include'
    });

    const data = await res.json();

    if(res.ok && data.success) {
      const user = data.user;
      setUser(user);
      setUsername(user.username);
      setSelectedAvatar(user.avatar || '/boy.png');
      setIsLoggedIn(true);

      localStorage.setItem('username',user.username || '');
      localStorage.setItem('avatar',user.avatar || '/boy.png');
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('avatar');
      const savedUsername = localStorage.getItem('username');
      if(savedAvatar) {
        setSelectedAvatar(savedAvatar || '/boy.png');
      }
      if(savedUsername) {
        setUsername(savedUsername);
      }

      fetchUser();
    } catch(error) {
      setUser(null);
      console.error('Error while fetching the user: ', error);
    }
  },[]);

  useEffect(() => {
    if(user) {
      localStorage.setItem('user',JSON.stringify(user));
      localStorage.setItem('avatar',JSON.stringify(selectedAvatar));
    } else {
      localStorage.removeItem('user');
    }
  },[user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <LoginContext.Provider value={{isLoggedIn,setIsLoggedIn,selectedAvatar,setSelectedAvatar,username, setUsername, user, setUser}}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/community" element={<Community />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
        </Routes>
        <Footer />
      </LoginContext.Provider>
    </div>
  );
}

export default App;
