import { useRef } from 'react';
import { Mesh, Camera, Vector2, Texture } from 'three';
import React from 'react';
import { useThree, useFrame } from 'react-three-fiber';

type FriendPlayerRazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) => void;
  texture: Texture;
};

const FriendPlayerRazor = ({
  updateFrame,
  texture,
}: FriendPlayerRazorProps): React.ReactElement => {
  const { camera, aspect, mouse } = useThree();

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
