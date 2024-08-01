// frontend/src/utils/detectEarLandmarks.js
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';

export const detectEarLandmarks = async (videoElement) => {
    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
        maxFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    const camera = new cam.Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480,
    });
    camera.start();

    faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0].landmark;
            // Process landmarks to find ear coordinates (index 234, 454, 455, etc.)
            const earLandmarks = [
                landmarks[234], // Left ear
                landmarks[454], // Right ear
                // Add more ear landmarks if needed
            ];
            console.log('Ear Landmarks:', earLandmarks);
        }
    });
};
