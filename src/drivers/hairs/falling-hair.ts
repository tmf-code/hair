import { EasingFunctions } from '../../utilities/easing-functions';

export interface IfallingHair {
  type: 'empty' | 'useful';
  xPos: number;
  yPos: number;
  rotation: number;
  length: number;
  hairIndex: number;
  timeStamp: number;
}

export class FallingHair implements IfallingHair {
  readonly type: 'empty' | 'useful';
  readonly xPos: number;
  readonly yPos: number;
  readonly rotation: number;
  readonly length: number;
  readonly hairIndex: number;
  readonly timeStamp: number;
  readonly distanceToDestination: number;

  private readonly animationDuration: number;
  private readonly frameTime: number;
  private readonly viewportHeight: number;
  private readonly animationProgression: number;
  private readonly destinationHeight: number;
  private readonly bucketHeight: number;

  constructor(
    { type, xPos, yPos, rotation, length, hairIndex, timeStamp }: IfallingHair,
    animationDuration: number,
    frameTime: number,
    viewportHeight: number,
    bucketHeight: number,
  ) {
    this.type = type;
    this.xPos = xPos;
    this.yPos = yPos;
    this.rotation = rotation;
    this.length = length;
    this.hairIndex = hairIndex;
    this.timeStamp = timeStamp;
    this.animationDuration = animationDuration;
    this.frameTime = frameTime;
    this.viewportHeight = viewportHeight;
    this.bucketHeight = bucketHeight;

    this.animationProgression = this.calculateAnimationProgression();
    this.destinationHeight = this.calculateDestinationHeight();
    this.distanceToDestination = this.calculateDistanceToDestination();
  }

  private calculateAnimationProgression = () =>
    Math.min((this.frameTime - this.timeStamp) / this.animationDuration, 1.0);

  private calculateDestinationHeight = () => {
    const requestedHeight = this.getStackedDestinationHeight();
    const shouldStack = requestedHeight < this.yPos;

    if (shouldStack) {
      return requestedHeight;
    }

    const bottomOfWindow = -this.viewportHeight / 2.0;
    return bottomOfWindow;
  };

  private getStackedDestinationHeight() {
    const bottomOfWindow = -this.viewportHeight / 2.0;
    const useRotationAsPseudoRandomOffset = this.rotation / 10;
    const heightFromBottom =
      ((this.bucketHeight + useRotationAsPseudoRandomOffset) / this.viewportHeight) * 15;

    return bottomOfWindow + heightFromBottom;
  }

  private calculateDistanceToDestination = () =>
    (this.yPos - this.destinationHeight) * EasingFunctions.easeInQuad(this.animationProgression);
}
