import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch({ city, maxPrice, type });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
      <input placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">Any</option>
        <option>Apartment</option>
        <option>House</option>
        <option>Condo</option>
      </select>
      <button>Search</button>
    </form>
  );
}
