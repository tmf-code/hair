import { triangleGeometry } from './triangle-geometry';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
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
import { mouseToWorld, calculatePositions } from '../utilities/utilities';
import { hairColor, razorWidth, razorHeight, swirlRadius } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

import { Razor } from './Razor';
import { FIFO } from '../utilities/fifo';
import { EasingFunctions } from '../utilities/easing-functions';
import { Buckets } from '../utilities/buckets';
import { hairLengths } from '../drivers/HairLengths';
import { hairCuts } from '../drivers/HairCuts';
import { createFallingHair, makeHairFall } from './createFallingHair';

// State holders outside of react
const mouseLeft = new Vector2();
const mouseRight = new Vector2();
const razorBox = new Box2();
const transformHolder = new Object3D();
let lastLengths: HairLengths = [];
export let rotationOffsets: Rotations = [];
const maxFallingHair = 1500;

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

const readyToRender = (ref: React.MutableRefObject<InstancedMesh | undefined>, grid: Grid) => {
  const isMeshMade = !!ref.current;
  const hairsRetrievedFromServer = hairLengths.getLengths().length !== 0;
  const gridConstructed = grid.length !== 0;

  return isMeshMade && hairsRetrievedFromServer && gridConstructed;
};

const updateRazorBox = (mousePos: Vector3, aspect: number) => {
  mouseLeft.set(mousePos.x - razorWidth * aspect, mousePos.y - razorHeight);
  mouseRight.set(mousePos.x + razorWidth * aspect, mousePos.y + razorHeight);
  razorBox.set(mouseLeft, mouseRight);
};
const updateRazorPosition = (
  razorRef: React.MutableRefObject<Mesh | undefined>,
  mousePos: Vector3,
  aspect: number,
) => {
  if (razorRef.current) {
    razorRef.current.position.set(mousePos.x, mousePos.y - (2.1 / 2) * 0.9 * aspect, mousePos.z);
  }
};

const createRotationsOnFirstRender = (grid: Grid) => {
  if (rotationOffsets.length === 0) rotationOffsets = grid.map(() => 0);
};

const updateDisplay = (
  lengths: HairLengths,
  ref: React.MutableRefObject<InstancedMesh | undefined>,
  positions: number[][],
  rotations: number[],
) => {
  lengths.forEach((length, lengthIndex) => {
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
  lastLengths.map((_length, lengthIndex) => {
    const [xPos, yPos] = positions[lengthIndex];
    const hover = razorBox.containsPoint(new Vector2(xPos, yPos));
    return hover && Mouse.isClicked();
  });

const calculateSwirls = (positions: number[][], mousePos: Vector3) => {
  const swirlAffect = lastLengths.map((_length, lengthIndex) => {
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

export type TriangleTransform = {
  type: 'empty' | 'useful';
  xPos: number;
  yPos: number;
  rotation: number;
  length: number;
  hairIndex: number;
  timeStamp: number;
};

const emptyCutHair: TriangleTransform = {
  type: 'empty',
  xPos: 0,
  yPos: 0,
  rotation: 0,
  length: 0,
  hairIndex: -1,
  timeStamp: 0,
};

const cutHairFIFO = new FIFO<TriangleTransform>(maxFallingHair, emptyCutHair, 'hairIndex');

const Triangles = ({ grid, rotations }: TrianglesProps) => {
  const { viewport, mouse, camera, aspect } = useThree();
  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);

  const ref = useRef<InstancedMesh>();
  const razorRef = useRef<Mesh>();

  useFrame(() => {
    lastLengths = hairLengths.getLengths();

    if (!readyToRender(ref, grid)) return;
    createRotationsOnFirstRender(grid);
    ref!.current!.instanceMatrix.needsUpdate = true;

    const mousePos = mouseToWorld(mouse, camera);
    updateRazorBox(mousePos, aspect);
    updateRazorPosition(razorRef, mousePos, aspect);
    updateDisplay(lastLengths, ref, positions, rotations);

    const cutAffect = calculateCuts(positions);
    rotationOffsets = calculateSwirls(positions, mousePos);

    const fallingHair = createFallingHair(rotations, rotationOffsets);

    const cuts = fallingHair(positions, lastLengths, cutAffect);
    cuts.forEach((cut) => cutHairFIFO.addIfUnique(cut));

    makeHairFall(viewport, grid, ref, cutHairFIFO, maxFallingHair, transformHolder);

    hairCuts.addFromClient(cutAffect);
  });
  return (
    <>
      <Razor ref={razorRef} scale={aspect} opacity={1} />
      <instancedMesh
        ref={ref}
        args={[
          hairGeo,
          new MeshBasicMaterial({ color: new Color(hairColor) }),
          grid.length + maxFallingHair,
        ]}
      ></instancedMesh>
    </>
  );
};

export { Triangles };
