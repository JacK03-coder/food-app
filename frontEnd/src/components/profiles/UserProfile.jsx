import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { api } from "../../lib/api";
import { getSession, saveSession } from "../../lib/session";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  address: "",
  avatarUrl: "",
  bio: "",
  favoriteCuisine: "",
};

const formatStatus = (status) => status.replaceAll("_", " ");
const ORDER_STAGES = ["ordered", "preparing", "out_for_delivery", "delivered"];

const UserProfile = () => {
  const navigate = useNavigate();
  const session = getSession();
  const sessionUserId = session?.user?._id;
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionUserId) {
      navigate("/user/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          api.get("/api/auth/user/me"),
          api.get("/api/orders/user"),
        ]);

        setProfile(profileResponse.data.user);
        setFormData({
          fullName: profileResponse.data.user.fullName || "",
          phone: profileResponse.data.user.phone || "",
          address: profileResponse.data.user.address || "",
          avatarUrl: profileResponse.data.user.avatarUrl || "",
          bio: profileResponse.data.user.bio || "",
          favoriteCuisine: profileResponse.data.user.favoriteCuisine || "",
        });
        setOrders(ordersResponse.data.orders || []);
      } catch (error) {
        setMessage("Unable to load your profile right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, sessionUserId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const response = await api.put("/api/auth/user/me", formData);
      setProfile(response.data.user);
      saveSession({
        role: "user",
        user: response.data.user,
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-shell"><p>Loading profile...</p></div>;
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.pricing.totalAmount || 0), 0);
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;
  const activeOrders = orders.filter((order) => order.status !== "delivered").length;

  return (
    <div className="profile-shell">
      <div className="profile-hero user-hero">
        <div className="profile-identity">
          <img
            src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "User")}&background=ffedd5&color=9a3412`}
            alt={profile?.fullName}
            className="profile-photo"
          />
          <div>
            <p className="eyebrow">User dashboard</p>
            <h1>{profile?.fullName}</h1>
            <p className="hero-copy">
              Track every order, keep delivery details updated, and make repeat checkout faster.
            </p>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-card">
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </div>
          <div className="stat-card">
            <span>Spent</span>
            <strong>Rs. {totalSpent.toFixed(0)}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{activeOrders}</strong>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Profile settings</p>
              <h2>Personal details</h2>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="fullName" value={formData.fullName} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <label className="full-span">
              Address
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
            </label>
            <label className="full-span">
              Avatar URL
              <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
            </label>
            <label className="full-span">
              Bio
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />
            </label>
            <label>
              Favorite cuisine
              <input name="favoriteCuisine" value={formData.favoriteCuisine} onChange={handleChange} />
            </label>
            <label>
              Email
              <input value={profile?.email || ""} disabled />
            </label>

            <div className="profile-actions full-span">
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button type="button" className="btn secondary" onClick={() => navigate("/explore")}>
                Explore Foods
              </button>
            </div>
          </form>
          {message ? <p className="form-message">{message}</p> : null}
        </section>

        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Transactions</p>
              <h2>Order history</h2>
            </div>
            <button className="btn ghost" onClick={() => navigate("/explore")}>
              Order again
            </button>
          </div>

          <div className="history-list">
            {orders.length ? (
              orders.map((order) => (
                <article key={order._id} className="history-card">
                  <div className="history-top">
                    <div>
                      <h3>{order.foodName}</h3>
                      <p>{order.partnerName}</p>
                    </div>
                    <span className={`status-pill ${order.status}`}>{formatStatus(order.status)}</span>
                  </div>
                  <div className="history-meta">
                    <span>Paid Rs. {order.pricing.totalAmount}</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="tracking-strip" aria-label={`Tracking status ${formatStatus(order.status)}`}>
                    {ORDER_STAGES.map((stage, index) => {
                      const currentIndex = ORDER_STAGES.indexOf(order.status);
                      const isComplete = index <= currentIndex;
                      return (
                        <div
                          key={`${order._id}-${stage}`}
                          className={`tracking-step ${isComplete ? "active" : ""}`}
                        >
                          <span className="tracking-dot" />
                          <small>{formatStatus(stage)}</small>
                        </div>
                      );
                    })}
                  </div>
                  <div className="timeline">
                    {order.statusHistory.map((entry, index) => (
                      <div key={`${order._id}-${index}`} className="timeline-item">
                        <strong>{formatStatus(entry.status)}</strong>
                        <span>{entry.note || "Status updated"}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>No orders yet</h3>
                <p>Your paid orders will appear here with transaction and delivery status.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
