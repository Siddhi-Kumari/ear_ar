import React, { useEffect, useState } from 'react';
import EarModel from './EarModel';

const EarModelLoader = ({ landmarks }) => {
    const [earPosition, setEarPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if (landmarks.left_ear) {
            // Adjust the position based on the webcam feed dimensions and model scaling
            setEarPosition([
                (landmarks.left_ear[0] - 320) * 0.005, // Adjust these based on your webcam resolution
                (240 - landmarks.left_ear[1]) * 0.005, // Flip Y-axis for correct positioning
                0 // Z position, adjust as necessary
            ]);
        }
    }, [landmarks]);

    if (!landmarks || Object.keys(landmarks).length === 0) {
        return null; // Don't render the model if no landmarks are detected
    }

    return <EarModel position={earPosition} />;
};

export default EarModelLoader;
