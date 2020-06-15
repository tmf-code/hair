import { writeFileSync } from 'fs';

export class Recorder {
  static startDelay = 10;
  static recordCount = 30;
  static samples: Record<
    string,
    {
      rotation: number;
      position: [number, number];
    }[]
  >[] = [];
  static submissionCount = 0;

  static addSample(
    sample: Record<
      string,
      {
        rotation: number;
        position: [number, number];
      }[]
    >,
  ): void {
    this.submissionCount++;
    const shouldStart = this.submissionCount > this.startDelay;
    if (!shouldStart) {
      console.log(`Starting to record in ${this.startDelay - this.submissionCount} seconds`);
      return;
    }

    if (this.samples.length > this.recordCount) {
      this.saveToFile('./data.json');
      return;
    }

    console.log('Adding sample ' + this.samples.length);
    console.log('Saving in ' + (this.recordCount - this.samples.length));

    this.samples.push(sample);
  }

  static saveToFile(filename: string): void {
    const jsonString = JSON.stringify(this.samples);
    writeFileSync(filename, jsonString);
    console.log('Saved');
  }
}
