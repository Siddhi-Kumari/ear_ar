import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = ({ url, position }) => {
    const gltf = useLoader(GLTFLoader, url);
    return <primitive object={gltf.scene} position={position} />;
};

export default Model;
