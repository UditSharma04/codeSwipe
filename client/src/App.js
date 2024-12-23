// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

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
import RequestsPage from './pages/RequestsPage';
import MatchProfilePage from './pages/MatchProfilePage';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Navbar wrapper component that hides navbar on specific routes
const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/register', '/login']; // Added '/login' to hide navbar routes
  
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }
  
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <NavbarWrapper />
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
              
              <Route 
                path="/requests" 
                element={
                  <PrivateRoute>
                    <RequestsPage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile/:userId" 
                element={
                  <PrivateRoute>
                    <MatchProfilePage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile/edit" 
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
          <Toaster 
            position="top-center"
            toastOptions={{
              // Default options for all toasts
              duration: 2000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;