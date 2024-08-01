import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { VideoTexture } from 'three'; // Ensure you're importing VideoTexture

const Video = ({ videoSrc }) => {
    const videoRef = useRef();

    useEffect(() => {
        // Create a video element
        const video = document.createElement('video');
        video.src = videoSrc; // Assign the source
        video.crossOrigin = 'anonymous'; // Allow CORS if required
        video.loop = true; // Set to loop if desired
        video.muted = true; // Ensure the video is muted if needed
        video.play(); // Start playing the video

        videoRef.current = video;

        return () => {
            video.pause(); // Clean up the video when the component unmounts
        };
    }, [videoSrc]);

    useFrame(() => {
        if (videoRef.current) {
            // Ensure the video texture is updated
            if (videoRef.current.readyState >= 2) {
                // Create a texture only when the video is ready
                const texture = new VideoTexture(videoRef.current);
                texture.needsUpdate = true; // Mark texture for update
            }
        }
    });

    return (
        <mesh>
            <planeBufferGeometry args={[16, 9]} />
            <meshBasicMaterial attach="material" map={videoRef.current ? new VideoTexture(videoRef.current) : null} />
        </mesh>
    );
};

export default Video;
