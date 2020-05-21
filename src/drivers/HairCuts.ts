import { hairLengths } from './HairLengths';
class HairCuts {
  private clientCutBuffer: boolean[] = [];
  addFromClient(hairCuts: boolean[]) {
    this.clientCutBuffer = hairCuts.map((currentCut, cutIndex) => {
      const clientDidCut = currentCut === true;
      const bufferHasCut = this.clientCutBuffer[cutIndex] !== undefined;
      if (clientDidCut) return currentCut;
      if (bufferHasCut) return this.clientCutBuffer[cutIndex];

      return false;
    });

    this.applyToHairLengths(hairCuts);
  }
  addFromServer(hairCuts: boolean[]) {
    this.applyToHairLengths(hairCuts);
  }
  private applyToHairLengths(hairCuts: boolean[]) {
    hairLengths.cutHairs(hairCuts);
  }
  hasClientCuts() {
    return this.clientCutBuffer.some(Boolean);
  }
  getBufferAndClear() {
    const bufferCopy = [...this.clientCutBuffer];
    this.clearBuffer();
    return bufferCopy;
  }
  private clearBuffer() {
    this.clientCutBuffer = this.clientCutBuffer.map((_) => false);
  }
}

const hairCuts = new HairCuts();

export { hairCuts };
