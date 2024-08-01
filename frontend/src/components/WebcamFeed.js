import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import cv2 from 'opencv.js'; // Ensure opencv.js is available in your project
import * as mp from '@mediapipe/face_mesh'; // Mediapipe for ear detection

const Model = React.forwardRef(({ url }, ref) => {
    const gltf = useLoader(GLTFLoader, url);
    return <primitive ref={ref} object={gltf.scene} />;
});

class FaceMeshModel {
    constructor() {
        this.faceMesh = new mp.FaceMesh({ maxNumFaces: 1 });
    }

    getLandmarks(image) {
        const results = this.faceMesh.process(image);
        if (results.multiFaceLandmarks) {
            const landmarks = results.multiFaceLandmarks[0].landmark;
            return {
                leftEar: landmarks[234],
                rightEar: landmarks[454],
            };
        }
        return {};
    }

    getEarCoordinates(image) {
        const landmarks = this.getLandmarks(image);
        if (landmarks) {
            const height = image.rows;
            const width = image.cols;
            return {
                leftEar: { x: Math.floor(landmarks.leftEar.x * width), y: Math.floor(landmarks.leftEar.y * height) },
                rightEar: { x: Math.floor(landmarks.rightEar.x * width), y: Math.floor(landmarks.rightEar.y * height) },
            };
        }
        return {};
    }
}

const WebcamFeed = () => {
    const videoRef = useRef(null);
    const modelRef = useRef(null);
    const [earModel, setEarModel] = useState(null);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        const faceMeshModel = new FaceMeshModel();
        setEarModel(faceMeshModel);

        startWebcam();
    }, []);

    useEffect(() => {
        const detectEars = () => {
            if (videoRef.current && earModel) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const image = cv2.imread(canvas); // Assuming cv2 is set up correctly
                const earCoordinates = earModel.getEarCoordinates(image);

                if (modelRef.current) {
                    const leftEarPosition = earCoordinates.leftEar;
                    const rightEarPosition = earCoordinates.rightEar;

                    if (leftEarPosition) {
                        modelRef.current.position.set(leftEarPosition.x / 100 - 8, -leftEarPosition.y / 100 + 4, 0); // Adjusting position as needed
                    }
                }
            }

            requestAnimationFrame(detectEars);
        };

        requestAnimationFrame(detectEars);
    }, [earModel]);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} />
            <Canvas>
                <ambientLight />
                <Model url={`${process.env.PUBLIC_URL}/ear.glb`} ref={modelRef} />
                <mesh>
                    <planeGeometry args={[16, 9]} />
                    <meshBasicMaterial>
                        <videoTexture attach="map" args={[videoRef.current]} />
                    </meshBasicMaterial>
                </mesh>
            </Canvas>
        </div>
    );
};

export default WebcamFeed;
