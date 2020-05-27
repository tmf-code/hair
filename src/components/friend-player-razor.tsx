import { useMemo, useRef } from 'react';
import { TextureLoader, Mesh, Camera } from 'three';
import React from 'react';
import razorSVG from '../svgs/razor.svg';
import { useThree, useFrame } from 'react-three-fiber';

type FriendPlayerRazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    camera: Camera,
    aspect: number,
  ) => void;
};

const FriendPlayerRazor = ({ updateFrame }: FriendPlayerRazorProps) => {
  const { camera, aspect } = useThree();
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);

  const ref = useRef<Mesh>();
  useFrame(() => updateFrame(ref, camera, aspect));

  return (
    <mesh ref={ref} scale={[1, 1, 1]}>
      <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
      <meshBasicMaterial attach="material" transparent opacity={1}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};

export { FriendPlayerRazor };
