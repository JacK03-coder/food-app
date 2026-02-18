import React, { useState, useRef } from "react";
import "../styles/createfood.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const navigate = useNavigate();

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    handleSelectedFile(f);
  };

  const handleSelectedFile = (f) => {
    if (!f) {
      setVideoFile(null);
      setPreview("");
      return;
    }
    // revoke previous preview if it was an object URL
    if (videoFile && preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch (e) {}
    }
    setVideoFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setVideoFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // Drag & drop handlers
  const [dragOver, setDragOver] = useState(false);
  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleSelectedFile(f);
  };

  const triggerFileSelect = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const clearFile = () => {
    if (videoFile && preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch (e) {}
    }
    setVideoFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a name for the food");
    if (!videoFile) return alert("Please upload a video file");
    if (!price) return alert("Please enter a price");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("video", videoFile);

      const response = await fetch(`${API_BASE_URL}/api/food`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create food");
      }

      const data = await response.json();
      console.log("Food created:", data);
      resetForm();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create food");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-food-page">
      <h2 style={{ marginBottom: 12 }}>Create Food</h2>
      <div className="create-food-grid">
        <form className="create-food-form" onSubmit={submit}>
          <div className="form-row">
            <label>Food name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Butter Chicken"
            />
          </div>

          <div className="form-row">
            <label>Food description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
            />
          </div>

          <div className="form-row">
            <label>Food price</label>
            <input
            type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 10.99"
            />
          </div>

          <div className="form-row">
            <label>Upload video file</label>
            <div
              className={`file-drop ${dragOver ? "dragover" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={triggerFileSelect}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerFileSelect();
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
              <div className="file-drop-inner">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M12 3v10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 13l-7-7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21H3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div style={{ marginLeft: 10, textAlign: "left" }}>
                  <div style={{ fontWeight: 700 }}>
                    Drag & drop a video here
                  </div>
                  <div
                    style={{ fontSize: 13, color: "var(--text-color,#777)" }}
                  >
                    or click to choose a file (MP4, MOV). Max 100MB recommended
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {videoFile ? (
                <div className="file-info">
                  <div style={{ fontWeight: 700 }}>{videoFile.name}</div>
                  <div
                    style={{ fontSize: 12, color: "var(--text-color,#777)" }}
                  >
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div className="placeholder-text">No file selected</div>
              )}
              {videoFile && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={clearFile}
                  style={{ padding: "6px 10px" }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="btn-group">
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Food"}
            </button>
            <button type="button" className="btn ghost" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        <div className="preview-card">
          <div style={{ width: "100%" }}>
            {preview ? (
              // prefer video element for preview if it's a file or mp4 url
              <div style={{ width: "100%" }} className="play-overlay">
                <video
                  className="preview-video"
                  src={preview}
                  controls
                  muted
                  preload="metadata"
                />
              </div>
            ) : (
              <div
                className="preview-thumb"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}
                  >
                    Video preview
                  </div>
                  <div className="placeholder-text">
                    Upload a file to see a live preview.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: "100%", textAlign: "left" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Preview details
            </div>
            <div style={{ color: "var(--muted,#777)", fontSize: 14 }}>
              {name ? (
                <div>
                  <strong>Name:</strong> {name}
                </div>
              ) : (
                <div className="placeholder-text">Name will appear here</div>
              )}
              {description ? (
                <div style={{ marginTop: 6 }}>
                  <strong>Desc:</strong> {description}
                </div>
              ) : (
                <div className="placeholder-text" style={{ marginTop: 6 }}>
                  Description will appear here
                </div>
              )}
              {price ? (
                <div style={{ marginTop: 6 }}>
                  <strong>Price:</strong> ${price}
                </div>
              ) : (
                <div className="placeholder-text" style={{ marginTop: 6 }}>
                  Price will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFood;
