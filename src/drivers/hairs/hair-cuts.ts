import { mapOnZipped } from '../../utilities/utilities';
class HairCuts {
  private readonly noCuts: boolean[];
  private clientCuts: boolean[];
  private newCuts: boolean[];

  constructor(size: number) {
    this.noCuts = [...new Array(size)].fill(false);

    this.clientCuts = this.noCuts;
    this.newCuts = this.noCuts;
  }

  addFromClient(hairCuts: boolean[]): void {
    this.clientCuts = HairCuts.combineCuts(this.clientCuts, hairCuts);
    this.newCuts = HairCuts.combineCuts(this.newCuts, this.clientCuts);
  }

  addFromServer(hairCuts: boolean[]): void {
    this.newCuts = HairCuts.combineCuts(this.newCuts, hairCuts);
  }

  private static combineCuts(cutsA: boolean[], cutsB: boolean[]) {
    if (cutsA.length !== cutsB.length)
      throw new RangeError(
        `Unable to combine cutsA with cutsB. Lengths ${cutsA.length} and ${cutsB.length} do not match`,
      );

    return mapOnZipped(cutsA, cutsB, HairCuts.combiner);
  }

  private static combiner(cutA: boolean, cutB: boolean) {
    return cutA || cutB;
  }

  hasNewCuts(): boolean {
    return this.newCuts.some(Boolean);
  }

  hasClientCuts(): boolean {
    return this.clientCuts.some(Boolean);
  }

  getNewCuts(): boolean[] {
    return this.newCuts;
  }

  getClientCuts(): boolean[] {
    return this.clientCuts;
  }

  clearClientCuts(): void {
    this.clientCuts = this.noCuts;
  }

  clearNewCuts(): void {
    this.newCuts = this.noCuts;
  }
}

export { HairCuts };
