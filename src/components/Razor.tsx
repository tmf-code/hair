import { forwardRef, useState } from 'react';
import { TextureLoader } from 'three';
import React from 'react';
import { useSpring, a } from 'react-spring/three';
import razorSVG from './svgs/razor.svg';

/** This component loads an image and projects it onto a plane */
const Razor = forwardRef(
  (
    {
      scale,
    }: {
      ref: any;
      opacity: number;
      scale: typeof a.mesh['scale'];
      props?: any;
    },
    ref,
  ) => {
    const texture = new TextureLoader().load(razorSVG);
    const [mouseUp, setMouseUp] = useState(true);

    window.addEventListener('mousedown', () => {
      setMouseUp(false);
    });
    window.addEventListener('touchstart', () => {
      setMouseUp(false);
    });
    window.addEventListener('mouseup', () => {
      setMouseUp(true);
    });
    window.addEventListener('touchend', () => {
      setMouseUp(true);
    });

    const { factor } = useSpring({ factor: mouseUp ? 1.1 : 1 });

    return (
      <a.mesh ref={ref} scale={factor.interpolate((f: number) => [scale * f, scale * f, 1])}>
        <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
        <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
      </a.mesh>
    );
  },
);

export { Razor };
