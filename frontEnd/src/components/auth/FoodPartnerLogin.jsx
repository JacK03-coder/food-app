import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import AuthTypeToggle from '../shared/AuthTypeToggle';
import { useNavigate } from 'react-router-dom';
import { api } from "../../lib/api";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    await api.post("/api/auth/foodpartner/login",{
      email,
      password
    });
  
    navigate('/partner-profile');
  };

  return (
    <div className="auth-container">
      <AuthTypeToggle />

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Food Partner Login</h2>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
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
          Login
        </button>

        <div className="auth-switch">
          Don't have a food partner account? <Link to="/food-partner/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default FoodPartnerLogin;
