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
            <Canvas style={{ height: '480px', width: '640px' }} camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {earCoordinates.left && (
                    <EarModel position={[earCoordinates.left[0] / 100, earCoordinates.left[1] / 100, 0]} />
                )}
                {earCoordinates.right && (
                    <EarModel position={[earCoordinates.right[0] / 100, earCoordinates.right[1] / 100, 0]} />
                )}
                <OrbitControls />
            </Canvas>
        </div>
    );
};

const EarModel = ({ position }) => {
    const gltfLoader = new GLTFLoader();
    const [model, setModel] = useState();

    useEffect(() => {
        gltfLoader.load('/ear.glb', (gltf) => {
            console.log('Model loaded:', gltf);
            setModel(gltf.scene);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    }, [gltfLoader]);

    return model ? <primitive object={model} position={position} scale={[0.1, 0.1, 0.1]} /> : null;
};

export default App;
