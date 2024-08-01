import React, { useEffect, useRef, useState } from 'react';
import WebcamFeed from './WebcamFeed';
import EarModelLoader from './EarModelLoader';

const MainComponent = () => {
    const videoRef = useRef(null);
    const [landmarks, setLandmarks] = useState({});

    useEffect(() => {
        const fetchEarCoordinates = async () => {
            const response = await fetch('http://localhost:5000/video_feed');
            const data = await response.json();
            setLandmarks(data.landmarks);
        };

        const intervalId = setInterval(fetchEarCoordinates, 100); // Fetch every 100 ms

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Ear Landmark Detection</h1>
            <WebcamFeed videoRef={videoRef} />
            <EarModelLoader landmarks={landmarks} />
        </div>
    );
};

export default MainComponent;
