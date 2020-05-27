import { Vector2 } from '../types';
import { MapState } from './map-state';

export type CreateGridArgs = {
  horizontalDesity: number;
  verticalDensity: number;
  randomJitterRange: number;
  minRotationAngle: number;
  maxRotationAngle: number;
};

export class HairMapFactory {
  private static horizontalDesity: number;
  private static verticalDensity: number;
  private static randomJitterRange: number;
  private static minRotationAngle: number;
  private static maxRotationAngle: number;

  private static rotations: number[];
  private static positions: [number, number][];
  private static lengths: number[];

  static createFrom(
    horizontalDesity: number,
    verticalDensity: number,
    randomJitterRange: number,
    minRotationAngle: number,
    maxRotationAngle: number,
  ): MapState {
    this.horizontalDesity = horizontalDesity;
    this.verticalDensity = verticalDensity;
    this.randomJitterRange = randomJitterRange;
    this.minRotationAngle = minRotationAngle;
    this.maxRotationAngle = maxRotationAngle;

    this.positions = this.createPositions();
    this.lengths = this.createLengths();
    this.rotations = this.createRotations();

    return {
      positions: this.positions,
      lengths: this.lengths,
      rotations: this.rotations,
    };
  }

  private static createPositions() {
    return [...new Array(this.horizontalDesity * this.verticalDensity)]
      .fill(0)
      .map((_, index) => this.getArrayCoordinateIDs(index, this.horizontalDesity))
      .map(([xPosition, yPosition]) =>
        this.getXYPositions([xPosition, yPosition], this.horizontalDesity, this.verticalDensity),
      )
      .map(([xPos, yPos]) => this.jitter([xPos, yPos], this.randomJitterRange));
  }

  private static getArrayCoordinateIDs = (arrayIndex: number, horizontalDesity: number) => [
    arrayIndex % horizontalDesity,
    Math.floor(arrayIndex / horizontalDesity),
  ];

  private static getXYPositions = (
    [indexX, indexY]: Vector2,
    horizontalDesity: number,
    verticalDensity: number,
  ) => [indexX / horizontalDesity, indexY / verticalDensity] as Vector2;

  private static jitter = ([xPosition, yPosition]: Vector2, jitterRange: number) =>
    [
      xPosition + HairMapFactory.randRange(-jitterRange, jitterRange),
      yPosition + HairMapFactory.randRange(-jitterRange, jitterRange),
    ] as Vector2;

  private static createLengths() {
    return this.positions.map(() => 0);
  }

  private static createRotations() {
    return this.positions.map(() =>
      HairMapFactory.randRange(this.minRotationAngle, this.maxRotationAngle),
    );
  }

  private static randRange = (minimum: number, maximum: number) =>
    Math.random() * (maximum - minimum) + minimum;
}
