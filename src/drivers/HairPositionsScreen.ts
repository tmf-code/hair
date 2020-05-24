import { HairPositionsRelative } from './HairPositionsRelative';
import { Position2D } from '../types/types';
import { lerp } from '../utilities/utilities';

type ViewportDimensions = {
  width: number;
  height: number;
};

class HairPositionsScreen {
  private positions: [number, number][] = [];

  setFromRelative(relative: HairPositionsRelative, viewportWidth: number, viewportHeight: number) {
    this.positions = this.convertRelativeToScreen(
      relative.getPositions(),
      viewportWidth,
      viewportHeight,
    );
  }
  getPositions() {
    return this.positions;
  }
  private convertRelativeToScreen(
    grid: Position2D[],
    viewportWidth: number,
    viewportHeight: number,
  ): Position2D[] {
    return grid.map(
      ([xPos, yPos]) =>
        this.convertPointRelativeToScreen(xPos, yPos, viewportWidth, viewportHeight) as Position2D,
    );
  }

  private convertPointRelativeToScreen(
    xPos: number,
    yPos: number,
    viewportWidth: number,
    viewportHeight: number,
  ) {
    return [
      lerp(-viewportWidth / 2.0, viewportWidth / 2.0, xPos),
      lerp(viewportHeight / 2.0, -viewportHeight / 2.0, yPos),
    ];
  }
}

export { HairPositionsScreen };
