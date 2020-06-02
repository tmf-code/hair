import { Vector3, Vector2, Triangle } from 'three';

import { razorWidth, razorHeight } from '../utilities/constants';
import { Mouse } from './mouse/mouse';
import { AbstractPlayer } from './abstract-player';

export class CurrentPlayer extends AbstractPlayer {
  private razorTriangles: [Triangle, Triangle] = [new Triangle(), new Triangle()];

  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    if (Mouse.isClicked()) return 'START_CUTTING';

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    this.smoothedPosition = this.mouse?.toArray() as [number, number];
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.position = this.mouse?.toArray() as [number, number];
    this.smoothedRotation = Mouse.getSmoothedDirection();

    this.updateScaleDown();
    this.updatePosition();
    this.updateRazorTriangles();
    this.setRazorTransform();

    if (!Mouse.isClicked()) {
      return 'STOP_CUTTING';
    }

    return 'CUTTING';
  }

  updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'NOT_CUTTING';
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
      position: this.position,
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
      vector.add(new Vector2(this.worldPosition[0], this.worldPosition[1])),
    );

    const absoluteVector3 = absoluteVector2.map((vector) => {
      return new Vector3().fromArray([...vector.toArray(), 0]);
    });

    const triangleLeft = new Triangle().setFromPointsAndIndices(absoluteVector3, 0, 1, 2);
    const triangleRight = new Triangle().setFromPointsAndIndices(absoluteVector3, 3, 1, 2);

    this.razorTriangles = [triangleLeft, triangleRight];
  }
}
