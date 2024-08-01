import React, { useEffect, useState } from 'react';
import EarModel from './EarModel';

const EarModelLoader = ({ landmarks }) => {
    const [earPosition, setEarPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if (landmarks.left_ear) {
            setEarPosition([
                landmarks.left_ear.x * 0.005, // Adjust these values based on your landmark detection logic
                landmarks.left_ear.y * 0.005,
                0, // Z position can be set based on your model's scale
            ]);
        }
    }, [landmarks]);

    if (!landmarks || Object.keys(landmarks).length === 0) {
        return null; // Don't render the model if no landmarks are detected
    }

    return <EarModel position={earPosition} />;
};

export default EarModelLoader;
