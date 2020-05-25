import { Mouse } from './Mouse';
import { Vector3, Mesh, Vector2, Box2, Camera } from 'three';
import React from 'react';

import { razorWidth, razorHeight } from '../utilities/constants';
import { mouseToWorld } from '../utilities/utilities';

export class Razor {
  private mouseLeft = new Vector2();
  private mouseRight = new Vector2();
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private razorBox = new Box2();
  private aspect = 1.0;

  public updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    this.ref = ref;
    this.aspect = aspect;
    const mousePos = mouseToWorld(mouse, camera);
    this.updateRazorBox(mousePos);
    this.updateRazorPosition(mousePos);
    this.updateRazorRotation();
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return this.razorBox.containsPoint(new Vector2(xPos, yPos));
  }

  private updateRazorBox(mousePos: Vector3) {
    this.mouseLeft.set(mousePos.x - razorWidth * this.aspect, mousePos.y - razorHeight);
    this.mouseRight.set(mousePos.x + razorWidth * this.aspect, mousePos.y + razorHeight);
    this.razorBox.set(this.mouseLeft, this.mouseRight);
  }

  private updateRazorRotation() {
    if (this.ref?.current) {
      this.ref.current.rotation.set(0, 0, Mouse.SmoothedAngle());
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
