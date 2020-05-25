import { Mouse } from './Mouse';
import { Vector3, Mesh, Vector2, Box2, Camera, Triangle, Matrix3, Matrix4 } from 'three';
import React from 'react';

import { razorWidth, razorHeight } from '../utilities/constants';
import { mouseToWorld } from '../utilities/utilities';

export class Razor {
  private mouseLeft = new Vector2();
  private mouseRight = new Vector2();
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private razorBox = new Box2();
  private razorTriangles: [Triangle, Triangle] = [new Triangle(), new Triangle()];
  private aspect = 1.0;
  private rotation = 0;

  public updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    this.ref = ref;
    this.aspect = aspect;
    const mousePos = mouseToWorld(mouse, camera);
    this.updateRazorTriangles(mousePos);
    this.updateRazorPosition(mousePos);
    this.updateRazorRotation();
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorTriangles.some((triangle) =>
      triangle.containsPoint(new Vector3(xPos, yPos, 0)),
    );
  }

  private updateRazorTriangles(mousePos: Vector3) {
    const offsets = [
      [-razorWidth * this.aspect, -razorHeight],
      [-razorWidth * this.aspect, +razorHeight],
      [+razorWidth * this.aspect, -razorHeight],
      [+razorWidth * this.aspect, +razorHeight],
    ];

    const offsetVector2 = offsets.map((offset) =>
      new Vector2().fromArray(offset).rotateAround(new Vector2(0, 0), this.rotation),
    );

    const absoluteVector2 = offsetVector2.map((vector) =>
      vector.add(new Vector2(mousePos.x, mousePos.y)),
    );

    const absoluteVector3 = absoluteVector2.map((vector) => {
      return new Vector3().fromArray([...vector.toArray(), 0]);
    });

    const triangleLeft = new Triangle().setFromPointsAndIndices(absoluteVector3, 0, 1, 2);
    const triangleRight = new Triangle().setFromPointsAndIndices(absoluteVector3, 3, 1, 2);

    this.razorTriangles = [triangleLeft, triangleRight];
  }

  private updateRazorRotation() {
    this.rotation = Mouse.SmoothedAngle();
    if (this.ref?.current) {
      this.ref.current.rotation.set(0, 0, this.rotation);
      this.ref.current.matrixWorldNeedsUpdate = true;
    }
  }

  private updateRazorPosition(mousePos: Vector3) {
    if (this.ref?.current) {
      const cursorOnTipOffset = -(2.1 / 2) * 0.9 * this.aspect;
      this.ref.current.position.set(mousePos.x, mousePos.y + cursorOnTipOffset, mousePos.z);
      this.ref.current.matrixWorldNeedsUpdate = true;
    }
  }
}
