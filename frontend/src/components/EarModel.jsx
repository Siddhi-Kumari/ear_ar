// frontend/src/components/EarModel.jsx
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const EarModel = ({ position }) => {
  const gltf = useLoader(GLTFLoader, '/ear.glb'); // Adjust the URL as needed
  return <primitive object={gltf.scene} position={position} />;
};

export default EarModel; // Make sure this is correctly exporting
