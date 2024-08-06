import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

const App = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);
    const [earCoordinates, setEarCoordinates] = useState({ left: null, right: null });

    useEffect(() => {
        const startVideo = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            const context = canvasRef.current.getContext('2d');

            const processFrame = async () => {
                context.drawImage(videoRef.current, 0, 0);
                const base64Image = canvasRef.current.toDataURL('image/jpeg');

                try {
                    const response = await fetch('http://localhost:5000/detect', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64Image }),
                    });

                    const data = await response.json();
                    setLandmarks(data.landmarks);

                    if (data.landmarks && data.landmarks.left_ear && data.landmarks.right_ear) {
                        setEarCoordinates({
                            left: data.landmarks.left_ear,
                            right: data.landmarks.right_ear,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

                requestAnimationFrame(processFrame);
            };

            requestAnimationFrame(processFrame);
        };

        startVideo();
    }, []);

    return (
        <div>
            <h1>Ear Landmark Detection</h1>
            <video ref={videoRef} autoPlay width="640" height="480" style={{ display: 'none' }} />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'block' }} />
            {landmarks && (
                <div>
                    <h2>Detected Landmarks:</h2>
                    <p>Left Ear: {JSON.stringify(landmarks.left_ear)}</p>
                    <p>Right Ear: {JSON.stringify(landmarks.right_ear)}</p>
                </div>
            )}
            <Canvas style={{ height: '480px', width: '640px', position: 'absolute', top: 0, left: 0 }} camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {earCoordinates.left && (
                    <EarModel position={calculatePosition(earCoordinates.left)} />
                )}
                {earCoordinates.right && (
                    <EarModel position={calculatePosition(earCoordinates.right)} />
                )}
                <OrbitControls />
            </Canvas>
        </div>
    );
};

const calculatePosition = (ear, isLeftEar) => {
    const canvasWidth = 640;  // Width of the canvas
    const canvasHeight = 480; // Height of the canvas

    // Define scale factors for positioning the model
    const scaleFactorX = 0.016; // Adjust this value based on how large/small the model appears
    const scaleFactorY = 0.016; // Adjust this value based on how large/small the model appears

    // Calculate normalized coordinates for Three.js
    const x = (ear[0] - canvasWidth / 2) * scaleFactorX + (isLeftEar ? -0.2 : 0.1);; // Shift the origin to the center and scale
    const y = (canvasHeight / 2 - ear[1]) * scaleFactorY-2; // Invert Y and scale

    // Set Z position for the model
    const z = 0; // You may adjust this based on the model's size

    return [x, y, z]; // Return the adjusted coordinates
};

const EarModel = ({ position }) => {
    const gltfLoader = new GLTFLoader();
    const [model, setModel] = useState();

    useEffect(() => {
        gltfLoader.load('/ear.glb', (gltf) => {
            console.log('Model loaded:', gltf); // Log to see if the model is loading
            setModel(gltf.scene);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    }, [gltfLoader]);

    return model ? <primitive object={model} position={position} scale={[1, 1, 1]} /> : null; // Adjust scale as needed
};

export default App;
