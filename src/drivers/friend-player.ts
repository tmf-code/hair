import { offscreen } from './../utilities/constants';
import { lerpTheta } from './../utilities/utilities';
import { Vector3, Mesh, Camera, Matrix4 } from 'three';
import React from 'react';

import { relativeToWorld } from '../utilities/utilities';

export class FriendPlayer {
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private camera: Camera | undefined;

  private rotation = 0;
  private targetRotation = 0;

  private relativeTargetPosition = [0, 0];
  private previousRelativeTargetPosition = [0, 0];
  private position: Vector3 = new Vector3(0, 0, 0);
  private targetPosition: Vector3 = new Vector3(0, 0, 0);

  public updateFrame(ref: React.MutableRefObject<Mesh | undefined>, camera: Camera) {
    this.ref = ref;
    this.camera = camera;

    this.updateRotation();
    this.updatePosition();
    this.updateRazorTransform();
  }

  private updateRotation() {
    this.rotation = lerpTheta(this.rotation, this.targetRotation, 0.1, Math.PI * 2);
  }

  private updatePosition() {
    if (this.isOffScreen()) {
      this.position = new Vector3(-100, -100, 0);
      return;
    }

    if (this.wasOffscreen()) {
      this.position = this.targetPosition;
      return;
    }

    this.position = this.position.lerp(this.targetPosition, 0.1);
  }

  public serverUpdate(relativePosition: [number, number], rotation: number) {
    this.targetRotation = rotation;
    this.previousRelativeTargetPosition = this.relativeTargetPosition;
    this.relativeTargetPosition = relativePosition;

    if (this.camera) {
      this.targetPosition = relativeToWorld(relativePosition, this.camera);
    }
  }

  private wasOffscreen() {
    return (
      this.previousRelativeTargetPosition[0] === offscreen[0] &&
      this.previousRelativeTargetPosition[0] === offscreen[1]
    );
  }

  private isOffScreen() {
    return (
      this.relativeTargetPosition[0] === offscreen[0] &&
      this.relativeTargetPosition[0] === offscreen[1]
    );
  }

  private updateRazorTransform() {
    if (this.ref?.current) {
      const cursorOnTipOffset = -(2.1 / 2) * 0.5;
      this.ref.current.matrixAutoUpdate = false;
      this.ref.current.matrix.identity();
      const mat4: Matrix4 = new Matrix4();

      this.ref.current.matrix.multiply(
        mat4.makeTranslation(this.position.x, this.position.y, this.position.z),
      );
      this.ref.current.matrix.multiply(mat4.makeRotationZ(this.rotation));
      this.ref.current.matrix.multiply(mat4.makeTranslation(0, cursorOnTipOffset, 0));

      this.ref.current.matrixWorldNeedsUpdate = true;
    }
  }
}
