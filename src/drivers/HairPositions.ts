import { lerp } from '../utilities/utilities';

class HairPositions {
  private positions: [number, number][] = [];
  private screenPositions: [number, number][] = [];
  private viewportWidth = 1.0;
  private viewportHeight = 1.0;

  setPositions(positions: [number, number][]) {
    this.positions = positions;
    this.convertRelativeToScreen();
  }

  getPositions() {
    return this.positions;
  }

  getScreenPositions() {
    return this.screenPositions;
  }

  setViewport(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.convertRelativeToScreen();
  }

  private convertRelativeToScreen() {
    this.screenPositions = this.positions.map(
      ([xPos, yPos]) =>
        this.convertPointRelativeToScreen(xPos, yPos, this.viewportWidth, this.viewportHeight) as [
          number,
          number,
        ],
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

export { HairPositions };
