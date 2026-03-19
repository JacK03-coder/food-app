import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <h1>Payment Successful</h1>
        <p>Your order has been placed successfully.</p>
        {order ? (
          <div style={{ marginBottom: "16px" }}>
            <p><strong>{order.foodName}</strong></p>
            <p>Status: {order.status.replaceAll("_", " ")}</p>
            <p>Total Paid: Rs. {order.pricing.totalAmount}</p>
          </div>
        ) : null}
        <Link to="/explore">Go back to Explore</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
