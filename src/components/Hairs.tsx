import { triangleGeometry } from './triangle-geometry';
import { Grid, Rotations, HairLengths, Position2D } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color } from 'three';
import { mouseToWorld, calculatePositions } from '../utilities/utilities';
import { hairColor, maxFallingHair } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

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
  razorContainsPoint: (arg0: Position2D) => boolean;
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

const calculateCuts = (razorContainsPoint: (arg0: Position2D) => boolean, positions: Grid) =>
  lastLengths.map((_length, lengthIndex) => {
    const hover = razorContainsPoint(positions[lengthIndex]);
    return hover && Mouse.isClicked();
  });

const Hairs = ({ grid, rotations, razorContainsPoint }: HairsProps) => {
  const { viewport, mouse, camera } = useThree();
  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);
  const ref = useRef<InstancedMesh>();

  const fallingHair = new FallingHair(positions, rotations, viewport, ref, grid, transformHolder);

  useFrame(() => {
    lastLengths = hairLengths.getLengths();

    if (!readyToRender(ref, grid)) return;
    createRotationsOnFirstRender(grid);

    if (ref?.current) {
      ref.current.instanceMatrix.needsUpdate = true;
    }

    updateDisplay(lastLengths, ref, positions, rotations);

    const cutAffect = calculateCuts(razorContainsPoint, positions);
    const mousePos = mouseToWorld(mouse, camera);
    rotationOffsets = calculateSwirls(positions, mousePos, lastLengths, rotationOffsets);

    fallingHair.update(lastLengths, cutAffect, rotationOffsets);

    hairCuts.addFromClient(cutAffect);
  });
  return (
    <>
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
