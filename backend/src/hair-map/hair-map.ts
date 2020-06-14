import { growthAmount, growthInterval } from './../constants';
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
    this.startGrowing();
  }

  private createCuts() {
    return this.positions.map(() => false);
  }

  recieveCuts(cuts: boolean[]): void {
    this.addCuts(cuts);
  }

  private addCuts(cuts: boolean[]) {
    if (cuts.length !== this.cuts.length) {
      return;
    }
    this.cuts = this.cuts.map((currentCut, cutIndex) => currentCut || cuts[cutIndex]);
  }

  private startGrowing() {
    const grow = () => {
      this.growLengths();

      const thisWasDestroyed = this === undefined;
      if (!thisWasDestroyed) {
        setTimeout(grow, growthInterval);
      }
    };
    grow();
  }

  private growLengths() {
    this.applyCutsToLengths();
    this.clearCuts();
    this.lengths = this.lengths.map((length) => Math.min(length + growthAmount, 1));
    return growthAmount;
  }

  private applyCutsToLengths() {
    this.lengths = this.lengths.map((length, lengthIndex) => (this.cuts[lengthIndex] ? 0 : length));
  }

  private clearCuts() {
    this.cuts = this.positions.map(() => false);
  }

  getMapState(): {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  } {
    return {
      positions: this.positions,
      rotations: this.rotations,
      lengths: this.lengths,
    };
  }
}
