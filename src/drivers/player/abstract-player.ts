import { friendLayer, playerLayer } from './../../utilities/constants';
import { lerpTuple3, lerpTuple2, lerpTheta, relativeToWorld } from '../../utilities/utilities';
import { offscreen, razorWidth, razorHeight } from '../../utilities/constants';
import { Mesh, Vector2, Camera, Matrix4, Triangle, Vector3 } from 'three';
import React from 'react';

type PlayerState = 'NOT_CUTTING' | 'START_CUTTING' | 'CUTTING' | 'STOP_CUTTING';

export abstract class AbstractPlayer {
  protected ref: React.MutableRefObject<Mesh | undefined> | undefined;
  protected aspect = 1.0;
  protected rotation = 0;
  protected smoothedRotation = 0;
  protected camera: Camera | undefined;
  protected mouse: Vector2 | undefined;

  protected smoothedPosition: [number, number] = offscreen;
  protected worldPosition: [number, number, number] = [0, 0, 0];
  protected position: [number, number] = offscreen;
  protected scale: [number, number, number] = [1, 1, 1];

  protected playerState: PlayerState = 'STOP_CUTTING';

  protected razorTriangles: [Triangle, Triangle] = [new Triangle(), new Triangle()];

  updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    this.ref = ref;
    this.aspect = aspect;
    this.mouse = mouse;
    this.camera = camera;

    switch (this.playerState) {
      case 'NOT_CUTTING':
        this.playerState = this.updateNotCutting();

        break;
      case 'START_CUTTING':
        this.playerState = this.updateStartCutting();
        break;
      case 'CUTTING':
        this.playerState = this.updateCutting();
        break;
      case 'STOP_CUTTING':
        this.playerState = this.updateStopCutting();
        break;
    }
  }

  protected abstract updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING';
  protected abstract updateStartCutting(): 'START_CUTTING' | 'CUTTING';
  protected abstract updateCutting(): 'CUTTING' | 'STOP_CUTTING';
  protected abstract updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING';

  protected setPositionOffscreen() {
    this.position = [...offscreen] as [number, number];
    this.smoothedPosition = this.position;
  }

  protected updateScaleUp() {
    const targetScale = 1.1 * this.getScale();
    this.scale = [targetScale, targetScale, 1];
  }

  protected updateScaleDown() {
    const targetScale = 1.0 * this.getScale();
    const lerpRate = 0.1;

    this.scale = lerpTuple3(this.scale, [targetScale, targetScale, 1.0], lerpRate);
  }

  private getScale() {
    const isLandscape = this.aspect > 1.0;

    if (isLandscape) {
      const scaleAtHalfRateOfAspect = (this.aspect - 1) / 2 + 1;
      return scaleAtHalfRateOfAspect;
    }

    return 1.0;
  }

  protected updatePosition() {
    const lerpRate = 0.1;
    this.smoothedPosition = lerpTuple2(this.smoothedPosition, this.position, lerpRate);

    if (!this.camera) return;

    const [xPos, yPos] = relativeToWorld(this.smoothedPosition, this.camera).toArray() as [
      number,
      number,
      number,
    ];

    const zPos = this.worldPosition[2];

    this.worldPosition = [xPos, yPos, zPos];
  }

  protected updateRotation() {
    this.smoothedRotation = lerpTheta(this.smoothedRotation, this.rotation, 0.1, Math.PI * 2);
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorTriangles.some((triangle) =>
      triangle.containsPoint(new Vector3(xPos, yPos, 0)),
    );
  }

  protected updateRazorTriangles() {
    const [widthScale, heightScale] = this.scale;
    const offsets = [
      [-razorWidth * widthScale, -razorHeight],
      [-razorWidth * widthScale, razorHeight],
      [+razorWidth * heightScale, -razorHeight],
      [+razorWidth * heightScale, razorHeight],
    ];

    const cursorOnTipOffset = new Vector2(0, razorHeight * 4.2 * heightScale);

    const offsetVector2 = offsets.map((offset) =>
      new Vector2()
        .fromArray(offset)
        .add(cursorOnTipOffset)
        .rotateAround(new Vector2(0, 0), this.smoothedRotation),
    );

    const absoluteVector2 = offsetVector2.map((vector) =>
      vector.add(new Vector2(this.worldPosition[0], this.worldPosition[1])),
    );

    const absoluteVector3 = absoluteVector2.map((vector) => {
      return new Vector3().fromArray([...vector.toArray(), 0]);
    });

    const triangleLeft = new Triangle().setFromPointsAndIndices(absoluteVector3, 0, 1, 2);
    const triangleRight = new Triangle().setFromPointsAndIndices(absoluteVector3, 3, 1, 2);

    this.razorTriangles = [triangleLeft, triangleRight];
  }

  protected setLayer(layer: typeof friendLayer | typeof playerLayer) {
    this.worldPosition[2] = layer;
  }

  protected setRazorTransform() {
    if (!this.ref?.current) return;
    const cursorOnTipOffset = -(2.1 / 2) * 0.5;

    this.ref.current.matrixAutoUpdate = false;

    this.ref.current.matrix.identity();
    const mat4: Matrix4 = new Matrix4();
    this.ref.current.matrix.multiply(mat4.makeTranslation(...this.worldPosition));
    this.ref.current.matrix.multiply(mat4.makeScale(...this.scale));
    this.ref.current.matrix.multiply(mat4.makeRotationZ(this.smoothedRotation));
    this.ref.current.matrix.multiply(mat4.makeTranslation(0, cursorOnTipOffset, 0));

    this.ref.current.matrixWorldNeedsUpdate = true;
  }
}
