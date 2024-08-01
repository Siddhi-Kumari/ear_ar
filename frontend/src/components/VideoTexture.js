import React from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { VideoTexture } from 'three';

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.video = document.createElement('video');
        this.video.src = props.src;
        this.video.crossOrigin = 'anonymous';
        this.video.loop = true;
        this.video.muted = true;
        this.video.play();

        this.texture = new VideoTexture(this.video);
    }

    componentWillUnmount() {
        this.video.pause();
    }

    render() {
        return (
            <primitive object={this.texture} attach="map" />
        );
    }
}

extend({ Video }); // Register the Video class

export default Video;
