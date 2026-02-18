import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Renter');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post('/auth/register', { name, email, password, role });
        alert('Registered! Please login.');
        setIsRegister(false);
      } else {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <h2>{isRegister ? '📝 Register' : '🔐 Login'}</h2>
      <form onSubmit={submit}>
        {isRegister && <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {isRegister && (
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option>Owner</option>
            <option>Renter</option>
          </select>
        )}
        <button>{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <a onClick={() => setIsRegister(!isRegister)} style={{cursor: 'pointer', color: '#007bff'}}>
          {isRegister ? 'Login' : 'Register'}
        </a>
      </p>
    </div>
  );
}
