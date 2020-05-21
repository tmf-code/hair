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
type HairsProps = {
  grid: Grid;
  rotations: Rotations;
  razorContainsPoint: (arg0: Position2D) => boolean;
};
class Hairs {
  private readonly transformHolder = new Object3D();
  private lastLengths: HairLengths = [];
  private rotationOffsets: Rotations = [];

  readyToRender = (ref: React.MutableRefObject<InstancedMesh | undefined>, grid: Grid) => {
    const isMeshMade = !!ref.current;
    const hairsRetrievedFromServer = hairLengths.getLengths().length !== 0;
    const gridConstructed = grid.length !== 0;

    return isMeshMade && hairsRetrievedFromServer && gridConstructed;
  };

  createRotationsOnFirstRender = (grid: Grid) => {
    if (this.rotationOffsets.length === 0) this.rotationOffsets = grid.map(() => 0);
  };

  updateDisplay = (
    lengths: HairLengths,
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    positions: number[][],
    rotations: number[],
  ) => {
    lengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const rotation = rotations[lengthIndex] + this.rotationOffsets[lengthIndex];

      this.transformHolder.position.set(xPos, yPos, 0);
      this.transformHolder.rotation.set(0, 0, rotation);
      this.transformHolder.scale.set(1, length, 1);
      this.transformHolder.updateMatrix();
      ref.current?.setMatrixAt(lengthIndex, this.transformHolder.matrix);
    });
  };

  calculateCuts = (razorContainsPoint: (arg0: Position2D) => boolean, positions: Grid) =>
    this.lastLengths.map((_length, lengthIndex) => {
      const hover = razorContainsPoint(positions[lengthIndex]);
      return hover && Mouse.isClicked();
    });

  screenElement = ({ grid, rotations, razorContainsPoint }: HairsProps) => {
    const { viewport, mouse, camera } = useThree();
    const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
    const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);
    const ref = useRef<InstancedMesh>();

    const fallingHair = new FallingHair(
      positions,
      rotations,
      viewport,
      ref,
      grid,
      this.transformHolder,
    );

    useFrame(() => {
      this.lastLengths = hairLengths.getLengths();

      if (!this.readyToRender(ref, grid)) return;
      this.createRotationsOnFirstRender(grid);

      if (ref?.current) {
        ref.current.instanceMatrix.needsUpdate = true;
      }

      this.updateDisplay(this.lastLengths, ref, positions, rotations);

      const cutAffect = this.calculateCuts(razorContainsPoint, positions);
      const mousePos = mouseToWorld(mouse, camera);
      this.rotationOffsets = calculateSwirls(
        positions,
        mousePos,
        this.lastLengths,
        this.rotationOffsets,
      );

      fallingHair.update(this.lastLengths, cutAffect, this.rotationOffsets);

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
}

export { Hairs };
