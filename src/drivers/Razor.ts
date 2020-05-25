import { Vector3, Mesh, Vector2, Box2 } from 'three';
import React from 'react';

import { razorWidth, razorHeight } from '../utilities/constants';

export class Razor {
  private mouseLeft = new Vector2();
  private mouseRight = new Vector2();
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private razorBox = new Box2();
  private aspect = 1.0;

  public updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mousePos: Vector3,
    aspect: number,
  ) {
    this.ref = ref;
    this.aspect = aspect;
    this.updateRazorBox(mousePos);
    this.updateRazorPosition(mousePos);
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorBox.containsPoint(new Vector2(xPos, yPos));
  }

  private updateRazorBox(mousePos: Vector3) {
    this.mouseLeft.set(mousePos.x - razorWidth * this.aspect, mousePos.y - razorHeight);
    this.mouseRight.set(mousePos.x + razorWidth * this.aspect, mousePos.y + razorHeight);
    this.razorBox.set(this.mouseLeft, this.mouseRight);
  }

  private updateRazorPosition(mousePos: Vector3) {
    if (this.ref?.current) {
      const cursorOnTipOffset = -(2.1 / 2) * 0.9 * this.aspect;
      this.ref.current.position.set(mousePos.x, mousePos.y + cursorOnTipOffset, mousePos.z);
      this.ref.current.matrixWorldNeedsUpdate = true;
    }
  }
}
