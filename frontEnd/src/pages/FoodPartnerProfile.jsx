import React, { useEffect, useState } from 'react';
import '../styles/partner.css';
import { useParams } from 'react-router-dom';
import { api } from "../lib/api";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const[profile , setProfile] = useState(null);
  const[videos , setVideos]  = useState([]);
  const [modalVideo, setModalVideo] = useState(null);
  const [modalPoster, setModalPoster] = useState('');
  const [videoThumbnails, setVideoThumbnails] = useState({}); // { [id]: dataURL }

  const openVideo = (meal) => setModalVideo(meal);
  const closeVideo =  () => setModalVideo(null);


  useEffect(()=>{
    api.get(`/api/foodpartner/${id}`)
    .then((response)=>{
      setProfile(response.data.foodPartner);
      setVideos(response.data.foodPartner.foodItems);
    })  
    .catch((error)=>{
      console.error("Error fetching partner data:", error);
    });
  },[id])
  
  // Helper: best-effort thumbnail extraction from a video URL. Returns a dataURL or null.
  const generateThumbnailFromVideo = (url) => {
    if (!url) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        const vid = document.createElement('video');
        vid.crossOrigin = 'anonymous';
        vid.preload = 'metadata';
        vid.muted = true;
        vid.src = url;

        const cleanup = () => {
          try { vid.pause(); } catch (e) {}
          try { vid.removeAttribute('src'); } catch (e) {}
          try { vid.load && vid.load(); } catch (e) {}
        };

        const onError = () => {
          cleanup();
          resolve(null);
        };

        vid.addEventListener('error', onError, { once: true });

        vid.addEventListener('loadeddata', () => {
          try {
            const seekTo = Math.min(0.5, (vid.duration || 0) / 2);
            const onSeeked = () => {
              try {
                const canvas = document.createElement('canvas');
                const w = vid.videoWidth || 320;
                const h = vid.videoHeight || Math.round(w * 9 / 16);
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/jpeg');
                cleanup();
                resolve(dataURL);
              } catch (err) {
                cleanup();
                resolve(null);
              }
            };

            vid.currentTime = seekTo;
            vid.addEventListener('seeked', onSeeked, { once: true });

            // Fallback timeout in case seeked doesn't fire
            setTimeout(() => resolve(null), 2000);
          } catch (err) {
            cleanup();
            resolve(null);
          }
        }, { once: true });
      } catch (err) {
        resolve(null);
      }
    });
  };

  // When videos list changes, try to generate thumbnails for items without explicit images/posters.
  useEffect(() => {
    let cancelled = false;
    const pending = [];

    const process = async () => {
      const map = {};
      for (const meal of videos) {
        const idKey = meal._id || meal.id || meal._id;
        const hasPoster = meal.image || meal.poster || meal.thumbnail;
        if (hasPoster) continue; // already covered by server-provided image
        if (videoThumbnails[idKey]) continue; // already generated

        const src = meal.video || meal.videoUrl || meal.url;
        if (!src) continue;

        // generate (sequential to avoid many concurrents)
        // push promise into pending to keep track
        // but await each to limit concurrency
        // best-effort; if fails we'll leave it out
        // eslint-disable-next-line no-await-in-loop
        const thumb = await generateThumbnailFromVideo(src);
        if (cancelled) return;
        if (thumb) map[idKey] = thumb;
      }

      if (!cancelled && Object.keys(map).length) {
        setVideoThumbnails((prev) => ({ ...prev, ...map }));
      }
    };

    process();

    return () => { cancelled = true; };
    // intentionally not adding videoThumbnails to deps to avoid loops
  }, [videos]);

  // When modal opens, pick a poster: explicit image/poster/thumbnail map or try to generate one for this item.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!modalVideo) { setModalPoster(''); return; }
      const explicit = modalVideo.image || modalVideo.poster || modalVideo.thumbnail || '';
      if (explicit) { setModalPoster(explicit); return; }

      const idKey = modalVideo._id || modalVideo.id || modalVideo._id;
      if (videoThumbnails[idKey]) { setModalPoster(videoThumbnails[idKey]); return; }

      const src = modalVideo.video || modalVideo.videoUrl || modalVideo.url;
      if (!src) { setModalPoster(''); return; }

      const thumb = await generateThumbnailFromVideo(src);
      if (!cancelled) setModalPoster(thumb || '');
    })();

    return () => { cancelled = true; };
  }, [modalVideo, videoThumbnails]);

  return (
  <div className="partner-page dark">
      <div className="partner-header">
        <div className="partner-top">
          <img src={profile?.profilePhoto} alt={profile?.name} className="partner-photo" />
          <div className="partner-meta">
            <h2 className="partner-name">{profile?.name}</h2>
            <p className="partner-address">{profile?.address}</p>
          </div>
        </div>

        <div className="partner-stats">
          <div className="stat">
            <div className="stat-number">{profile?.totalMeals}</div>
            <div className="stat-label">Total meals</div>
          </div>
          <div className="stat">
            <div className="stat-number">{profile?.customerServed}</div>
            <div className="stat-label">Customers served</div>
          </div>
        </div> 
      </div>

      <div className="meals-grid">
        {videos.map((meal) => {
          const idKey = meal._id || meal.id || meal._id;
          const poster = meal.image || meal.poster || videoThumbnails[idKey] || '';
          return (
            <div
              key={idKey}
              className="meal-card"
              onClick={() => openVideo(meal)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') openVideo(meal); }}
            >
              {poster ? (
                <div className="meal-thumb" style={{ backgroundImage: `url(${poster})` }} />
              ) : (
                <div className="meal-thumb placeholder">
                  <div className="play-icon">▶</div>
                </div>
              )}
              <div className="meal-title">{meal.name}</div>
            </div>
          );
        })}
      </div>

      {modalVideo && (
        <div className="video-modal" onClick={closeVideo} role="dialog" aria-modal="true">
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVideo} aria-label="Close">✕</button>
            <video
              className="modal-video"
              src={modalVideo.video || modalVideo.videoUrl || modalVideo.url}
              poster={modalPoster}
              controls
              autoPlay
              playsInline
            />
            <div className="modal-info">
              <h3 className="modal-title">{modalVideo.name}</h3>
              {modalVideo.description && <p className="modal-desc">{modalVideo.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPartnerProfile;
