import { MouseVelocity } from './../../src/drivers/MouseVelocity';
import { MockTouchEvent } from './MockTouchEvent';
import { Vector2 } from 'three';

describe('Initial MouseVelocity State', () => {
  beforeAll(() => {
    MouseVelocity.Reset();
  });

  afterAll(() => {
    MouseVelocity.Reset();
  });

  test('Veloicty Vector should be zero', () => {
    expect(MouseVelocity.VelocityVector()).toStrictEqual(new Vector2(0, 0));
  });

  test('Reset should clear state', () => {
    const data: MouseEventInit = {
      clientX: 100,
      clientY: 100,
    };

    document.dispatchEvent(new MouseEvent('mousemove', data));
    MouseVelocity.Reset();
  });
});

describe('MouseVelocity Interactions', () => {
  describe('MouseVelocity movement events', () => {
    const data: Required<Pick<MouseEventInit, 'clientX' | 'clientY'>> = {
      clientX: 100,
      clientY: 200,
    };

    beforeAll(() => {
      jest.useFakeTimers();
      jest.clearAllTimers();
      MouseVelocity.Reset();
      document.dispatchEvent(new MouseEvent('mousemove', data));
    });

    test('Velocity Vector should be zero', () => {
      expect(MouseVelocity.VelocityVector()).toStrictEqual(new Vector2());
    });

    afterAll(() => {
      MouseVelocity.Reset();
    });
  });

  describe('MouseVelocity velocity events', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
      MouseVelocity.Reset();
    });

    test('Velocity should reset after period', () => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
      jest.advanceTimersByTime(100);
      expect(MouseVelocity.VelocityVector()).toStrictEqual(new Vector2(0, 0));
    });
  });
});

describe('Touch Interactions', () => {
  describe('Touch movement events', () => {
    const touchLocation: [number, number] = [100, 200];
    beforeAll(() => {
      MouseVelocity.Reset();
      const mockTouch = MockTouchEvent.oneTouchAtCoords('touchmove', ...touchLocation);
      document.dispatchEvent(mockTouch);
    });

    afterAll(() => {
      MouseVelocity.Reset();
    });

    test('Velocity Vector should be zero', () => {
      expect(MouseVelocity.VelocityVector()).toStrictEqual(new Vector2());
    });
  });

  describe('Touch velocity events', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
      MouseVelocity.Reset();
    });

    test('Velocity should reset after period', () => {
      document.dispatchEvent(MockTouchEvent.oneTouchAtCoords('touchmove', 100, 200));
      jest.advanceTimersByTime(100);
      expect(MouseVelocity.VelocityVector()).toStrictEqual(new Vector2(0, 0));
    });
  });
});
