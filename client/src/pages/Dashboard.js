import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Notifications from '../components/Notifications';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      if (user.role === 'Owner') {
        const [props, bookings] = await Promise.all([
          api.get('/properties/mine'),
          api.get('/bookings/owner')
        ]);
        setData({ props: props.data, bookings: bookings.data });
      } else {
        const bookings = await api.get('/bookings/my');
        setData({ bookings: bookings.data });
      }
    };
    fetch();
  }, [user]);

  if (!user) return <div>Please login</div>;

  const approveBooking = async (id) => {
    await api.put(`/bookings/${id}/approve`);
    alert('Booking approved!');
    window.location.reload();
  };

  return (
    <div>
      <h2>📊 Dashboard ({user.role})</h2>
      <Notifications />
      {user.role === 'Owner' && <>
        <h3>Your Properties</h3>
        {data.props?.map(p => <div key={p._id} style={{padding: 8, border: '1px solid #ddd', marginBottom: 8}}>
          <strong>{p.title}</strong> — ${p.price} in {p.location?.city}
        </div>)}
        <h3>Booking Inquiries</h3>
        {data.bookings?.map(b => <div key={b._id} style={{padding: 8, border: '1px solid #ddd', marginBottom: 8}}>
          <div><strong>{b.renterId?.name}</strong> inquired about <strong>{b.propertyId?.title}</strong></div>
          <div>Message: {b.message}</div>
          <div>Status: {b.status}</div>
          {b.status === 'pending' && <button onClick={() => approveBooking(b._id)}>Approve</button>}
        </div>)}
      </>}
      {user.role === 'Renter' && <>
        <h3>Your Bookings</h3>
        {data.bookings?.map(b => <div key={b._id} style={{padding: 8, border: '1px solid #ddd', marginBottom: 8}}>
          <div><strong>{b.propertyId?.title}</strong> — {b.status}</div>
          <div>Your message: {b.message}</div>
        </div>)}
      </>}
    </div>
  );
}
