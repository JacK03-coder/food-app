import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import AuthTypeToggle from '../shared/AuthTypeToggle';
import { useNavigate } from 'react-router-dom';
import { api } from "../../lib/api";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await api.post("/api/auth/foodpartner/register",{
      name,
      contactName,
      phone,
      password, 
      address,
      email
    });

    const partnerId = response.data.foodPartner._id;
    navigate(`/foodPartner-locationSetup/${partnerId}`);
  };

  return (
    <div className="auth-container">
      <AuthTypeToggle />

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Food Partner Registration</h2>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter business name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Name</label>
          <input
            type="text"
            name="contactName"
            className="form-input"
            placeholder="Enter contact person name"
            value={formData.contactName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-input"
            placeholder="Enter business address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>

        <div className="auth-switch">
          Already have a food partner account? <Link to="/food-partner/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default FoodPartnerRegister;
