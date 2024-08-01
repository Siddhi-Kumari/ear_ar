import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

const Model = ({ url, position }) => {
    const gltf = useLoader(GLTFLoader, url);
    return <primitive object={gltf.scene} position={position} />;
};

const EarModel = ({ position }) => {
    const modelPath = `${process.env.PUBLIC_URL}/ear.glb`; // Correct path for GLB model

    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Model url={modelPath} position={position} />
        </Canvas>
    );
};

export default EarModel;
