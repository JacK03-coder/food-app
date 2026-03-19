import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { api } from "../../lib/api";
import { getSession, saveSession } from "../../lib/session";

const EMPTY_FORM = {
  name: "",
  contactName: "",
  phone: "",
  address: "",
  description: "",
  openingHours: "",
  avatarUrl: "",
  coverImageUrl: "",
  cuisineTags: "",
};

const NEXT_STATUS = {
  ordered: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

const formatStatus = (status) => status.replaceAll("_", " ");

const PartnerProfile = () => {
  const navigate = useNavigate();
  const session = getSession();
  const sessionPartnerId = session?.foodPartner?._id;
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  useEffect(() => {
    if (!sessionPartnerId) {
      navigate("/food-partner/login");
      return;
    }

    const loadPartnerData = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          api.get("/api/auth/foodpartner/me"),
          api.get("/api/orders/foodpartner"),
        ]);

        const partner = profileResponse.data.foodPartner;
        setProfile(partner);
        setFormData({
          name: partner.name || "",
          contactName: partner.contactName || "",
          phone: partner.phone || "",
          address: partner.address || "",
          description: partner.description || "",
          openingHours: partner.openingHours || "",
          avatarUrl: partner.avatarUrl || "",
          coverImageUrl: partner.coverImageUrl || "",
          cuisineTags: (partner.cuisineTags || []).join(", "),
        });
        setOrders(ordersResponse.data.orders || []);
      } catch (error) {
        setMessage("Unable to load partner dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadPartnerData();
  }, [navigate, sessionPartnerId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const response = await api.put("/api/auth/foodpartner/me", formData);
      setProfile(response.data.foodPartner);
      saveSession({
        role: "foodpartner",
        foodPartner: response.data.foodPartner,
      });
      setMessage("Partner profile updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update partner profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdvanceStatus = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) {
      return;
    }

    try {
      setUpdatingOrderId(order._id);
      const response = await api.patch(`/api/orders/${order._id}/status`, {
        status: nextStatus,
        note: `Marked as ${formatStatus(nextStatus)}`,
      });

      setOrders((prev) =>
        prev.map((currentOrder) =>
          currentOrder._id === order._id ? response.data.order : currentOrder
        )
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  if (loading) {
    return <div className="profile-shell"><p>Loading partner dashboard...</p></div>;
  }

  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const activeOrders = orders.filter((order) => order.status !== "delivered").length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.pricing.totalAmount || 0), 0);

  return (
    <div className="profile-shell">
      <div
        className="profile-hero partner-hero"
        style={{
          backgroundImage: profile?.coverImageUrl
            ? `linear-gradient(135deg, rgba(17, 24, 39, 0.82), rgba(146, 64, 14, 0.78)), url(${profile.coverImageUrl})`
            : undefined,
        }}
      >
        <div className="profile-identity">
          <img
            src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "Partner")}&background=fef3c7&color=92400e`}
            alt={profile?.name}
            className="profile-photo"
          />
          <div>
            <p className="eyebrow">Food partner dashboard</p>
            <h1>{profile?.name}</h1>
            <p className="hero-copy">
              Manage your store identity, track order progress, and keep customers updated through delivery.
            </p>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Revenue</span>
            <strong>Rs. {revenue.toFixed(0)}</strong>
          </div>
          <div className="stat-card">
            <span>Live orders</span>
            <strong>{activeOrders}</strong>
          </div>
          <div className="stat-card">
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>
          <div className="stat-card">
            <span>Contact</span>
            <strong>{profile?.contactName}</strong>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Store profile</p>
              <h2>Business details</h2>
            </div>
            <div className="action-group">
              <button className="btn secondary" onClick={() => navigate("/create-food")}>
                Add food
              </button>
              <button className="btn ghost" onClick={() => navigate("/food-partner-store")}>
                My store
              </button>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Store name
              <input name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
              Contact name
              <input name="contactName" value={formData.contactName} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <label>
              Opening hours
              <input name="openingHours" value={formData.openingHours} onChange={handleChange} />
            </label>
            <label className="full-span">
              Address
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
            </label>
            <label className="full-span">
              Description
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </label>
            <label className="full-span">
              Cuisine tags
              <input name="cuisineTags" value={formData.cuisineTags} onChange={handleChange} placeholder="North Indian, Snacks, Beverages" />
            </label>
            <label className="full-span">
              Logo URL
              <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
            </label>
            <label className="full-span">
              Cover image URL
              <input name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} />
            </label>

            <div className="profile-actions full-span">
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
          {message ? <p className="form-message">{message}</p> : null}
        </section>

        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Operations</p>
              <h2>Order queue</h2>
            </div>
          </div>

          <div className="history-list">
            {orders.length ? (
              orders.map((order) => (
                <article key={order._id} className="history-card">
                  <div className="history-top">
                    <div>
                      <h3>{order.foodName}</h3>
                      <p>Customer order on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`status-pill ${order.status}`}>{formatStatus(order.status)}</span>
                  </div>
                  <div className="history-meta">
                    <span>Amount Rs. {order.pricing.totalAmount}</span>
                    <span>{order.deliveryAddress || "Address pending"}</span>
                  </div>
                  <div className="timeline compact">
                    {order.statusHistory.map((entry, index) => (
                      <div key={`${order._id}-${index}`} className="timeline-item">
                        <strong>{formatStatus(entry.status)}</strong>
                        <span>{entry.note || "Order updated"}</span>
                      </div>
                    ))}
                  </div>
                  {NEXT_STATUS[order.status] ? (
                    <button
                      className="btn primary"
                      onClick={() => handleAdvanceStatus(order)}
                      disabled={updatingOrderId === order._id}
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : `Mark ${formatStatus(NEXT_STATUS[order.status])}`}
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>No transactions yet</h3>
                <p>Paid customer orders will appear here and can be moved up to delivered.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartnerProfile;
