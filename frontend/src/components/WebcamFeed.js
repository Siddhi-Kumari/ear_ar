// src/components/WebcamFeed.js
import React, { useEffect, useRef } from 'react';

const WebcamFeed = ({ setLandmarks }) => {
    const videoRef = useRef();

    useEffect(() => {
        const startVideo = async () => {
            const constraints = { video: true };

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return <video ref={videoRef} autoPlay style={{ display: 'none' }} />;
};

export default WebcamFeed;
