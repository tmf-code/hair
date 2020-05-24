import { triangleGeometry } from './triangle-geometry';
import { Grid, Rotations, HairLengths, Position2D } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color, Camera, Vector2 } from 'three';
import { mouseToWorld, calculatePositions } from '../utilities/utilities';
import { hairColor, maxFallingHair } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

import { hairLengths } from '../drivers/HairLengths';
import { HairCuts } from '../drivers/HairCuts';
import { FallingHair } from './FallingHair';
import { calculateSwirls } from './calculate-swirls';

// State holders outside of react
type HairsProps = {
  grid: Grid;
  rotations: Rotations;
  razorContainsPoint: (arg0: Position2D) => boolean;
  hairCuts: HairCuts;
};
class Hairs {
  private readonly transformHolder = new Object3D();
  private lastLengths: HairLengths = [];
  private rotationOffsets: Rotations = [];
  private positions: Grid = [];
  private rotations: Rotations = [];
  private grid: Grid = [];
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private material: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(hairColor) });
  private fallingHair: FallingHair | undefined;
  private hairCuts: HairCuts | undefined;

  private readyToRender = () => {
    const isMeshMade = !!this.ref?.current;
    const hairsRetrievedFromServer = hairLengths.getLengths().length !== 0;
    const gridConstructed = this.grid.length !== 0;

    return isMeshMade && hairsRetrievedFromServer && gridConstructed;
  };

  private createRotationsOnFirstRender = () => {
    if (this.rotationOffsets.length === 0) this.rotationOffsets = this.grid.map(() => 0);
  };

  private updateStaticHairs = () => {
    if (!this.ref?.current) return;

    this.ref.current.instanceMatrix.needsUpdate = true;

    this.lastLengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = this.positions[lengthIndex];
      const rotation = this.rotations[lengthIndex] + this.rotationOffsets[lengthIndex];

      this.transformHolder.position.set(xPos, yPos, 0);
      this.transformHolder.rotation.set(0, 0, rotation);
      this.transformHolder.scale.set(1, length, 1);
      this.transformHolder.updateMatrix();

      this.ref?.current?.setMatrixAt(lengthIndex, this.transformHolder.matrix);
    });
  };

  private updateLengths = () => {
    this.lastLengths = hairLengths.getLengths();
  };

  private instanceCount = () => this.grid.length + maxFallingHair;

  private calculateCuts = (razorContainsPoint: (arg0: Position2D) => boolean) =>
    this.lastLengths.map((_length, lengthIndex) => {
      const hover = razorContainsPoint(this.positions[lengthIndex]);
      return hover && Mouse.isClicked();
    });

  private updateCutHairs(razorContainsPoint: (arg0: Position2D) => boolean) {
    const cuts = this.calculateCuts(razorContainsPoint);
    this.fallingHair?.update(this.lastLengths, cuts, this.rotationOffsets);
    this.hairCuts?.addFromClient(cuts);
  }

  private updateSwirls(mouse: Vector2, camera: Camera) {
    const mousePos = mouseToWorld(mouse, camera);
    this.rotationOffsets = calculateSwirls(
      this.positions,
      mousePos,
      this.lastLengths,
      this.rotationOffsets,
    );
  }

  private updateFrame(
    razorContainsPoint: (arg0: Position2D) => boolean,
    mouse: Vector2,
    camera: Camera,
  ) {
    this.updateLengths();
    this.createRotationsOnFirstRender();
    this.updateStaticHairs();
    this.updateCutHairs(razorContainsPoint);
    this.updateSwirls(mouse, camera);
  }
  public screenElement = ({ grid, rotations, razorContainsPoint, hairCuts }: HairsProps) => {
    const { viewport, mouse, camera } = useThree();
    const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
    useMemo(() => (this.positions = calculatePositions(grid, viewport)), [grid, viewport]);
    this.ref = useRef<InstancedMesh>();

    this.hairCuts = hairCuts;
    this.grid = grid;
    this.rotations = rotations;

    this.fallingHair = new FallingHair(
      this.positions,
      this.rotations,
      viewport,
      this.ref,
      this.grid,
      this.transformHolder,
    );

    useFrame(() => {
      if (!this.readyToRender()) return;
      this.updateFrame(razorContainsPoint, mouse, camera);
    });
    return (
      <>
        <instancedMesh
          ref={this.ref}
          args={[hairGeo, this.material, this.instanceCount()]}
        ></instancedMesh>
      </>
    );
  };
}

export { Hairs };
