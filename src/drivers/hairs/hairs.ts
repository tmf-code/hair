import { Object3D, InstancedMesh, Camera, Vector2 } from 'three';
import { mouseToWorld } from '../../utilities/utilities';
import { maxFallingHair, widthPoints, heightPoints } from '../../utilities/constants';
import { Mouse } from '../mouse/mouse';

import { HairLengths } from './hair-lengths';
import { HairCuts } from './hair-cuts';
import { FallingHairs } from './falling-hairs';
import { HairPositions } from './hair-positions';
import { HairRotations } from './hair-rotations';
import { Viewport } from '../../types/viewport';

class Hairs {
  private readonly transformHolder = new Object3D();
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private hairCuts: HairCuts;
  private hairLengths: HairLengths;
  private hairPositions: HairPositions;
  private hairRotations: HairRotations;
  private fallingHair: FallingHairs;
  private aspect = 1.0;
  private currentPlayerContainsPoint: (arg0: [number, number]) => boolean;
  private friendPlayersContainPoint: (arg0: [number, number]) => boolean;

  constructor(
    currentPlayerContainsPoint: (arg0: [number, number]) => boolean,
    friendPlayersContainPoint: (arg0: [number, number]) => boolean,
    hairRotations: HairRotations,
    hairPositions: HairPositions,
    hairLengths: HairLengths,
    hairCuts: HairCuts,
  ) {
    this.currentPlayerContainsPoint = currentPlayerContainsPoint;
    this.currentPlayerContainsPoint = currentPlayerContainsPoint;
    this.friendPlayersContainPoint = friendPlayersContainPoint;
    this.hairRotations = hairRotations;
    this.hairPositions = hairPositions;
    this.hairLengths = hairLengths;
    this.hairCuts = hairCuts;
    this.fallingHair = new FallingHairs(widthPoints * heightPoints, maxFallingHair);
  }

  setViewport({ width, height, factor }: Viewport) {
    this.aspect = width / height;
    this.hairPositions.setViewport(width, height);
    this.fallingHair.setViewport({ width, height, factor });
  }

  public updateFrame(
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    mouse: Vector2,
    camera: Camera,
  ) {
    this.ref = ref;
    this.fallingHair.setRef(ref);
    this.updateStaticHairs();
    this.updateCutHairs();
    this.updateSwirls(mouse, camera);
  }

  private updateStaticHairs = () => {
    const shouldSkip = this.aspect < 1.0;

    if (!this.ref?.current) return;

    this.ref.current.instanceMatrix.needsUpdate = true;

    const rotations = this.hairRotations.getRotations();
    const positions = this.hairPositions.getScreenPositions();
    const lengths = this.hairLengths.getLengths();

    if (shouldSkip) {
      this.updateNotSkippedStaticHairs(positions, lengths, rotations);
    } else {
      this.updateAllStaticHairs(positions, lengths, rotations);
    }
  };

  private updateNotSkippedStaticHairs(
    positions: [number, number][],
    lengths: number[],
    rotations: number[],
  ) {
    const skipFrequency = 1 / this.aspect;
    const hairWidth = 2 / this.aspect;
    const hairLengthScale = 2 / this.aspect;
    positions.forEach(([xPos, yPos], hairIndex) => {
      const shouldSkip = hairIndex % skipFrequency > 1;
      if (shouldSkip) return;
      const length = lengths[hairIndex] * hairLengthScale;
      const rotation = rotations[hairIndex];

      this.updateStaticHair(xPos, yPos, length, rotation, hairIndex, hairWidth);
    });
  }

  private updateAllStaticHairs(
    positions: [number, number][],
    lengths: number[],
    rotations: number[],
  ) {
    positions.forEach(([xPos, yPos], hairIndex) => {
      const length = lengths[hairIndex];
      const rotation = rotations[hairIndex];
      this.updateStaticHair(xPos, yPos, length, rotation, hairIndex);
    });
  }

  private updateStaticHair(
    xPos: number,
    yPos: number,
    length: number,
    rotation: number,
    hairIndex: number,
    hairWidth = 1,
  ) {
    this.transformHolder.position.set(xPos, yPos, 0);
    this.transformHolder.rotation.set(0, 0, rotation);
    this.transformHolder.scale.set(hairWidth, length, 1);
    this.transformHolder.updateMatrix();

    this.ref?.current?.setMatrixAt(hairIndex, this.transformHolder.matrix);
  }

  private updateCutHairs() {
    const cuts = this.calculateCuts();

    this.fallingHair.update(
      this.hairLengths.getLengths(),
      cuts,
      this.hairRotations.getRotations(),
      this.hairPositions.getScreenPositions(),
    );

    this.hairCuts.addFromClient(cuts);
    this.hairLengths.cutHairs(this.hairCuts.getNewCuts());
    this.hairCuts.clearNewCuts();
  }

  private updateSwirls(mouse: Vector2, camera: Camera) {
    const mousePos = mouseToWorld(mouse, camera);
    this.hairRotations.calculateSwirls(this.hairPositions.getScreenPositions(), mousePos);
  }

  public readyToRender = () => {
    const isMeshMade = !!this.ref?.current;
    const hairsRetrievedFromServer = this.hairLengths.getLengths().length !== 0;
    const gridConstructed = this.hairPositions.getPositions().length !== 0;
    return isMeshMade && hairsRetrievedFromServer && gridConstructed;
  };

  public instanceCount = () => this.hairPositions.getPositions().length + maxFallingHair;

  private calculateCuts = () => {
    const positions = this.hairPositions.getScreenPositions();

    const playerWantsToCut = Mouse.isClicked() || Mouse.isSingleTouched();
    if (playerWantsToCut) {
      return this.currentAndFriendPlayerCuts(positions);
    } else {
      return this.friendPlayerCuts(positions);
    }
  };

  private currentAndFriendPlayerCuts(positions: [number, number][]) {
    return positions.map(
      (position) =>
        this.currentPlayerContainsPoint(position) || this.friendPlayersContainPoint(position),
    );
  }

  private friendPlayerCuts(positions: [number, number][]) {
    return positions.map(this.friendPlayersContainPoint);
  }
}

export { Hairs };
