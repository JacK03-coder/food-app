  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import '../../styles/profile.css';

  const UserProfile = () => {
    const navigate = useNavigate();

    // Dummy data for user profile
    const user = {
      photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      name: 'Rob Stark',
      username: 'alexdoe',
      userId: 'usr_a1b2c3d4',
      email: 'robstark33.com',
      phone: '+91 5939439935',
      address: '123 Main Street, delhi',
    };
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <img src={user.photoUrl} alt="User" className="profile-photo" />
            <div className="profile-name-id">
              <h2>{user.name}</h2>
              <p>@{user.username}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <strong>User ID</strong>
              <span>{user.userId}</span>
            </div>
            <div className="detail-item">
              <strong>Email</strong>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <strong>Phone</strong>
              <span>{user.phone}</span>
            </div>
            <div className="detail-item">
              <strong>Address</strong>
              <span>{user.address}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn primary" onClick={() => navigate('/explore')}>
              Explore Foods
            </button>
            <button className='btn primary' onClick={()=> navigate('/explore')}> 
              Watch Globally
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default UserProfile;
