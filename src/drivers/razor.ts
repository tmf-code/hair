import { Vector3, Mesh, Vector2, Camera, Triangle, Matrix4 } from 'three';
import React from 'react';

import { razorWidth, razorHeight } from '../utilities/constants';
import { mouseToWorld } from '../utilities/utilities';
import { Mouse } from './mouse/mouse';

export class Razor {
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
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
    if (this.shouldUpdate()) {
      const mousePos = mouseToWorld(mouse, camera);
      this.updateRazorTriangles(mousePos);
      this.updateRazorTransform(mousePos);
    }
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorTriangles.some((triangle) =>
      triangle.containsPoint(new Vector3(xPos, yPos, 0)),
    );
  }

  shouldUpdate(): boolean {
    return Mouse.isClicked();
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

  private updateRazorTransform(mousePos: Vector3) {
    this.rotation = Mouse.getDirection();

    if (this.ref?.current) {
      const cursorOnTipOffset = -(2.1 / 2) * 0.5;
      this.ref.current.matrixAutoUpdate = false;
      this.ref.current.matrix.identity();
      const mat4: Matrix4 = new Matrix4();

      this.ref.current.matrix.multiply(mat4.makeTranslation(mousePos.x, mousePos.y, mousePos.z));
      this.ref.current.matrix.multiply(mat4.makeRotationZ(this.rotation));
      this.ref.current.matrix.multiply(mat4.makeTranslation(0, cursorOnTipOffset, 0));

      this.ref.current.matrixWorldNeedsUpdate = true;
    }
  }
}
