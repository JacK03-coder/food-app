import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/video.css";
import { api } from "../lib/api";

const VideoCard = ({ food, isVisible, dataIndex }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch((error) => console.log("Video play error:", error));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="video-card" data-index={dataIndex}>
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        className="video-player"
        src={food.video}
        loop
        muted
        playsInline
      />
      <div className="video-overlay">
        <div className="content-wrapper">
          <div className="video-header">
            <div className="food-meta">
              <p className="food-name">{food.name}</p>
              {typeof food.price !== 'undefined' && (
                <span className="food-price">₹{Number(food.price).toFixed(2)}</span>
              )}
            </div>
            <button
              className="order-button"
              onClick={() => navigate(`/order/food/${food._id}`)}
            >
              Order Now
            </button>
          </div>
          <p className={`description ${showFullDescription ? "expanded" : ""}`}>
            {food.description}
            {food.description.length > 100 && (
              <button
                className="show-more"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </p>
          <button
            className="partner-button"
            onClick={() => navigate(`/food-partner/${food.foodPartner}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const observerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index);
        setActiveVideoIndex(index);
      }
    });
  }, []);

  useEffect(() => {
    api
      .get("/api/food")
      .then((res) => setVideos(res.data.foodItems))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.6,
    });

    const videoCards = document.querySelectorAll(".video-card");
    videoCards.forEach((card) => observerRef.current.observe(card));

    return () => observerRef.current && observerRef.current.disconnect();
  }, [videos, handleIntersection]);

  return (
    <div className="video-feed">
      <div className="video-container" ref={videoContainerRef}>
        {videos.map((food, index) => (
          <VideoCard
            key={food._id}
            food={food}
            isVisible={index === activeVideoIndex}
            dataIndex={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
