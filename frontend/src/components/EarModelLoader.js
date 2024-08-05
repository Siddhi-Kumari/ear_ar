// src/components/EarModelLoader.js
import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const EarModelLoader = ({ landmarks }) => {
    const sceneRef = useRef(null);
    const modelRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Initialize the WebGL Renderer only once
        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(640, 480);
            sceneRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        const renderer = rendererRef.current;

        const loader = new GLTFLoader();
        loader.load('/ear.glb', (gltf) => {
            modelRef.current = gltf.scene;
            modelRef.current.scale.set(0.5, 0.5, 0.5); // Adjust model size
            scene.add(modelRef.current);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });

        const updateModelPosition = () => {
            if (modelRef.current && landmarks) {
                const leftEarPosition = landmarks.leftEar; // [x, y]
                if (leftEarPosition) {
                    modelRef.current.position.set(
                        (leftEarPosition[0] - 320) / 100, // Adjust X
                        -(leftEarPosition[1] - 240) / 100, // Adjust Y
                        0
                    );
                }
            }
        };

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            updateModelPosition();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            sceneRef.current.removeChild(renderer.domElement);
        };
    }, [landmarks]);

    return <div ref={sceneRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
};

export default EarModelLoader;
