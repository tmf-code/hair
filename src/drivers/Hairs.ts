import { Object3D, InstancedMesh, Camera, Vector2 } from 'three';
import { mouseToWorld } from '../utilities/utilities';
import { maxFallingHair, widthPoints, heightPoints } from '../utilities/constants';
import { Mouse } from '../drivers/Mouse';

import { HairLengths } from '../drivers/HairLengths';
import { HairCuts } from '../drivers/HairCuts';
import { FallingHair } from './FallingHair';
import { HairPositions } from '../drivers/HairPositions';
import { HairRotations } from '../drivers/HairRotations';
import { Viewport } from '../types/Viewport';

class Hairs {
  private readonly transformHolder = new Object3D();
  private lastLengths: number[] = [];
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private hairCuts: HairCuts;
  private hairLengths: HairLengths;
  private hairPositions: HairPositions;
  private hairRotations: HairRotations;
  private fallingHair: FallingHair;
  private razorContainsPoint: (arg0: [number, number]) => boolean;

  constructor(
    razorContainsPoint: (arg0: [number, number]) => boolean,
    hairRotations: HairRotations,
    hairPositions: HairPositions,
    hairLengths: HairLengths,
    hairCuts: HairCuts,
  ) {
    this.razorContainsPoint = razorContainsPoint;
    this.hairRotations = hairRotations;
    this.hairPositions = hairPositions;
    this.hairLengths = hairLengths;
    this.hairCuts = hairCuts;

    this.lastLengths = hairLengths.getLengths();

    this.fallingHair = new FallingHair(widthPoints * heightPoints, maxFallingHair);
  }

  setViewport({ width, height, factor }: Viewport) {
    this.hairPositions.setViewport(width, height);
    this.fallingHair.setHairPositions(this.hairPositions.getScreenPositions());
    this.fallingHair.setViewport({ width, height, factor });
  }

  public updateFrame(
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    mouse: Vector2,
    camera: Camera,
  ) {
    this.ref = ref;
    this.fallingHair.setRef(ref);
    this.updateLengths();
    this.updateStaticHairs();
    this.updateCutHairs(this.razorContainsPoint);
    this.updateSwirls(mouse, camera);
  }

  private updateLengths = () => {
    this.lastLengths = this.hairLengths.getLengths();
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

  private updateCutHairs(razorContainsPoint: (arg0: [number, number]) => boolean) {
    const cuts = this.calculateCuts(razorContainsPoint);
    this.fallingHair.update(this.lastLengths, cuts, this.hairRotations.getRotations());
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

  private calculateCuts = (razorContainsPoint: (arg0: [number, number]) => boolean) => {
    const positions = this.hairPositions.getScreenPositions();
    return this.lastLengths.map((_length, lengthIndex) => {
      const hover = razorContainsPoint(positions[lengthIndex]);
      return hover && Mouse.isClicked();
    });
  };
}

export { Hairs };
