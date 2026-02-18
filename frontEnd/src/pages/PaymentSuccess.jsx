import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <h1>Payment Successful</h1>
        <p>Your order has been placed successfully.</p>
        <Link to="/explore">Go back to Explore</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
