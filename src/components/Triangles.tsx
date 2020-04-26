import { triangleGeometry } from './Triangle';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { socket } from '../drivers/Socket';
import {
  Object3D,
  InstancedMesh,
  MeshBasicMaterial,
  Color,
  Vector2,
  Box2,
  Vector3,
  Mesh,
} from 'three';
import { mouseToWorld, calculatePositions } from './utilities';
import { hairColor, razorWidth, razorHeight, swirlRadius } from './constants';
import { Mouse } from '../drivers/Mouse';

import { Razor } from './Razor';

// State holders outside of react
const mouseLeft = new Vector2();
const mouseRight = new Vector2();
const razorBox = new Box2();
const transformHolder = new Object3D();
let lastLengths: HairLengths = [];
let rotationOffsets: Rotations = [];

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

const readyToRender = (ref: React.MutableRefObject<InstancedMesh | undefined>, grid: Grid) => {
  const isMeshMade = !!ref.current;
  const hairsRetrievedFromServer = socket.lengths.length !== 0;
  const gridConstructed = grid.length !== 0;

  const readyToRender = isMeshMade && hairsRetrievedFromServer && gridConstructed;

  return readyToRender;
};

const updateRazorBox = (mousePos: Vector3) => {
  mouseLeft.set(mousePos.x - razorWidth, mousePos.y - razorHeight);
  mouseRight.set(mousePos.x + razorWidth, mousePos.y + razorHeight);
  razorBox.set(mouseLeft, mouseRight);
};
const updateRazorPosition = (
  razorRef: React.MutableRefObject<Mesh | undefined>,
  mousePos: Vector3,
) => {
  if (razorRef.current) {
    razorRef.current.position.set(mousePos.x, mousePos.y - (2.1 / 2) * 0.9, mousePos.z);
  }
};

const createRotationsOnFirstRender = (grid: Grid) => {
  if (rotationOffsets.length === 0) rotationOffsets = grid.map(() => 0);
};

const updateDisplay = (
  ref: React.MutableRefObject<InstancedMesh | undefined>,
  positions: number[][],
  rotations: number[],
) => {
  lastLengths.forEach((length, lengthIndex) => {
    const [xPos, yPos] = positions[lengthIndex];
    const rotation = rotations[lengthIndex] + rotationOffsets[lengthIndex];

    transformHolder.position.set(xPos, yPos, 0);
    transformHolder.rotation.set(0, 0, rotation);
    transformHolder.scale.set(1, length, 1);
    transformHolder.updateMatrix();
    ref.current?.setMatrixAt(lengthIndex, transformHolder.matrix);
  });
};

const calculateCuts = (positions: number[][]) =>
  lastLengths.map((length, lengthIndex) => {
    const [xPos, yPos] = positions[lengthIndex];
    const hover = razorBox.containsPoint(new Vector2(xPos, yPos));
    return hover && Mouse.isClicked();
  });

const calculateSwirls = (positions: number[][], mousePos: Vector3) => {
  const swirlAffect = lastLengths.map((length, lengthIndex) => {
    const directionVector = Mouse.VelocityVector().normalize();
    const [xPos, yPos] = positions[lengthIndex];
    const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
    const hover = distance < swirlRadius;
    const shouldSwirl = hover && !Mouse.isClicked() && Mouse.VelocityVector().length() > 0.001;
    return shouldSwirl
      ? directionVector.multiplyScalar(1 - distance / swirlRadius)
      : new Vector2(0, 0);
  });

  return swirlAffect.map((swirlAmount, hairIndex) => {
    const rotationDifference =
      Math.atan2(swirlAmount.y, swirlAmount.x) - rotationOffsets[hairIndex];
    const newRotation =
      rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
    return newRotation;
  });
};

const Triangles = ({ grid, rotations }: TrianglesProps) => {
  const { viewport, mouse, camera } = useThree();

  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);

  const ref = useRef<InstancedMesh>();
  const razorRef = useRef<Mesh>();

  useFrame(() => {
    lastLengths = socket.lengths;

    if (!readyToRender(ref, grid)) return;
    createRotationsOnFirstRender(grid);
    ref!.current!.instanceMatrix.needsUpdate = true;

    const mousePos = mouseToWorld(mouse, camera);
    updateRazorBox(mousePos);
    updateRazorPosition(razorRef, mousePos);
    updateDisplay(ref, positions, rotations);

    const cutAffect = calculateCuts(positions);
    rotationOffsets = calculateSwirls(positions, mousePos);

    socket.updateCuts(cutAffect);
  });

  return (
    <>
      <Razor ref={razorRef} scale={1} opacity={1} />
      <instancedMesh
        ref={ref}
        args={[hairGeo, new MeshBasicMaterial({ color: new Color(hairColor) }), grid.length]}
      ></instancedMesh>
    </>
  );
};

export { Triangles };
