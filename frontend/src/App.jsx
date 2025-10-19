import React, { createContext, useState } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('/boy.png');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

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
