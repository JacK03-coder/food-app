import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/OrderFood.css";
import { api, API_BASE_URL } from "../lib/api";

const OrderFood = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);

  const platformCharge = 5.0;
  const deliveryCharge = 20.0;

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/food/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setFood(data.foodItem);
      } catch (err) {
        console.error("Error fetching food:", err);
      }
    };
    fetchFood();
  }, [id]);

  if (!food) return <p>Loading...</p>;

  const totalAmount = Number(food.price) + platformCharge + deliveryCharge;

  const checkouthandler = async () => {
    const {
      data: { key },
    } = await api.get("/api/getkey");
    const {
      data: { order },
    } = await api.post("/api/razorpay/order", {
      amount: totalAmount,
    });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "FoodieApp",
      description: "Order payment",
      order_id: order.id,
      callback_url: `${API_BASE_URL}/api/verify-razorpay/payment`,
      prefill: {
        name: "Test User",
        email: "test@test.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="food-details-col">
          <h2>{food.name}</h2>
          <video src={food.video} className="food-image" muted autoPlay loop />
          <p>{food.description}</p>
        </div>

        <div className="billing-details-col">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="billing-item">
              <span>Item</span>
              <span>Rs. {food.price}</span>
            </div>
            <div className="billing-item">
              <span>Platform</span>
              <span>Rs. {platformCharge}</span>
            </div>
            <div className="billing-item">
              <span>Delivery</span>
              <span>Rs. {deliveryCharge}</span>
            </div>
            <div className="billing-total">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>
          </div>

          <button className="confirm-order-btn" onClick={checkouthandler}>
            Confirm Order
          </button>
          <div className="final-price">Price: Rs. {totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
