import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/OrderFood.css";
import { api, API_BASE_URL } from "../lib/api";
import { getSession } from "../lib/session";

const OrderFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

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
    const session = getSession();
    if (!session?.user) {
      navigate("/user/login");
      return;
    }

    try {
      setIsPaying(true);
      setError("");

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
        prefill: {
          name: session.user.fullName,
          email: session.user.email,
          contact: session.user.phone || "9999999999",
        },
        theme: { color: "#ff7a18" },
        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/api/verify-razorpay/payment", {
              ...response,
              foodId: food._id,
              deliveryAddress: session.user.address || "",
              pricing: {
                itemTotal: Number(food.price),
                platformCharge,
                deliveryCharge,
                totalAmount,
              },
            });

            navigate("/payment/success", {
              state: {
                order: verifyResponse.data.order,
              },
            });
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || "Payment verification failed.");
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to complete payment right now.");
      setIsPaying(false);
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="food-details-col">
          <h2>{food.name}</h2>
          <video src={food.video} className="food-image" muted autoPlay loop />
          <p className="food-description">{food.description}</p>
        </div>

        <div className="billing-details-col">
          <div className="delivery-card">
            <h3>Delivery Details</h3>
            <p>{getSession()?.user?.address || "Add your delivery address in profile for smoother checkout."}</p>
            <span>Partner: {food.foodPartnername || "Local Kitchen"}</span>
          </div>
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

          <button className="confirm-order-btn" onClick={checkouthandler} disabled={isPaying}>
            {isPaying ? "Processing..." : "Confirm Order"}
          </button>
          <div className="final-price">Price: Rs. {totalAmount.toFixed(2)}</div>
          {error ? <p className="order-error">{error}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
