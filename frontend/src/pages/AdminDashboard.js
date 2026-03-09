import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardComplaints, setWardComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, complaintsRes, mapRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/dashboard'),
        axios.get('http://localhost:5000/api/complaints'),
        axios.get('http://localhost:5000/api/analytics/map-data')
      ]);
      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
      setMapData(mapRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/update/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getMarkerIcon = (status) => {
    if (status === 'Resolved') return greenIcon;
    if (status === 'In Progress') return orangeIcon;
    return redIcon;
  };

  const showLocationModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
  };

  const showWardComplaints = (ward) => {
    const filtered = complaints.filter(c => c.ward === ward);
    setWardComplaints(filtered);
    setSelectedWard(ward);
  };

  const closeWardModal = () => {
    setSelectedWard(null);
    setWardComplaints([]);
  };

  if (loading) return <div><Navbar /><div className="container">Loading...</div></div>;

  const categoryData = {
    labels: stats.categoryStats.map(c => c._id),
    datasets: [{
      data: stats.categoryStats.map(c => c.count),
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
    }]
  };

  const wardData = {
    labels: stats.wardStats.slice(0, 10).map(w => w._id),
    datasets: [{
      label: 'Complaints',
      data: stats.wardStats.slice(0, 10).map(w => w.count),
      backgroundColor: '#667eea'
    }]
  };

  const defaultCenter = mapData.length > 0 && mapData[0].location.latitude
    ? [mapData[0].location.latitude, mapData[0].location.longitude]
    : [28.6139, 77.2090];

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
          <h2>Admin Dashboard</h2>
          <div>
            <button onClick={() => setView('dashboard')} className={`btn ${view === 'dashboard' ? 'btn-primary' : 'btn-success'}`} style={{marginRight:'1rem'}}>Dashboard</button>
            <button onClick={() => setView('map')} className={`btn ${view === 'map' ? 'btn-primary' : 'btn-success'}`}>Map View</button>
          </div>
        </div>

        {view === 'dashboard' ? (
          <>
            <div className="stats-grid">
              <div className="stat-card" style={{background:'#6366f1'}}>
                <h3>{stats.totalComplaints}</h3>
                <p>Total Complaints</p>
              </div>
              <div className="stat-card" style={{background:'#f59e0b'}}>
                <h3>{stats.pendingComplaints}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card" style={{background:'#3b82f6'}}>
                <h3>{stats.inProgressComplaints}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card" style={{background:'#10b981'}}>
                <h3>{stats.resolvedComplaints}</h3>
                <p>Resolved</p>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>
              <div className="chart-container">
                <h3 style={{marginBottom:'1rem'}}>Complaints by Category</h3>
                <Pie data={categoryData} />
              </div>
              <div className="chart-container">
                <h3 style={{marginBottom:'1rem'}}>Top 10 Wards (Click to view)</h3>
                <Bar 
                  data={wardData} 
                  options={{
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                        const index = elements[0].index;
                        const ward = stats.wardStats[index]._id;
                        showWardComplaints(ward);
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `Complaints: ${context.parsed.y}`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="card">
              <h3 style={{marginBottom:'1rem'}}>All Complaints</h3>
              <div style={{overflowX:'auto'}}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Ward</th>
                      <th>Priority</th>
                      <th>AI Detection</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>{complaint._id.slice(-6)}</td>
                        <td>
                          {complaint.image ? (
                            <img 
                              src={`http://localhost:5000/uploads/${complaint.image}`} 
                              alt="Complaint" 
                              style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'8px',cursor:'pointer'}}
                              onClick={() => window.open(`http://localhost:5000/uploads/${complaint.image}`, '_blank')}
                            />
                          ) : (
                            <span style={{color:'#94a3b8',fontSize:'0.85rem'}}>No image</span>
                          )}
                        </td>
                        <td>
                          <span 
                            style={{color:'#6366f1',cursor:'pointer',textDecoration:'underline',fontWeight:'500'}}
                            onClick={() => showLocationModal(complaint)}
                          >
                            {complaint.title}
                          </span>
                        </td>
                        <td>{complaint.category}</td>
                        <td>{complaint.ward}</td>
                        <td><span className={`badge badge-${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></td>
                        <td>
                          {complaint.aiDetection?.detected ? (
                            <div style={{fontSize:'0.85rem'}}>
                              <div style={{color:'#6366f1',fontWeight:'600',marginBottom:'0.25rem'}}>🤖 AI Detected</div>
                              <div style={{color:'#64748b'}}>{complaint.aiDetection.issue}</div>
                              <div style={{color:'#10b981',fontSize:'0.75rem'}}>Confidence: {(complaint.aiDetection.confidence * 100).toFixed(0)}%</div>
                            </div>
                          ) : (
                            <span style={{color:'#94a3b8'}}>No AI data</span>
                          )}
                        </td>
                        <td><span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>{complaint.status}</span></td>
                        <td>
                          <select 
                            value={complaint.status} 
                            onChange={(e) => updateStatus(complaint._id, e.target.value)}
                            style={{padding:'0.5rem',borderRadius:'5px',border:'1px solid #ddd'}}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <h3 style={{marginBottom:'1rem'}}>Complaint Location Map</h3>
            <div style={{height:'600px',borderRadius:'10px',overflow:'hidden'}}>
              <MapContainer center={defaultCenter} zoom={12} style={{height:'100%',width:'100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapData.map((complaint) => (
                  complaint.location.latitude && complaint.location.longitude && (
                    <Marker 
                      key={complaint._id} 
                      position={[complaint.location.latitude, complaint.location.longitude]}
                      icon={getMarkerIcon(complaint.status)}
                    >
                      <Popup>
                        <div>
                          <h4>{complaint.title}</h4>
                          <p><strong>Category:</strong> {complaint.category}</p>
                          <p><strong>Ward:</strong> {complaint.ward}</p>
                          <p><strong>Priority:</strong> {complaint.priority}</p>
                          <p><strong>Status:</strong> {complaint.status}</p>
                          {complaint.aiDetection?.detected && (
                            <p><strong>🤖 AI:</strong> {complaint.aiDetection.issue}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
            <div style={{marginTop:'1rem',textAlign:'center'}}>
              <span style={{color:'red',fontSize:'1.2rem'}}>● </span>Pending &nbsp;&nbsp;
              <span style={{color:'orange',fontSize:'1.2rem'}}>● </span>In Progress &nbsp;&nbsp;
              <span style={{color:'green',fontSize:'1.2rem'}}>● </span>Resolved (Auto-removed after 24hrs)
            </div>
          </div>
        )}
      </div>
      
      {selectedComplaint && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:2000
        }} onClick={closeModal}>
          <div style={{
            background:'white',
            padding:'2rem',
            borderRadius:'16px',
            maxWidth:'600px',
            width:'90%',
            maxHeight:'80vh',
            overflow:'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h3>Complaint Details</h3>
              <button onClick={closeModal} style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer'}}>&times;</button>
            </div>
            
            <div style={{marginBottom:'1rem'}}>
              <strong>Title:</strong> {selectedComplaint.title}
            </div>
            <div style={{marginBottom:'1rem'}}>
              <strong>Description:</strong> {selectedComplaint.description}
            </div>
            <div style={{marginBottom:'1rem'}}>
              <strong>Category:</strong> {selectedComplaint.category}
            </div>
            <div style={{marginBottom:'1rem'}}>
              <strong>Ward:</strong> {selectedComplaint.ward}
            </div>
            <div style={{marginBottom:'1rem'}}>
              <strong>Location:</strong> {selectedComplaint.location?.address || 'N/A'}
            </div>
            {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude && (
              <div style={{marginBottom:'1rem'}}>
                <strong>Coordinates:</strong> {selectedComplaint.location.latitude}, {selectedComplaint.location.longitude}
                <br/>
                <a 
                  href={`https://www.google.com/maps?q=${selectedComplaint.location.latitude},${selectedComplaint.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color:'#6366f1',textDecoration:'underline'}}
                >
                  View on Google Maps
                </a>
              </div>
            )}
            {selectedComplaint.image && (
              <div style={{marginBottom:'1rem'}}>
                <strong>Image:</strong><br/>
                <img 
                  src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
                  alt="Complaint"
                  style={{width:'100%',maxHeight:'300px',objectFit:'contain',marginTop:'0.5rem',borderRadius:'8px'}}
                />
              </div>
            )}
            <button onClick={closeModal} className="btn btn-primary" style={{width:'100%'}}>Close</button>
          </div>
        </div>
      )}
      
      {selectedWard && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:2000
        }} onClick={closeWardModal}>
          <div style={{
            background:'white',
            padding:'2rem',
            borderRadius:'16px',
            maxWidth:'900px',
            width:'90%',
            maxHeight:'80vh',
            overflow:'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h3>{selectedWard} - {wardComplaints.length} Complaints</h3>
              <button onClick={closeWardModal} style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer'}}>&times;</button>
            </div>
            
            <div style={{overflowX:'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wardComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>{complaint._id.slice(-6)}</td>
                      <td>
                        <span 
                          style={{color:'#6366f1',cursor:'pointer',textDecoration:'underline'}}
                          onClick={() => { closeWardModal(); showLocationModal(complaint); }}
                        >
                          {complaint.title}
                        </span>
                      </td>
                      <td>{complaint.category}</td>
                      <td><span className={`badge badge-${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></td>
                      <td><span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>{complaint.status}</span></td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button onClick={closeWardModal} className="btn btn-primary" style={{width:'100%',marginTop:'1rem'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
