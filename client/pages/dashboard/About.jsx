import React from 'react';
import './About.css';

function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder-container" style={{ marginTop: '4.5rem' }}>
      <div className="placeholder-content">
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-description">{description}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <PlaceholderPage 
      title="About AgroVision" 
      description="AgroVision helps farmers make data‑driven decisions with AI for crop guidance and disease diagnosis."
    />
  );
}