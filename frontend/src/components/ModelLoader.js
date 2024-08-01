// frontend/src/components/ModelLoader.js
import React, { useEffect, useState } from 'react';
import EarModel from './EarModel';

const ModelLoader = ({ landmarks }) => {
    const [earPosition, setEarPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if (landmarks.left_ear) {
            setEarPosition([
                landmarks.left_ear.x * 5, // Adjust these values based on your landmark detection logic
                landmarks.left_ear.y * 5,
                landmarks.left_ear.z * 5,
            ]);
        }
    }, [landmarks]);

    if (!landmarks || Object.keys(landmarks).length === 0) {
        return null; // Don't render the model if no landmarks are detected
    }

    return (
        <EarModel position={earPosition} />
    );
};

export default ModelLoader;
