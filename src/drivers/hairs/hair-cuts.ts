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

  addFromClient(hairCuts: boolean[]) {
    this.clientCuts = HairCuts.combineCuts(this.clientCuts, hairCuts);
    this.newCuts = HairCuts.combineCuts(this.newCuts, this.clientCuts);
  }

  addFromServer(hairCuts: boolean[]) {
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

  hasNewCuts() {
    return this.newCuts.some(Boolean);
  }

  hasClientCuts() {
    return this.clientCuts.some(Boolean);
  }

  getNewCuts() {
    return this.newCuts;
  }

  getClientCuts() {
    return this.clientCuts;
  }

  clearClientCuts() {
    this.clientCuts = this.noCuts;
  }

  clearNewCuts() {
    this.newCuts = this.noCuts;
  }
}

export { HairCuts };
