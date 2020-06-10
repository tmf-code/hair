import { triangleGeometry } from './triangle-geometry';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { InstancedMesh, MeshBasicMaterial, Color, Camera, Vector2 } from 'three';

import { hairColor } from '../utilities/constants';
import { Viewport } from '../types/viewport';

type HairsProps = {
  viewportChange: (viewport: Viewport) => void;
  updateFrame: (mesh: InstancedMesh, mouse: Vector2, camera: Camera) => void;
  instanceCount: number;
};

const material = new MeshBasicMaterial({ color: new Color(hairColor) });

const Hairs = ({ viewportChange, updateFrame, instanceCount }: HairsProps) => {
  const { viewport, mouse, camera } = useThree();
  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  useMemo(() => viewportChange(viewport), [viewport, viewportChange]);
  useFrame(() => {
    const maybeMesh = ref?.current;
    if (maybeMesh !== undefined) updateFrame(maybeMesh, mouse, camera);
  });

  const ref = useRef<InstancedMesh>();
  return <instancedMesh ref={ref} args={[hairGeo, material, instanceCount]}></instancedMesh>;
};

export { Hairs };
