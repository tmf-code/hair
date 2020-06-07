import { growthSpeed } from './../constants';
export class HairMap {
  private positions: [number, number][];
  private rotations: number[];
  private lengths: number[];
  private cuts: boolean[];

  constructor(positions: [number, number][], rotations: number[], lengths: number[]) {
    this.positions = positions;
    this.rotations = rotations;
    this.lengths = lengths;

    this.cuts = this.createCuts();
  }

  private createCuts() {
    return this.positions.map(() => false);
  }

  recieveCuts(cuts: boolean[]) {
    this.addCuts(cuts);
  }

  private addCuts(cuts: boolean[]) {
    if (cuts.length !== this.cuts.length) {
      return;
    }
    this.cuts = this.cuts.map((currentCut, cutIndex) => currentCut || cuts[cutIndex]);
  }

  growLengths() {
    this.applyCutsToLengths();
    this.clearCuts();
    this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
    return growthSpeed;
  }

  private applyCutsToLengths() {
    this.lengths = this.lengths.map((length, lengthIndex) => (this.cuts[lengthIndex] ? 0 : length));
  }

  private clearCuts() {
    this.cuts = this.positions.map(() => false);
  }

  getMapState() {
    return {
      positions: this.positions,
      rotations: this.rotations,
      lengths: this.lengths,
    };
  }
}
