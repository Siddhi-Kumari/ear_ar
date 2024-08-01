import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const EarModel = ({ position }) => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loader = new GLTFLoader();
        const modelPath = `${process.env.PUBLIC_URL}/ear.glb`;

        loader.load(
            modelPath,
            (gltf) => {
                console.log('Model loaded:', gltf);
                setModel(gltf.scene);
                setLoading(false);
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <p>Loading model...</p>;

    return <primitive object={model} position={position} scale={[0.01, 0.01, 0.01]} />;
};

const App = () => {
    return (
        <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <EarModel position={[0, 0, 0]} />
            <Grid />
            <OrbitControls />
        </Canvas>
    );
};

export default App;
