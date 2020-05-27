import { useState, useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Mesh, Vector2, Camera } from 'three';
import React from 'react';
import razorSVG from '../svgs/razor.svg';
import { useThree, useFrame } from 'react-three-fiber';

type CurrentPlayerRazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) => void;
};

const CurrentPlayerRazor = ({ updateFrame }: CurrentPlayerRazorProps) => {
  const { mouse, camera, aspect } = useThree();
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);
  const [mouseUp, setMouseUp] = useState(true);

  useEffect(installUseEffects(setMouseUp), []);
  const ref = useRef<Mesh>();
  useFrame(() => updateFrame(ref, mouse, aspect, camera));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
      <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};

const installUseEffects = (
  setMouseUp: React.Dispatch<React.SetStateAction<boolean>>,
): React.EffectCallback => () => {
  const down = () => setMouseUp(false);
  const up = () => setMouseUp(true);

  document.addEventListener('mousedown', down);
  document.addEventListener('touchstart', down);
  document.addEventListener('mouseup', () => setMouseUp(true));
  document.addEventListener('touchend', () => setMouseUp(true));

  return () => {
    document.removeEventListener('mousedown', down);
    document.removeEventListener('touchstart', down);
    document.removeEventListener('mouseup', up);
    document.removeEventListener('touchend', up);
  };
};

export { CurrentPlayerRazor };
