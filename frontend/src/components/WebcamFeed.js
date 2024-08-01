import React, { useEffect, useState } from 'react';
import ModelLoader from './ModelLoader';

const WebcamFeed = () => {
  const [landmarks, setLandmarks] = useState({});

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const response = await fetch('http://localhost:5000/ear_coordinates');
        const data = await response.json();
        if (data) {
          setLandmarks(data);
        }
      } catch (error) {
        console.error('Error fetching landmarks:', error);
      }
    };

    const interval = setInterval(() => {
      fetchLandmarks();
    }, 1000); // Fetch landmarks every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h2>Live Video Feed</h2>
      <img src="http://localhost:5000/video_feed" alt="Video Feed" style={{ width: '100%' }} />
      <ModelLoader landmarks={landmarks} />
    </div>
  );
};

export default WebcamFeed;
