import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'citizen'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      console.log('Attempting registration with:', { name: formData.name, email: formData.email, role: formData.role });
      
      await axios.post('http://localhost:5000/api/users/register', formData);
      
      console.log('✅ Registration successful!');
      const successMsg = 'Registration successful! Redirecting to login...';
      setSuccess(successMsg);
      setToast({ message: successMsg, type: 'success' });
      
      setTimeout(() => {
        console.log('🔄 Redirecting to login page...');
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('❌ Registration failed:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <div>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-container">
        <div className="card">
          <h2 style={{marginBottom:'1.5rem',textAlign:'center'}}>Register</h2>
          {error && <div style={{background:'#fee2e2',color:'#991b1b',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>{error}</div>}
          {success && <div style={{background:'#d1fae5',color:'#065f46',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="citizen">Citizen</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Register</button>
          </form>
          <p style={{textAlign:'center',marginTop:'1rem'}}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
