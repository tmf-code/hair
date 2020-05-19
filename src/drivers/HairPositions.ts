class HairPositions {
  private positions: [number, number][] = [];
  setPositions(positions: [number, number][]) {
    this.positions = positions;
  }
  getPositions() {
    return this.positions;
  }
}

const hairPositions = new HairPositions();

export { hairPositions };
