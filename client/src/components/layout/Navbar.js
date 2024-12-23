// src/components/layout/Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRequestCount } from '../../services/swipeService';
import Badge from '../ui/Badge';
import logo from '../../images/logo.png';
import { socket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/swipe', icon: 'bi-shuffle', label: 'Swipe' },
    { path: '/matches', icon: 'bi-heart', label: 'Matches' },
    { 
      path: '/requests', 
      icon: 'bi-bell', 
      label: 'Requests',
      badge: requestCount
    },
    { path: '/profile', icon: 'bi-person', label: 'Profile' },
  ];

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const count = await getRequestCount();
        setRequestCount(count);
      } catch (error) {
        console.error('Failed to fetch request count:', error);
      }
    };

    fetchRequestCount();
    // Set up polling to update the count periodically
    const interval = setInterval(fetchRequestCount, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    socket.on('request_count_updated', (data) => {
      if (data.userId === user?._id) {
        setRequestCount(data.count);
      }
    });

    return () => {
      socket.off('request_count_updated');
    };
  }, [user?._id]);

  const renderButton = (item) => (
    <button 
      key={item.path}
      onClick={() => {
        navigate(item.path);
        if (isMenuOpen) setIsMenuOpen(false);
      }} 
      className={`px-4 py-2 neubrutalism relative ${
        isActive(item.path) 
          ? 'bg-black text-white' 
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      <i className={`bi ${item.icon} me-2`}></i>
      {item.label}
      {item.badge !== undefined && <Badge count={item.badge} />}
    </button>
  );

  return (
    <nav className="bg-primary p-4 neubrutalism mb-8 relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <img 
            src={logo} 
            alt="CodeSwipe Logo" 
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-2xl font-bold">
            CodeSwipe
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-3 items-center">
          {/* Chat Button */}
          <button
            onClick={() => navigate('/chat')}
            className={`px-4 py-2 flex items-center gap-2 transform transition-transform hover:scale-105 ${
              isActive('/chat')
                ? 'bg-black text-primary neubrutalism'
                : 'bg-black text-primary neubrutalism hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]'
            }`}
          >
            <i className="bi bi-chat-dots-fill"></i>
            Chat
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </button>

          {menuItems.map(renderButton)}
          
          <button 
            onClick={() => {
              // Add logout logic here
              navigate('/login');
            }} 
            className="bg-red-400 text-white px-4 py-2 neubrutalism hover:bg-red-500"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Chat Button */}
          <button
            onClick={() => navigate('/chat')}
            className={`p-2 flex items-center gap-1 transform transition-transform hover:scale-105 ${
              isActive('/chat')
                ? 'bg-black text-primary neubrutalism'
                : 'bg-black text-primary neubrutalism hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]'
            }`}
          >
            <i className="bi bi-chat-dots-fill"></i>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </button>

          <button 
            className="bg-white p-2 neubrutalism relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
            <Badge count={requestCount} />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                style={{ top: '100%' }}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full right-0 left-0 mx-4 mt-4 bg-white neubrutalism p-4 z-50"
              >
                <div className="flex flex-col gap-2">
                  {menuItems.map(item => (
                    <button 
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }} 
                      className={`px-4 py-2 neubrutalism text-left relative ${
                        isActive(item.path) 
                          ? 'bg-black text-white' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.label}
                      {item.badge !== undefined && (
                        <Badge count={item.badge} />
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }} 
                    className="bg-red-400 text-white px-4 py-2 neubrutalism hover:bg-red-500 text-left"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;