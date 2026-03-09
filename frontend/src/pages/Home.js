import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Smart Public Service CRM</h1>
          <p>Report civic issues and track their resolution in real-time</p>
          <Link to="/submit-complaint">
            <button className="btn btn-primary" style={{fontSize:'1.2rem',padding:'1rem 2rem'}}>
              Report a Complaint
            </button>
          </Link>
        </div>

        <h2 style={{textAlign:'center',marginBottom:'2rem'}}>How It Works</h2>
        <div className="features">
          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Report Issue</h3>
            <p>Submit your civic complaint with details and location</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔍</div>
            <h3>AI Categorization</h3>
            <p>System automatically categorizes and assigns priority</p>
          </div>
          <div className="feature-card">
            <div className="icon">👨💼</div>
            <h3>Authority Reviews</h3>
            <p>Complaint assigned to relevant department</p>
          </div>
          <div className="feature-card">
            <div className="icon">✅</div>
            <h3>Track Resolution</h3>
            <p>Monitor status updates until issue is resolved</p>
          </div>
        </div>

        <h2 style={{textAlign:'center',marginTop:'3rem',marginBottom:'2rem'}}>Civic Issues We Handle</h2>
        <div className="features">
          <div className="feature-card">
            <div className="icon">🛣️</div>
            <h3>Roads & Infrastructure</h3>
            <p>Potholes, damaged roads, broken footpaths</p>
          </div>
          <div className="feature-card">
            <div className="icon">🗑️</div>
            <h3>Waste Management</h3>
            <p>Garbage collection, overflowing dustbins</p>
          </div>
          <div className="feature-card">
            <div className="icon">💧</div>
            <h3>Water Supply</h3>
            <p>Pipeline leakage, water supply issues</p>
          </div>
          <div className="feature-card">
            <div className="icon">💡</div>
            <h3>Electricity</h3>
            <p>Streetlight problems, power issues</p>
          </div>
          <div className="feature-card">
            <div className="icon">🌊</div>
            <h3>Drainage</h3>
            <p>Blocked drains, waterlogging, flooding</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
