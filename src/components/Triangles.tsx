import { triangleGeometry } from './Triangle';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { socket } from '../drivers/Socket';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color, Vector2, Box2 } from 'three';
import { lerp, arrayEqual, mouseToWorld } from './utilities';
import { hairColor, razorWidth, razorHeight } from './constants';
import { Mouse } from '../drivers/Mouse';

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

type ViewportDimensions = {
  width: number;
  height: number;
};

const calculatePositions = function (grid: Grid, viewport: ViewportDimensions) {
  return grid.map(([xPos, yPos]) => relativeToWorld(new Vector2(xPos, yPos), viewport));
};

const relativeToWorld = function (
  { x, y }: Vector2,
  { width, height }: { width: number; height: number },
) {
  return [lerp(-width / 2.0, width / 2.0, x), lerp(height / 2.0, -height / 2.0, y)];
};

const mouseLeft = new Vector2();
const mouseRight = new Vector2();
const razorBox = new Box2();
const transformHolder = new Object3D();

let lastLengths: HairLengths = [];

const Triangles = ({ grid, rotations }: TrianglesProps) => {
  const { viewport, mouse, camera } = useThree();

  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);

  const ref = useRef<InstancedMesh>();
  useFrame(() => {
    if (arrayEqual(lastLengths, socket.lengths) && !Mouse.isClicked()) return;
    lastLengths = socket.lengths;

    if (!ref.current) return;
    if (socket.lengths.length === 0) return;
    if (grid.length === 0) return;

    ref.current.instanceMatrix.needsUpdate = true;

    const mousePos = mouseToWorld(mouse, camera);
    mouseLeft.set(mousePos.x - razorWidth, mousePos.y - razorHeight);
    mouseRight.set(mousePos.x + razorWidth, mousePos.y + razorHeight);
    razorBox.set(mouseLeft, mouseRight);

    // Update display
    lastLengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const rotation = rotations[lengthIndex];

      transformHolder.position.set(xPos, yPos, 0);
      transformHolder.rotation.set(0, 0, rotation);
      transformHolder.scale.set(1, length, 1);
      transformHolder.updateMatrix();
      ref.current?.setMatrixAt(lengthIndex, transformHolder.matrix);
    });

    const updatedCuts = lastLengths.map((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const shouldChop = razorBox.containsPoint(new Vector2(xPos, yPos)) && Mouse.isClicked();
      return shouldChop;
    });

    socket.updateCuts(updatedCuts);
  });

  return (
    <instancedMesh
      ref={ref}
      args={[hairGeo, new MeshBasicMaterial({ color: new Color(hairColor) }), grid.length]}
    ></instancedMesh>
  );
};

export { Triangles };
