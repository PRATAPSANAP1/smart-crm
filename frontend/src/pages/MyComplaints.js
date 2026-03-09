import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function MyComplaints() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/complaints/user/${user.id}`);
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-pending',
      'In Progress': 'badge-progress',
      'Resolved': 'badge-resolved'
    };
    return badges[status] || 'badge-pending';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'High': 'badge-high',
      'Medium': 'badge-medium',
      'Low': 'badge-low'
    };
    return badges[priority] || 'badge-medium';
  };

  if (loading) return <div><Navbar /><div className="container">Loading...</div></div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 style={{marginBottom:'2rem'}}>My Complaints</h2>
        
        {complaints.length === 0 ? (
          <div className="card">
            <p style={{textAlign:'center',color:'#666'}}>No complaints submitted yet.</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Ward</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint._id.slice(-6)}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.ward}</td>
                    <td><span className={`badge ${getPriorityBadge(complaint.priority)}`}>{complaint.priority}</span></td>
                    <td><span className={`badge ${getStatusBadge(complaint.status)}`}>{complaint.status}</span></td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
