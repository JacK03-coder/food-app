import { useNavigate } from 'react-router-dom';
import '../../styles/profile.css';

const PartnerProfile = () => {
  const navigate = useNavigate();

  // Dummy data for partner profile
  const partner = {
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    name: 'The Corner Cafe',
    username: 'cornercafe',
    userId: 'prt_e5f6g7h8',
    email: 'contact@cornercafe.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Avenue, Foodville, USA',
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img src={partner.photoUrl} alt="Partner" className="profile-photo" />
          <div className="profile-name-id">
            <h2>{partner.name}</h2>
            <p>@{partner.username}</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <strong>Partner ID</strong>
            <span>{partner.userId}</span>
          </div>
          <div className="detail-item">
            <strong>Email</strong>
            <span>{partner.email}</span>
          </div>
          <div className="detail-item">
            <strong>Phone</strong>
            <span>{partner.phone}</span>
          </div>
          <div className="detail-item">
            <strong>Address</strong>
            <span>{partner.address}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn primary" onClick={() => navigate('/explore')}>
            Explore
          </button>
          <button className="btn secondary" onClick={() => navigate('/food-partner-store')}>
            My Store
          </button>
          <button className="btn secondary" onClick={() => navigate('/create-food')}>
            Add New Food
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
