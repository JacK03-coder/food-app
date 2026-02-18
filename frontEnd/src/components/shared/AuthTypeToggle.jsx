import { useNavigate, useLocation } from 'react-router-dom';

const AuthTypeToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isRegisterPath = location.pathname.includes('register');
  const isFoodPartner = location.pathname.includes('food-partner');

  const navigateToUser = () => {
    navigate(isRegisterPath ? '/user/register' : '/user/login');
  };

  const navigateToFoodPartner = () => {
    navigate(isRegisterPath ? '/food-partner/register' : '/food-partner/login');
  };

  return (
    <div className="auth-nav">
      <div className="auth-type-toggle">
        <button 
          className={`auth-nav-btn ${!isFoodPartner ? 'active' : ''}`}
          onClick={navigateToUser}
        >
          User
        </button>
        <button 
          className={`auth-nav-btn ${isFoodPartner ? 'active' : ''}`}
          onClick={navigateToFoodPartner}
        >
          Food Partner
        </button>
      </div>
      <div className="auth-action-toggle">
        {isRegisterPath ? 'Register' : 'Login'}
      </div>
    </div>
  );
};

export default AuthTypeToggle;