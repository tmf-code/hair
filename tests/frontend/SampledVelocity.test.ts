import { SampledVelocity } from '../../src/drivers/SampledVelocity';

jest.useFakeTimers();
const sampleInterval = 1;
describe('SampledVelocity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('getVelocity should return zero', () => {
    const getPosition = () => [100, 100] as [number, number];
    const mouseVelocity = new SampledVelocity(sampleInterval, getPosition);
    expect(mouseVelocity.getVelocity()).toStrictEqual([0, 0]);
  });

  test('clear cleans up interval', () => {
    const position: [number, number] = [50, 50];
    const getPosition = () => position as [number, number];
    const mouseVelocity = new SampledVelocity(sampleInterval, getPosition);

    expect(setInterval).toBeCalledTimes(1);
    mouseVelocity.clear();
    expect(clearInterval).toBeCalledTimes(1);
  });

  test('getVelocity should return a value after one sample', () => {
    const position: [number, number] = [50, 50];
    const getPosition = () => position as [number, number];
    const mouseVelocity = new SampledVelocity(sampleInterval, getPosition);
    jest.advanceTimersByTime(sampleInterval);
    expect(mouseVelocity.getVelocity()).toStrictEqual(position);
  });

  test('getVelocity should return zero on no movement', () => {
    const position: [number, number] = [50, 50];
    const getPosition = () => position as [number, number];
    const mouseVelocity = new SampledVelocity(sampleInterval, getPosition);

    jest.advanceTimersByTime(sampleInterval);
    jest.advanceTimersByTime(sampleInterval);

    expect(mouseVelocity.getVelocity()).toStrictEqual([0, 0]);
  });
});
