import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="hp-hero">
      <div className="hp-content">
        <h1 className="hp-title">QuickBite</h1>
        <p className="hp-sub">
          Discover your next favorite dish through short, captivating food videos from local kitchens.
        </p>
        <div className="hp-actions">
          <button className="hp-btn hp-btn-primary" onClick={() => navigate('/user/login')}>
            Explore as User
          </button>
          <button className="hp-btn hp-btn-outline" onClick={() => navigate('/food-partner/login')}>
            Join as a Partner
          </button>
        </div>
      </div>

      <section className="hp-features">
        <div className="feature-card">
          <h3>Discover</h3>
          <p>Scroll through an endless feed of delicious food videos.</p>
        </div>
        <div className="feature-card">
          <h3>Order</h3>
          <p>Simple, fast ordering from local restaurants and food partners.</p>
        </div>
        <div className="feature-card">
          <h3>Support Local</h3>
          <p>Help local businesses thrive by ordering directly.</p>
        </div>
      </section>

      <footer className="hp-footer-expanded">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">QuickBite</div>
            <p className="footer-tagline">Discover your next favorite dish.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h5>Product</h5>
              <ul>
                <li><button className="link" onClick={() => navigate('/')}>Features</button></li>
                <li><button className="link" onClick={() => navigate('/user/register')}>Sign Up</button></li>
                <li><button className="link" onClick={() => navigate('/food-partner/register')}>For Partners</button></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li><button className="link" onClick={() => {}}>About Us</button></li>
                <li><button className="link" onClick={() => {}}>Careers</button></li>
                <li><button className="link" onClick={() => {}}>Contact</button></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <ul>
                <li><button className="link" onClick={() => {}}>Terms of Service</button></li>
                <li><button className="link" onClick={() => {}}>Privacy Policy</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
