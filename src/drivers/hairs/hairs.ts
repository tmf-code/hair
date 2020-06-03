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
  private readonly noCuts: false[];
  private readonly transformHolder = new Object3D();
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private hairCuts: HairCuts;
  private hairLengths: HairLengths;
  private hairPositions: HairPositions;
  private hairRotations: HairRotations;
  private fallingHair: FallingHairs;
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
    this.fallingHair = new FallingHairs(widthPoints * heightPoints, maxFallingHair);

    this.noCuts = [...new Array(widthPoints * heightPoints)].fill(false);
  }

  setViewport({ width, height, factor }: Viewport) {
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

    positions.forEach(([xPos, yPos], hairIndex) => {
      const length = lengths[hairIndex];
      const rotation = rotations[hairIndex];

      this.transformHolder.position.set(xPos, yPos, 0);
      this.transformHolder.rotation.set(0, 0, rotation);
      this.transformHolder.scale.set(1, length, 1);
      this.transformHolder.updateMatrix();

      this.ref?.current?.setMatrixAt(hairIndex, this.transformHolder.matrix);
    });
  };

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
    if (Mouse.isClicked() || Mouse.isSingleTouched()) {
      const positions = this.hairPositions.getScreenPositions();
      return positions.map(this.razorContainsPoint);
    } else return this.noCuts;
  };
}

export { Hairs };
