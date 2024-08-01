import React, { useRef, useEffect } from 'react';

const VideoCapture = ({ onVideoReady }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                if (onVideoReady) onVideoReady(videoRef.current); // Callback when video is ready
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, [onVideoReady]);

    return (
        <video ref={videoRef} style={{ display: 'none' }} />
    );
};

export default VideoCapture;
