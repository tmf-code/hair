import { useMemo, useRef } from 'react';
import { TextureLoader, Mesh, Camera, Vector2 } from 'three';
import React from 'react';
import razorSVG from '../images/razor.svg';
import { useThree, useFrame } from 'react-three-fiber';

type FriendPlayerRazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) => void;
};

const FriendPlayerRazor = ({ updateFrame }: FriendPlayerRazorProps) => {
  const { camera, aspect, mouse } = useThree();
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);

  const ref = useRef<Mesh>();
  useFrame(() => updateFrame(ref, mouse, aspect, camera));

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
