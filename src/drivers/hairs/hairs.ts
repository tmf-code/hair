import { Memoize } from './../../utilities/Memoize';
import { InstancedMesh, Camera, Vector2 } from 'three';
import { mouseToWorld } from '../../utilities/utilities';
import { maxFallingHair, widthPoints, heightPoints } from '../../utilities/constants';
import { Mouse } from '../mouse/mouse';

import { HairLengths } from './hair-lengths';
import { HairCuts } from './hair-cuts';
import { FallingHairs } from './falling-hairs';
import { HairPositions } from './hair-positions';
import { HairRotations } from './hair-rotations';
import { Viewport } from '../../types/viewport';
import { HairRenderer } from './hair-renderer';

class Hairs {
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
    if (!this.ref?.current) return;

    this.ref.current.instanceMatrix.needsUpdate = true;

    const rotations = this.hairRotations.getRotations();
    const positions = this.hairPositions.getScreenPositions();
    const lengths = this.hairLengths.getLengths();

    this.updateNotSkippedStaticHairs(positions, lengths, rotations);
  };

  private static getHairIndicesToDraw = (maxSize: number, skipFrequency: number) => {
    const indices = [];

    for (let index = 0; index < maxSize; index++) {
      const shouldSkip = index % skipFrequency > 1;
      if (shouldSkip) continue;
      indices.push(index);
    }
    return indices;
  };

  private updateNotSkippedStaticHairs(
    positions: [number, number][],
    lengths: number[],
    rotations: number[],
  ) {
    const skipFrequency = 1 / this.aspect;
    const indices = Memoize.memoize(Hairs.getHairIndicesToDraw, positions.length, skipFrequency);
    indices.forEach((hairIndex) => {
      const [xPos, yPos] = positions[hairIndex];
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
  ) {
    const mesh = this.ref?.current;
    if (!mesh) return;

    HairRenderer.render(mesh, hairIndex, xPos, yPos, rotation, 1, length, this.aspect);
  }

  private updateCutHairs() {
    const { currentPlayerCuts, combinedCuts } = this.calculateCuts();

    this.fallingHair.update(
      this.hairLengths.getLengths(),
      combinedCuts,
      this.hairRotations.getRotations(),
      this.hairPositions.getScreenPositions(),
    );

    if (currentPlayerCuts !== undefined) this.hairCuts.addFromClient(currentPlayerCuts);

    this.hairLengths.cutHairs(combinedCuts);
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

  private calculateCuts = (): {
    currentPlayerCuts: boolean[] | undefined;
    combinedCuts: boolean[];
  } => {
    const positions = this.hairPositions.getScreenPositions();
    const friendPlayerCuts = this.friendPlayerCuts(positions);

    const playerWantsToCut = Mouse.isClicked() || Mouse.isSingleTouched();
    if (playerWantsToCut) {
      const currentPlayerCuts = this.currentPlayerCuts(positions);
      return {
        currentPlayerCuts,
        combinedCuts: this.combineCuts(currentPlayerCuts, friendPlayerCuts),
      };
    }

    return {
      currentPlayerCuts: undefined,
      combinedCuts: friendPlayerCuts,
    };
  };

  private currentPlayerCuts(positions: [number, number][]) {
    return positions.map(this.currentPlayerContainsPoint);
  }

  private friendPlayerCuts(positions: [number, number][]) {
    return positions.map(this.friendPlayersContainPoint);
  }

  private combineCuts(playerCuts: boolean[], friendsCuts: boolean[]) {
    const combinedCuts = [];

    for (let index = 0; index < playerCuts.length; index++) {
      const playerCut = playerCuts[index];
      const friendsCut = friendsCuts[index];

      combinedCuts.push(playerCut || friendsCut);
    }

    return combinedCuts;
  }
}

export { Hairs };
