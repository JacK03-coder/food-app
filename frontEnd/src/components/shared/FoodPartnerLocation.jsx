import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/location.css";
import { api } from "../../lib/api";

const FoodPartnerLocationSetup = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const getLocation = () => {
    setLoading(true);
    setSaved(false);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });

        try {
          await api.put(`/api/foodpartner/${id}/location`, { lat, lng });
          setSaved(true);
        } catch (err) {
          console.error(err);
          alert("Failed to save location to server.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Please allow location access.");
        setLoading(false);
      }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setSaved(false);
  };

  const saveLocation = async () => {
    if (!location) return alert('No location to save');
    setLoading(true);
    try {
      await api.put(`/api/foodpartner/${id}/location`, {
        lat: location.lat,
        lng: location.lng,
      });
      setSaved(true);
      alert('Location saved!');
      navigate("/partner-profile");
      
    } catch (err) {
      console.error(err);
      alert('Failed to save location to server.');
    } finally {
      setLoading(false);
    }
  };

  const mapUrl = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.02}%2C${location.lat - 0.02}%2C${location.lng + 0.02}%2C${location.lat + 0.02}&layer=mapnik&marker=${location.lat}%2C${location.lng}`
    : null;

  return (
    <div className="location-setup">
      <div className="location-header">
        <div className="location-icon">📍</div>
        <div>
          <h3 className="location-title">Set Your Store Location</h3>
          <div className="location-sub">This location will be used to show your food to nearby users.</div>
        </div>
      </div>

      <div className="location-actions">
        <button className="btn primary" onClick={getLocation} disabled={loading}>
          {loading ? "Detecting..." : "Use Current Location"}
        </button>
        <button className="btn ghost" onClick={clearLocation}>
          Clear
        </button>
      </div>

      {mapUrl ? (
        <div className="map-preview">
          <iframe title="map" className="map-iframe" src={mapUrl} loading="lazy" />
        </div>
      ) : (
        <div className="map-preview" style={{ padding: 14, textAlign: 'center', color: 'var(--muted, #9aa4b2)' }}>
          No location selected yet.
        </div>
      )}

      <div className="location-footer">
        <div className="footer-coords">
          {location ? (
            <>Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</>
          ) : (
            <>No coordinates</>
          )}
        </div>
        <div>
          <button className="btn primary" onClick={saveLocation} disabled={loading || !location}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLocationSetup;
