# 💻 CodeSwipe - Developer Matching Platform

<div align="center">
  <img src="client/images/logo.png" alt="CodeSwipe Logo" width="200"/>
  <p><em>Where Code Meets Connection</em></p>
</div>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Ready-success)](https://github.com/yourusername/codeswipe)

## 🚀 Overview

CodeSwipe is an innovative developer matching platform that helps programmers find their ideal coding partners through an intuitive swipe-based interface. Think of it as "Tinder for Developers" - but instead of dating profiles, users match based on coding skills, tech stacks, and project interests.

### ✨ Key Features

- 🔄 Swipe-based matching system for developers
- 💬 Real-time chat with matches
- 🛠 Tech stack compatibility matching
- 📊 Code snippet sharing
- 👥 Project collaboration opportunities
- 🔐 Secure authentication system
- 📱 Responsive design for all devices

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Socket.io Client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.io

## 🎯 Project Structure

codeswipe/
├── client/ # Frontend React application
│ ├── public/ # Static files
│ └── src/ # Source files
│ ├── components/ # Reusable components
│ ├── context/ # Context providers
│ ├── pages/ # Page components
│ └── services/ # API services
└── server/ # Backend Node.js application
├── controllers/ # Request handlers
├── models/ # Database models
├── routes/ # API routes
└── middleware/ # Custom middleware

## 🚀 Getting Started

1. Clone the repository

bash
git clone https://github.com/yourusername/codeswipe.git
cd codeswipe


2. Install dependencies
bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install


3. Set up environment variables
bash
# In server directory
cp .env.example .env
# Add your MongoDB URI and JWT secret


4. Run the application
bash
# Run backend (from server directory)
npm run dev

# Run frontend (from client directory)
npm start


## 📸 Screenshots

<div align="center">
  <img src="docs/assets/screenshot1.png" alt="Home Page" width="400"/>
  <img src="docs/assets/screenshot2.png" alt="Swipe Interface" width="400"/>
</div>

## 🎥 Demo

[View Live Demo](https://codeswipe-demo.herokuapp.com)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 👥 Team

- [Your Name](https://github.com/yourusername) - Full Stack Developer
- [Team Member 2](https://github.com/teammember2) - Frontend Developer
- [Team Member 3](https://github.com/teammember3) - Backend Developer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the initial project setup
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting

---

<div align="center">
  <p>Made with ❤ for developers, by developers.</p>
  <p>© 2024 CodeSwipe. All rights reserved.</p>
</div>
