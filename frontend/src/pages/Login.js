import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role });
      
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      console.log('✅ Login successful!');
      console.log('User role:', response.data.user.role);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setToast({ message: `Login successful! Welcome ${response.data.user.name}`, type: 'success' });
      
      setTimeout(() => {
        if (response.data.user.role === 'admin') {
          console.log('🔄 Redirecting to /admin');
          window.location.replace('/admin');
        } else {
          console.log('🔄 Redirecting to home');
          window.location.replace('/');
        }
      }, 1000);
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMsg = err.response?.data?.message || 'Login failed';
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
          <h2 style={{marginBottom:'1.5rem',textAlign:'center'}}>Login</h2>
          {error && <div style={{background:'#fee2e2',color:'#991b1b',padding:'0.75rem',borderRadius:'5px',marginBottom:'1rem'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
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
              <label>Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Login As</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="citizen">Citizen</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Login</button>
          </form>
          <p style={{textAlign:'center',marginTop:'1rem'}}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
