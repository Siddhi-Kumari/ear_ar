import React from 'react';
import { Canvas } from '@react-three/fiber';
import ModelLoader from './ModelLoader';

const EarModel = ({ landmarks }) => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ModelLoader landmarks={landmarks} />
    </Canvas>
  );
};

export default EarModel;
