import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [props, setProps] = useState([]);

  const fetch = async (params = {}) => {
    const res = await api.get('/properties', { params });
    setProps(res.data.items || res.data);
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <h2>🏘️ Properties</h2>
      <SearchBar onSearch={fetch} />
      <div className="grid">
        {props.map(p => <PropertyCard key={p._id} prop={p} />)}
      </div>
    </div>
  );
}
