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
import { mouseToWorld, calculatePositions } from '../utilities/utilities';
import { hairColor, razorWidth, razorHeight, swirlRadius } from '../constants';
import { Mouse } from '../drivers/Mouse';

import { Razor } from './Razor';
import { FIFO } from '../utilities/fifo';
import { EasingFunctions } from '../utilities/easing-functions';
import { Buckets } from '../utilities/buckets';

// State holders outside of react
const mouseLeft = new Vector2();
const mouseRight = new Vector2();
const razorBox = new Box2();
const transformHolder = new Object3D();
let lastLengths: HairLengths = [];
let rotationOffsets: Rotations = [];
const maxFallingHair = 1500;

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

const readyToRender = (ref: React.MutableRefObject<InstancedMesh | undefined>, grid: Grid) => {
  const isMeshMade = !!ref.current;
  const hairsRetrievedFromServer = socket.getLengths().length !== 0;
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

type TriangleTransform = {
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
    lastLengths = socket.getLengths();

    if (!readyToRender(ref, grid)) return;
    createRotationsOnFirstRender(grid);
    ref!.current!.instanceMatrix.needsUpdate = true;

    const mousePos = mouseToWorld(mouse, camera);
    updateRazorBox(mousePos, aspect);
    updateRazorPosition(razorRef, mousePos, aspect);
    updateDisplay(lastLengths, ref, positions, rotations);

    const cutAffect = calculateCuts(positions);
    rotationOffsets = calculateSwirls(positions, mousePos);

    const fallingHair = createFallingHair(rotations);

    const cuts = fallingHair(positions, lastLengths, cutAffect);
    cuts.forEach((cut) => cutHairFIFO.addIfUnique(cut));

    const frameTime = Date.now();
    const animationDuration = 800;

    const heightBuckets = new Buckets(10, -viewport.width / 2.0, viewport.width / 2.0);

    cutHairFIFO.stack.forEach((transform, index) => {
      const { xPos, yPos, rotation, length, timeStamp, type } = transform;

      if (type === 'empty') return;
      const bucketHeight =
        (heightBuckets.add(xPos) * viewport.height) / maxFallingHair / heightBuckets.numBuckets;
      const animationProgression = Math.min((frameTime - timeStamp) / animationDuration, 1.0);

      const destination = -viewport.height / 2.0 + Math.abs(yPos / 8.0) + bucketHeight;
      const distance = (yPos - destination) * EasingFunctions.easeInQuad(animationProgression);

      transformHolder.position.set(xPos, yPos - distance, 0);
      transformHolder.rotation.set(0, 0, rotation);
      transformHolder.scale.set(1, length, 1);
      transformHolder.updateMatrix();
      ref.current?.setMatrixAt(grid.length + index, transformHolder.matrix);
    });

    socket.updateCuts(cutAffect);
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
function createFallingHair(rotations: Rotations) {
  return (positions: number[][], lengths: HairLengths, cutAffect: boolean[]) =>
    cutAffect
      .map((cut, index) => [cut, index] as [boolean, number])
      .filter(([isCut]) => isCut)
      .map(([, index]) => index)
      .map(
        (hairIndex): TriangleTransform => {
          const length = lengths[hairIndex];
          const [xPos, yPos] = positions[hairIndex];
          const rotation = rotations[hairIndex] + rotationOffsets[hairIndex];
          return {
            xPos,
            yPos,
            rotation,
            length,
            type: 'useful',
            hairIndex,
            timeStamp: Date.now(),
          };
        },
      );
}
