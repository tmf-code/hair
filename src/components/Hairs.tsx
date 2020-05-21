import { triangleGeometry } from './triangle-geometry';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color, Vector2, Mesh } from 'three';
import { mouseToWorld, calculatePositions } from '../utilities/utilities';
import { hairColor, maxFallingHair } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

import { Razor, updateRazorBox, updateRazorPosition, razorBox } from './Razor';
import { hairLengths } from '../drivers/HairLengths';
import { hairCuts } from '../drivers/HairCuts';
import { FallingHair } from './FallingHair';
import { calculateSwirls } from './calculate-swirls';

// State holders outside of react

const transformHolder = new Object3D();
let lastLengths: HairLengths = [];
let rotationOffsets: Rotations = [];

type HairsProps = {
  grid: Grid;
  rotations: Rotations;
};

const readyToRender = (ref: React.MutableRefObject<InstancedMesh | undefined>, grid: Grid) => {
  const isMeshMade = !!ref.current;
  const hairsRetrievedFromServer = hairLengths.getLengths().length !== 0;
  const gridConstructed = grid.length !== 0;

  return isMeshMade && hairsRetrievedFromServer && gridConstructed;
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

const Hairs = ({ grid, rotations }: HairsProps) => {
  const { viewport, mouse, camera, aspect } = useThree();
  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);
  const ref = useRef<InstancedMesh>();

  const fallingHair = new FallingHair(positions, rotations, viewport, ref, grid, transformHolder);
  const razorRef = useRef<Mesh>();

  useFrame(() => {
    lastLengths = hairLengths.getLengths();

    if (!readyToRender(ref, grid)) return;
    createRotationsOnFirstRender(grid);

    if (ref?.current) {
      ref.current.instanceMatrix.needsUpdate = true;
    }

    const mousePos = mouseToWorld(mouse, camera);
    updateRazorBox(razorBox, mousePos, aspect);
    updateRazorPosition(razorRef, mousePos, aspect);
    updateDisplay(lastLengths, ref, positions, rotations);

    const cutAffect = calculateCuts(positions);
    rotationOffsets = calculateSwirls(positions, mousePos, lastLengths, rotationOffsets);

    fallingHair.update(lastLengths, cutAffect, rotationOffsets);

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

export { Hairs };
