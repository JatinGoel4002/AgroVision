import React from 'react';
import './DashboardHome.css';

export default function DashboardHome() {
  return (
    <main className="dashboard-container" style={{ marginTop: '4.5rem' }}>
      <h1 className="dashboard-title">Welcome to your AgroVision Dashboard</h1>
      <p className="dashboard-text">
        AgroVision helps farmers and agricultural professionals make smarter decisions using AI-powered tools. Here you can:
        <ul style={{ marginTop: '1rem', marginBottom: '1rem', paddingLeft: '1.5rem' }}>
          <li>Get crop recommendations based on soil and climate data</li>
          <li>Detect plant diseases from leaf images</li>
          <li>Chat with an AI assistant for farming advice</li>
          <li>Learn more about the platform and its features</li>
        </ul>
        Start by choosing a tool above!
      </p>
    </main>
  );
}