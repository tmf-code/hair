import { useState, useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Mesh, Vector3 } from 'three';
import React from 'react';
import { useSpring, a } from 'react-spring/three';
import razorSVG from '../svgs/razor.svg';
import { useThree, useFrame } from 'react-three-fiber';
import { mouseToWorld } from '../utilities/utilities';

type RazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector3,
    aspect: number,
  ) => void;
};

const Razor = ({ updateFrame }: RazorProps) => {
  const { mouse, camera, aspect } = useThree();
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);
  const [mouseUp, setMouseUp] = useState(true);
  useEffect(installUseEffects(setMouseUp), []);
  const ref = useRef<Mesh>();

  useFrame(() => {
    const mousePos = mouseToWorld(mouse, camera);
    updateFrame(ref, mousePos, aspect);
  });

  const { scaleFactor } = useSpring({ scaleFactor: mouseUp ? 1.1 : 1 });
  return (
    <a.mesh
      ref={ref}
      scale={scaleFactor.interpolate((amount: number) => [aspect * amount, aspect * amount, 1])}
    >
      <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
      <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </a.mesh>
  );
};

const installUseEffects = (
  setMouseUp: React.Dispatch<React.SetStateAction<boolean>>,
): React.EffectCallback => () => {
  document.addEventListener('mousedown', () => setMouseUp(false));
  document.addEventListener('touchstart', () => setMouseUp(false));
  document.addEventListener('mouseup', () => setMouseUp(true));
  document.addEventListener('touchend', () => setMouseUp(true));
};

export { Razor };
