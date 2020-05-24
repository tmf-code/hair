import { triangleGeometry } from './triangle-geometry';
import { Position2D } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import React, { useMemo, useRef } from 'react';
import { Object3D, InstancedMesh, MeshBasicMaterial, Color, Camera, Vector2 } from 'three';
import { mouseToWorld } from '../utilities/utilities';
import { hairColor, maxFallingHair } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

import { HairLengths } from '../drivers/HairLengths';
import { HairCuts } from '../drivers/HairCuts';
import { FallingHair } from './FallingHair';
import { HairPositions } from '../drivers/HairPositions';
import { HairRotations } from '../drivers/HairRotations';

// State holders outside of react
type HairsProps = {
  razorContainsPoint: (arg0: Position2D) => boolean;
};
class Hairs {
  private readonly transformHolder = new Object3D();
  private lastLengths: number[] = [];
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private material: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(hairColor) });
  private fallingHair: FallingHair | undefined;
  private hairCuts: HairCuts;
  private hairLengths: HairLengths;
  private hairPositions: HairPositions;
  private hairRotations: HairRotations;

  constructor(
    hairRotations: HairRotations,
    hairPositions: HairPositions,
    hairLengths: HairLengths,
    hairCuts: HairCuts,
  ) {
    this.hairCuts = hairCuts;
    this.hairPositions = hairPositions;
    this.hairRotations = hairRotations;
    this.hairLengths = hairLengths;
  }

  private readyToRender = () => {
    const isMeshMade = !!this.ref?.current;
    const hairsRetrievedFromServer = this.hairLengths.getLengths().length !== 0;
    const gridConstructed = this.hairPositions.getPositions().length !== 0;

    return isMeshMade && hairsRetrievedFromServer && gridConstructed;
  };

  private updateStaticHairs = () => {
    if (!this.ref?.current) return;

    this.ref.current.instanceMatrix.needsUpdate = true;

    const rotations = this.hairRotations.getRotations();
    const positions = this.hairPositions.getScreenPositions();

    this.lastLengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const rotation = rotations[lengthIndex];

      this.transformHolder.position.set(xPos, yPos, 0);
      this.transformHolder.rotation.set(0, 0, rotation);
      this.transformHolder.scale.set(1, length, 1);
      this.transformHolder.updateMatrix();

      this.ref?.current?.setMatrixAt(lengthIndex, this.transformHolder.matrix);
    });
  };

  private updateLengths = () => {
    this.lastLengths = this.hairLengths.getLengths();
  };

  private instanceCount = () => this.hairPositions.getPositions().length + maxFallingHair;

  private calculateCuts = (razorContainsPoint: (arg0: Position2D) => boolean) => {
    const positions = this.hairPositions.getScreenPositions();
    return this.lastLengths.map((_length, lengthIndex) => {
      const hover = razorContainsPoint(positions[lengthIndex]);
      return hover && Mouse.isClicked();
    });
  };

  private updateCutHairs(razorContainsPoint: (arg0: Position2D) => boolean) {
    const cuts = this.calculateCuts(razorContainsPoint);
    this.fallingHair?.update(this.lastLengths, cuts);
    this.hairCuts.addFromClient(cuts);
  }

  private updateSwirls(mouse: Vector2, camera: Camera) {
    const mousePos = mouseToWorld(mouse, camera);
    this.hairRotations.calculateSwirls(
      this.hairPositions.getScreenPositions(),
      mousePos,
      this.lastLengths,
    );
  }

  private updateFrame(
    razorContainsPoint: (arg0: Position2D) => boolean,
    mouse: Vector2,
    camera: Camera,
  ) {
    this.updateLengths();
    this.updateStaticHairs();
    this.updateCutHairs(razorContainsPoint);
    this.updateSwirls(mouse, camera);
  }
  public screenElement = ({ razorContainsPoint }: HairsProps) => {
    const { viewport, mouse, camera } = useThree();
    const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
    useMemo(() => this.hairPositions.setViewport(viewport.width, viewport.height), [viewport]);
    this.ref = useRef<InstancedMesh>();

    this.fallingHair = new FallingHair(
      this.hairPositions,
      viewport,
      this.ref,
      this.transformHolder,
      this.hairRotations,
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
