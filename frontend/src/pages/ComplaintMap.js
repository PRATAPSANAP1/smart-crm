import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';

function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/map-data');
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div><Navbar /><div className="container">Loading map...</div></div>;

  const defaultCenter = complaints.length > 0 && complaints[0].location.latitude
    ? [complaints[0].location.latitude, complaints[0].location.longitude]
    : [28.6139, 77.2090];

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 style={{marginBottom:'1rem'}}>Complaint Hotspot Map</h2>
        <div className="card">
          <div style={{height:'600px',borderRadius:'10px',overflow:'hidden'}}>
            <MapContainer center={defaultCenter} zoom={12} style={{height:'100%',width:'100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {complaints.map((complaint) => (
                complaint.location.latitude && complaint.location.longitude && (
                  <Marker key={complaint._id} position={[complaint.location.latitude, complaint.location.longitude]}>
                    <Popup>
                      <div>
                        <h4>{complaint.title}</h4>
                        <p><strong>Category:</strong> {complaint.category}</p>
                        <p><strong>Ward:</strong> {complaint.ward}</p>
                        <p><strong>Status:</strong> {complaint.status}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintMap;
