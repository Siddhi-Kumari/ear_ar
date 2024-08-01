import React, { useEffect, useState } from 'react';
import EarModel from './EarModel';

const EarModelLoader = ({ landmarks }) => {
    const [earPosition, setEarPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if (landmarks.left_ear) {
            setEarPosition([
                landmarks.left_ear[0], // X
                landmarks.left_ear[1], // Y
                0 // Z, adjust as necessary
            ]);
        }
    }, [landmarks]);

    if (!landmarks) {
        return null; // Don't render if no landmarks detected
    }

    return (
        <EarModel position={earPosition} />
    );
};

export default EarModelLoader;
