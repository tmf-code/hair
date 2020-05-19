class HairRotations {
  private rotations: number[] = [];
  setRotations(rotations: number[]) {
    this.rotations = [...rotations];
  }
  getRotations() {
    return [...this.rotations];
  }
}

const hairRotations = new HairRotations();

export { hairRotations };
