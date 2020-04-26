import { triangleGeometry } from './Triangle';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useState, useMemo, useRef } from 'react';
import { socket } from '../drivers/Socket';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color } from 'three';
import { lerp, arrayEqual } from './utilities';
import { hairColor } from './constants';

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

const calculatePositions = function (
  grid: Grid,
  { width, height }: { width: number; height: number },
) {
  return grid.map(([xPos, yPos]) => [
    lerp(-width / 2.0, width / 2.0, xPos),
    lerp(height / 2.0, -height / 2.0, yPos),
  ]);
};

const transformHolder = new Object3D();

const Triangles = ({ grid, rotations }: TrianglesProps) => {
  const { viewport } = useThree();
  const [lengths, setLengths] = useState<HairLengths>([]);

  const [positions, maxLengthHairGeo] = useMemo(() => {
    const geo = triangleGeometry(viewport.width);
    const positions = calculatePositions(grid, viewport);
    return [positions, geo];
  }, [grid, viewport]);

  const ref = useRef<InstancedMesh>();

  useFrame(() => {
    if (arrayEqual(lengths, socket.lengths)) return;
    setLengths(socket.lengths);

    if (!ref.current) return;
    if (lengths.length === 0) return;
    if (grid.length === 0) return;

    socket.lengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const rotation = rotations[lengthIndex];

      transformHolder.position.set(xPos, yPos, 0);
      transformHolder.rotation.set(0, 0, rotation);
      transformHolder.scale.set(1, length, 1);
      transformHolder.updateMatrix();
      ref.current?.setMatrixAt(lengthIndex, transformHolder.matrix);
    });
  });

  return (
    <instancedMesh
      ref={ref}
      args={[maxLengthHairGeo, new MeshBasicMaterial({ color: new Color(hairColor) }), grid.length]}
    ></instancedMesh>
  );
};

export { Triangles };
