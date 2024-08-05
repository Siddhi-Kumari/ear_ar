import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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

export default EarModel;
