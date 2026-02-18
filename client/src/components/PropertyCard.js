import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ prop }) {
  return (
    <div className="card">
      <h3>{prop.title}</h3>
      <div>{prop.location?.city} — ${prop.price}</div>
      <p>{prop.propertyType}</p>
      <Link to={`/property/${prop._id}`}>View Details →</Link>
    </div>
  );
}
