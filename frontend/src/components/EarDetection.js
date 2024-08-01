import React, { useEffect, useRef, useState } from 'react';
import EarModelLoader from './EarModelLoader';

const EarDetection = () => {
    const videoRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);
    
    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;

                const interval = setInterval(async () => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = 640; // Match webcam resolution
                    canvas.height = 480;

                    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg');

                    const response = await fetch('http://localhost:5000/detect', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: imageData })
                    });
                    const data = await response.json();
                    setLandmarks(data.landmarks);
                }, 100); // Detect every 100ms

                return () => clearInterval(interval);
            } catch (error) {
                console.error('Failed to access webcam:', error);
            }
        };

        startWebcam();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Ear Landmark Detection</h1>
            <video
                ref={videoRef}
                autoPlay
                style={{ width: '640px', height: 'auto', borderRadius: '10px' }}
            />
            {landmarks && <EarModelLoader landmarks={landmarks} />}
        </div>
    );
};

export default EarDetection;
