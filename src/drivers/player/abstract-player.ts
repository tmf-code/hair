import { friendLayer, playerLayer, cachedMovementCount } from './../../utilities/constants';
import { lerpTuple3, lerpTuple2, lerpTheta, relativeToWorld } from '../../utilities/utilities';
import { offscreen, razorWidth, razorHeight } from '../../utilities/constants';
import { Mesh, Vector2, Camera, Matrix4, Triangle, Vector3 } from 'three';
import React from 'react';
import { BufferedPlayerData, PlayerData } from '../../../@types/messages';

type PlayerState = 'NOT_CUTTING' | 'START_CUTTING' | 'CUTTING' | 'STOP_CUTTING';

export abstract class AbstractPlayer {
  private ref: React.MutableRefObject<Mesh | undefined> | undefined;
  private aspect = 1.0;
  private rotation = 0;
  private smoothedRotation = 0;
  private camera: Camera | undefined;
  protected mouse: Vector2 | undefined;

  private razorSmoothedPosition: [number, number] = offscreen;
  private worldPosition: [number, number, number] = [0, 0, 0];
  private pointerPosition: [number, number] = offscreen;
  private razorTargetPosition: [number, number] = offscreen;
  private scale: [number, number, number] = [1, 1, 1];
  private playerState: PlayerState = 'STOP_CUTTING';
  private razorTriangles: [Triangle, Triangle] = [new Triangle(), new Triangle()];

  private bufferedPlayerData: BufferedPlayerData = [];
  private actionState: PlayerData['state'] = 'NOT_CUTTING';

  updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ): void {
    this.ref = ref;
    this.aspect = aspect;
    this.mouse = mouse;
    this.camera = camera;

    this.beforeEachState();
    switch (this.playerState) {
      case 'NOT_CUTTING':
        this.setRazorOffscreen();
        this.updateScaleUp();
        this.playerState = this.updateNotCutting();

        break;
      case 'START_CUTTING':
        this.setRazorOnscreen();
        this.snapSmoothedToTargetPosition();
        this.snapSmoothedToTargetRotation();
        this.updateDisplay();
        this.playerState = 'CUTTING';
        break;
      case 'CUTTING':
        this.setRazorOnscreen();
        this.updateScaleDown();
        this.updateDisplay();
        this.playerState = this.updateCutting();
        break;
      case 'STOP_CUTTING':
        this.setRazorOffscreen();
        this.playerState = this.updateStopCutting();
        this.updateScaleUp();
        this.updateDisplay();
        break;
    }
  }

  private updateDisplay() {
    this.updatePosition();
    this.updateRotation();
    this.updateRazorTriangles();
    this.updateRazorTransform();
  }

  getBufferedPlayerData(): BufferedPlayerData {
    return this.bufferedPlayerData;
  }

  protected getPlayerData(): PlayerData | undefined {
    return this.bufferedPlayerData.pop();
  }

  setBufferedPlayerData(bufferedPlayerData: BufferedPlayerData): void {
    this.bufferedPlayerData = bufferedPlayerData;
  }

  protected addPlayerData(data: PlayerData): void {
    this.bufferedPlayerData.unshift(data);
    const bufferIsFull = this.bufferedPlayerData.length > cachedMovementCount;
    if (bufferIsFull) {
      this.bufferedPlayerData.pop();
    }
  }

  protected setState(state: PlayerData['state']): void {
    this.actionState = state;
  }

  protected isCutting(): boolean {
    return this.actionState === 'CUTTING';
  }
  protected abstract beforeEachState(): void;
  protected abstract updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING';
  private updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    if (!this.isCutting()) return 'STOP_CUTTING';

    return 'CUTTING';
  }
  protected abstract updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING';

  private setRazorOffscreen(): void {
    this.razorTargetPosition = [...offscreen] as [number, number];
    this.snapSmoothedToTargetPosition();
  }

  private snapSmoothedToTargetPosition(): void {
    this.razorSmoothedPosition = this.razorTargetPosition;
  }

  protected setPointerPosition(position: [number, number]): void {
    this.pointerPosition = position;
  }

  private setRazorOnscreen(): void {
    this.razorTargetPosition = this.pointerPosition;
  }

  protected setRotation(rotation: number): void {
    this.rotation = rotation;
  }

  protected getRotation(): number {
    return this.rotation;
  }

  protected getPointerPosition(): [number, number] {
    return this.pointerPosition;
  }

  protected snapSmoothedToTargetRotation(): void {
    this.smoothedRotation = this.rotation;
  }

  private updateScaleUp(): void {
    const targetScale = 1.1 * this.getScale();
    this.scale = [targetScale, targetScale, 1];
  }

  private updateScaleDown(): void {
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

  private updatePosition(): void {
    const lerpRate = 0.1;
    this.razorSmoothedPosition = lerpTuple2(
      this.razorSmoothedPosition,
      this.razorTargetPosition,
      lerpRate,
    );

    if (!this.camera) return;

    const [xPos, yPos] = relativeToWorld(this.razorSmoothedPosition, this.camera).toArray() as [
      number,
      number,
      number,
    ];

    const zPos = this.worldPosition[2];

    this.worldPosition = [xPos, yPos, zPos];
  }

  private updateRotation(): void {
    this.smoothedRotation = lerpTheta(this.smoothedRotation, this.rotation, 0.1, Math.PI * 2);
  }

  containsPoint([xPos, yPos]: [number, number]): boolean {
    return this.razorTriangles.some((triangle) =>
      triangle.containsPoint(new Vector3(xPos, yPos, 0)),
    );
  }

  private updateRazorTriangles(): void {
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

  protected setLayer(layer: typeof friendLayer | typeof playerLayer): void {
    this.worldPosition[2] = layer;
  }

  private updateRazorTransform(): void {
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
