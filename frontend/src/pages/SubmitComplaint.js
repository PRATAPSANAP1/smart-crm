import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function SubmitComplaint() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    ward: '',
    location: { address: '', latitude: '', longitude: '' }
  });
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [aiDetection, setAiDetection] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapPosition, setMapPosition] = useState([28.6139, 77.2090]);
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('userId', user.id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('ward', formData.ward);
    data.append('location', JSON.stringify(formData.location));
    if (image) data.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/complaints/add', data);
      setSuccess(`Complaint submitted successfully! ID: ${response.data.complaintId}`);
      setAiDetection(response.data.aiDetection);
      setFormData({
        title: '',
        description: '',
        category: 'Roads',
        ward: '',
        location: { address: '', latitude: '', longitude: '' }
      });
      setImage(null);
      setMarkerPosition(null);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const getLiveLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude: lat,
              longitude: lng
            }
          });
          setMapPosition([lat, lng]);
          setMarkerPosition([lat, lng]);
          setGettingLocation(false);
        },
        (error) => {
          setError('Unable to get location. Please select on map or enter manually.');
          setGettingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setGettingLocation(false);
    }
  };

  const handleMapClick = (position) => {
    setMarkerPosition(position);
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        latitude: position[0],
        longitude: position[1]
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2 style={{marginBottom:'1.5rem'}}>Submit Complaint</h2>
          {success && <div style={{background:'#d1fae5',color:'#065f46',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>{success}</div>}
          {error && <div style={{background:'#fee2e2',color:'#991b1b',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>{error}</div>}
          {aiDetection && aiDetection.detected && (
            <div style={{background:'#dbeafe',color:'#1e40af',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>
              <strong>🤖 AI Detection:</strong> {aiDetection.issue} (Confidence: {(aiDetection.confidence * 100).toFixed(1)}%)
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Complaint Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Broken streetlight near school"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Roads">Roads & Infrastructure</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Drainage">Drainage</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                required
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Ward Number</label>
              <input
                type="text"
                required
                placeholder="e.g., Ward 5"
                value={formData.ward}
                onChange={(e) => setFormData({...formData, ward: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Location Address</label>
              <input
                type="text"
                required
                placeholder="e.g., Near City Hospital, Main Road"
                value={formData.location.address}
                onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
              />
            </div>

            <div className="form-group">
              <label>Select Location on Map</label>
              <button 
                type="button" 
                onClick={getLiveLocation} 
                className="btn btn-success" 
                disabled={gettingLocation}
                style={{marginBottom:'1rem',width:'100%'}}
              >
                {gettingLocation ? '📍 Getting Location...' : '📍 Use My Current Location'}
              </button>
              
              <div style={{height:'400px',borderRadius:'10px',overflow:'hidden',border:'2px solid #ddd'}}>
                <MapContainer center={mapPosition} zoom={13} style={{height:'100%',width:'100%'}}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={markerPosition} setPosition={handleMapClick} />
                </MapContainer>
              </div>
              <p style={{fontSize:'0.9rem',color:'#666',marginTop:'0.5rem'}}>
                Click on the map to select exact location or use live location button
              </p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Auto-filled from map"
                  value={formData.location.latitude}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, latitude: e.target.value}})}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Auto-filled from map"
                  value={formData.location.longitude}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, longitude: e.target.value}})}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>Upload Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit Complaint</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitComplaint;
