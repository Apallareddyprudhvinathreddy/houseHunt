import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail(){
  const { id } = useParams();
  const [prop, setProp] = useState(null);
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const { user } = useAuth();

  useEffect(()=>{ 
    (async()=>{ 
      const res = await api.get(`/properties/${id}`);
      setProp(res.data);
      const revRes = await api.get(`/reviews/property/${id}`);
      setReviews(revRes.data.reviews);
    })(); 
  },[id]);

  const inquire = async () => {
    if (!user) return alert('Login to inquire');
    try {
      await api.post('/bookings', { propertyId: id, message });
      alert('Inquiry sent!');
      setMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (!prop) return <div>Loading...</div>;

  return (
    <div>
      <h2>{prop.title}</h2>
      <div>{prop.location?.city}, {prop.location?.state} — ${prop.price}</div>
      <p>{prop.description}</p>
      <div>Owner: {prop.ownerId?.name}</div>

      <div style={{marginTop: 12, border: '1px solid #ddd', padding: 12}}>
        <h3>📨 Send Inquiry</h3>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message to owner" rows="4" />
        <button onClick={inquire}>Send Inquiry</button>
      </div>

      <div style={{marginTop: 12}}>
        <h3>⭐ Reviews ({reviews.length})</h3>
        {reviews.map(r => <div key={r._id} style={{padding: 8, border: '1px solid #eee', marginBottom: 6}}>
          <div><strong>{r.userId?.name}</strong> - ⭐ {r.rating}</div>
          <div>{r.text}</div>
        </div>)}
      </div>
    </div>
  );
}
