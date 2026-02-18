import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PropertyDetail from './pages/PropertyDetail';

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav>
      <Link to="/">🏠 Home</Link>
      {user ? (
        <>
          <Link to="/dashboard">📊 Dashboard</Link>
          <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </>
      ) : (
        <Link to="/login">🔐 Login</Link>
      )}
    </nav>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
