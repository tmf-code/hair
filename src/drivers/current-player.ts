import { lerp } from './../utilities/utilities';
import { offscreen } from './../utilities/constants';
import { Vector3, Mesh, Vector2, Camera, Triangle, Matrix4 } from 'three';
import React from 'react';

import { razorWidth, razorHeight } from '../utilities/constants';
import { mouseToWorld } from '../utilities/utilities';
import { Mouse } from './mouse/mouse';

type CurrentPlayerState = 'NOT_CUTTING' | 'START_CUTTING' | 'CUTTING' | 'STOP_CUTTING';

export class CurrentPlayer {
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private razorTriangles: [Triangle, Triangle] = [new Triangle(), new Triangle()];
  private aspect = 1.0;
  private rotation = 0;
  private smoothedRotation = 0;

  private smoothedPosition = new Vector2(0, 0);
  private position = new Vector2(0, 0);
  private worldPosition = new Vector3();
  private scale = [1, 1, 1] as [number, number, number];

  private playerState: CurrentPlayerState = 'NOT_CUTTING';

  public updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    this.ref = ref;
    this.aspect = aspect;

    switch (this.playerState) {
      case 'NOT_CUTTING':
        this.updateNotCutting();
        break;
      case 'START_CUTTING':
        this.updateStartCutting(mouse);
        break;
      case 'CUTTING':
        this.updateCutting(mouse, camera);
        break;
      case 'STOP_CUTTING':
        this.updateStopCutting(camera);
        break;
    }
  }

  private updateNotCutting() {
    this.updateScaleUp();
    if (Mouse.isClicked()) this.playerState = 'START_CUTTING';
  }

  private updateStartCutting(mouse: Vector2) {
    this.smoothedPosition = mouse.clone();
    this.updateRazorTriangles();
    this.updateRazorTransform();

    this.playerState = 'CUTTING';
  }

  private updateCutting(mouse: Vector2, camera: Camera) {
    this.updateScaleDown();
    this.position = mouse.clone();
    this.smoothedPosition = this.smoothedPosition.lerp(this.position, 0.1);
    this.worldPosition = mouseToWorld(this.smoothedPosition, camera);

    this.updateRazorTriangles();
    this.updateRazorTransform();

    if (!Mouse.isClicked()) {
      this.playerState = 'STOP_CUTTING';
    }
  }

  private updateStopCutting(camera: Camera) {
    this.setPositionOffscreen();
    this.worldPosition = mouseToWorld(this.smoothedPosition, camera);
    this.updateRazorTriangles();
    this.updateRazorTransform();

    this.playerState = 'NOT_CUTTING';
  }

  private setPositionOffscreen() {
    this.position = new Vector2().fromArray(offscreen);
    this.smoothedPosition = this.position;
  }

  private updateScaleUp() {
    const targetScale = 1.1 * this.aspect;
    this.scale = [targetScale, targetScale, 1];
  }

  private updateScaleDown() {
    const [widthCurrent, heightCurrent] = this.scale;
    const targetScale = 1.0 * this.aspect;
    const lerpRate = 0.1;

    const lerpTo = (dimension: number) => lerp(dimension, targetScale, lerpRate);
    this.scale = [lerpTo(widthCurrent), lerpTo(heightCurrent), 1.0];
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorTriangles.some((triangle) =>
      triangle.containsPoint(new Vector3(xPos, yPos, 0)),
    );
  }

  shouldUpdate(): boolean {
    return Mouse.isClicked() || Mouse.isSingleTouched();
  }

  getLocation(): { rotation: number; position: [number, number] } {
    return {
      rotation: this.rotation,
      position: this.position.toArray() as [number, number],
    };
  }

  private updateRazorTriangles() {
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
      vector.add(new Vector2(this.worldPosition.x, this.worldPosition.y)),
    );

    const absoluteVector3 = absoluteVector2.map((vector) => {
      return new Vector3().fromArray([...vector.toArray(), 0]);
    });

    const triangleLeft = new Triangle().setFromPointsAndIndices(absoluteVector3, 0, 1, 2);
    const triangleRight = new Triangle().setFromPointsAndIndices(absoluteVector3, 3, 1, 2);

    this.razorTriangles = [triangleLeft, triangleRight];
  }

  private updateRazorTransform() {
    this.smoothedRotation = Mouse.getSmoothedDirection();
    this.rotation = Mouse.getDirection();
    if (!this.ref?.current) return;

    const cursorOnTipOffset = -(2.1 / 2) * 0.5;
    this.ref.current.matrixAutoUpdate = false;
    this.ref.current.matrix.identity();
    const mat4: Matrix4 = new Matrix4();

    this.ref.current.matrix.multiply(
      mat4.makeTranslation(this.worldPosition.x, this.worldPosition.y, this.worldPosition.z),
    );
    this.ref.current.matrix.multiply(mat4.makeScale(...this.scale));
    this.ref.current.matrix.multiply(mat4.makeRotationZ(this.smoothedRotation));
    this.ref.current.matrix.multiply(mat4.makeTranslation(0, cursorOnTipOffset, 0));

    this.ref.current.matrixWorldNeedsUpdate = true;
  }
}
