import { Vector3, Mesh, Camera, Matrix4 } from 'three';
import React from 'react';

import { relativeToWorld } from '../utilities/utilities';

export class FriendPlayer {
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private rotation = 0;
  camera: Camera | undefined;
  position: Vector3 = new Vector3(0, 0, 0);

  public updateFrame(ref: React.MutableRefObject<Mesh | undefined>, camera: Camera) {
    this.ref = ref;
    this.camera = camera;
    this.updateRazorTransform();
  }

  public serverUpdate(relativePosition: [number, number], rotation: number) {
    if (this.camera) {
      this.position = relativeToWorld(relativePosition, this.camera);
      this.rotation = rotation;
    }
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
