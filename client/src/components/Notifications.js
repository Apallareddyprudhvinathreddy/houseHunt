import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { io as ioClient } from 'socket.io-client';

let socket = null;

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/notifications');
        if (mounted) setNotes(res.data);

        const userRaw = localStorage.getItem('hh_user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          if (!socket) socket = ioClient(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000');
          socket.emit('register', user.id || user._id);
          socket.on('notification', (n) => {
            if (mounted) setNotes(prev => [n, ...prev]);
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotes((n) => n.map(x => x._id === id ? { ...x, read: true } : x));
    } catch (err) { console.error(err); }
  };

  if (!notes.length) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>🔔 Notifications</h3>
      {notes.map(n => (
        <div key={n._id} style={{ padding: 8, border: '1px solid #eee', marginBottom: 6, background: n.read ? '#fafafa' : '#fff' }}>
          <div>{n.message}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
          {!n.read && <button onClick={() => markRead(n._id)}>Mark read</button>}
        </div>
      ))}
    </div>
  );
}
