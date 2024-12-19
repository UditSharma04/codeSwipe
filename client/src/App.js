// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Import components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProfilePage from './pages/ProfilePage';
import SwipePage from './pages/SwipePage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import ProfileSetup from './components/profile/ProfileSetup';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/swipe" 
                element={
                  <PrivateRoute>
                    <SwipePage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/matches" 
                element={
                  <PrivateRoute>
                    <MatchesPage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/chat/:matchId?" 
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile/setup" 
                element={
                  <PrivateRoute>
                    <ProfileSetup />
                  </PrivateRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;