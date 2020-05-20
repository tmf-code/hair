import { MockTouchEvent } from './MockTouchEvent';
import { Vector2 } from 'three';
import { Mouse } from '../../src/drivers/Mouse';

describe('Initial Mouse State', () => {
  beforeAll(() => {
    Mouse.Reset();
  });

  afterAll(() => {
    Mouse.Reset();
  });
  test('Initial Position should be zero', () => {
    expect(Mouse.Position()).toStrictEqual([0, 0]);
  });

  test('isClicked should be false', () => {
    expect(Mouse.isClicked()).toStrictEqual(false);
  });

  test('Position Vector should be zero', () => {
    expect(Mouse.PositionVector()).toStrictEqual(new Vector2(0, 0));
  });

  test('Veloicty Vector should be zero', () => {
    expect(Mouse.VelocityVector()).toStrictEqual(new Vector2(0, 0));
  });

  test('Reset should clear state', () => {
    const data: MouseEventInit = {
      clientX: 100,
      clientY: 100,
    };

    document.dispatchEvent(new MouseEvent('mousemove', data));
    expect(Mouse.Position()).toStrictEqual([data.clientX, data.clientY]);
    Mouse.Reset();
    expect(Mouse.Position()).toStrictEqual([0, 0]);
  });
});

describe('Mouse Interactions', () => {
  describe('Mouse movement events', () => {
    const { innerWidth } = window;
    const data: Required<Pick<MouseEventInit, 'clientX' | 'clientY'>> = {
      clientX: 100,
      clientY: 200,
    };
    beforeAll(() => {
      Mouse.Reset();
      document.dispatchEvent(new MouseEvent('mousemove', data));
    });

    afterAll(() => {
      Mouse.Reset();
    });
    test('Initial Position should match', () => {
      expect(Mouse.Position()).toStrictEqual([data.clientX, data.clientY]);
    });

    test('Position Vector should match', () => {
      expect(Mouse.PositionVector()).toStrictEqual(new Vector2(data.clientX, data.clientY));
    });

    test('Velocity Vector should be set', () => {
      expect(Mouse.VelocityVector()).toStrictEqual(
        new Vector2(data.clientX / innerWidth, data.clientY / innerWidth),
      );
    });
  });

  describe('Mouse click events', () => {
    beforeEach(() => {
      Mouse.Reset();
    });

    test('Mousedown then mouseup should toggle isClicked', () => {
      document.dispatchEvent(new MouseEvent('mousedown'));
      expect(Mouse.isClicked()).toStrictEqual(true);
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(Mouse.isClicked()).toStrictEqual(false);
    });
    test('Mousedown should set isClicked true', () => {
      document.dispatchEvent(new MouseEvent('mousedown'));
      expect(Mouse.isClicked()).toStrictEqual(true);
    });

    test('Mouseup should set isClicked false', () => {
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(Mouse.isClicked()).toStrictEqual(false);
    });
  });

  describe('Mouse velocity events', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
      Mouse.Reset();
    });

    test('No timeouts functions have been triggered', () => {
      expect(clearTimeout).toHaveBeenCalledTimes(0);
      expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    test('Timeout is triggered on mousemove', () => {
      document.dispatchEvent(new MouseEvent('mousemove', {}));
      expect(clearTimeout).toHaveBeenCalledTimes(0);
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    test('Velocity should reset after period', () => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
      jest.advanceTimersByTime(40);
      expect(Mouse.VelocityVector()).toStrictEqual(new Vector2(0, 0));
    });

    test('Timeout should be cleared after successive mouse moves', () => {
      document.dispatchEvent(new MouseEvent('mousemove', {}));
      document.dispatchEvent(new MouseEvent('mousemove', {}));
      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Touch Interactions', () => {
  describe('Touch movement events', () => {
    const { innerWidth } = window;
    const touchLocation: [number, number] = [100, 200];
    beforeAll(() => {
      Mouse.Reset();
      const mockTouch = MockTouchEvent.oneTouchAtCoords('touchmove', ...touchLocation);
      document.dispatchEvent(mockTouch);
    });

    afterAll(() => {
      Mouse.Reset();
    });
    test('Initial Position should match', () => {
      expect(Mouse.Position()).toStrictEqual(touchLocation);
    });

    test('Position Vector should match', () => {
      expect(Mouse.PositionVector()).toStrictEqual(new Vector2(...touchLocation));
    });

    test('Velocity Vector should be set', () => {
      expect(Mouse.VelocityVector()).toStrictEqual(
        new Vector2(touchLocation[0] / innerWidth, touchLocation[1] / innerWidth),
      );
    });
  });

  describe('Touch click events', () => {
    beforeEach(() => {
      Mouse.Reset();
    });

    test('Touchstart  then touchend should toggle isClicked', () => {
      document.dispatchEvent(new TouchEvent('touchstart'));
      expect(Mouse.isClicked()).toStrictEqual(true);
      document.dispatchEvent(new TouchEvent('touchend'));
      expect(Mouse.isClicked()).toStrictEqual(false);
    });
    test('Mousedown should set isClicked true', () => {
      document.dispatchEvent(new TouchEvent('touchstart'));
      expect(Mouse.isClicked()).toStrictEqual(true);
    });

    test('Mouseup should set isClicked false', () => {
      document.dispatchEvent(new TouchEvent('touchend'));
      expect(Mouse.isClicked()).toStrictEqual(false);
    });
  });

  describe('Touch velocity events', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
      Mouse.Reset();
    });

    test('No timeouts functions have been triggered', () => {
      expect(clearTimeout).toHaveBeenCalledTimes(0);
      expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    test('Timeout is triggered on touchmove', () => {
      document.dispatchEvent(MockTouchEvent.oneTouchAtCoords('touchmove', 100, 200));
      expect(clearTimeout).toHaveBeenCalledTimes(0);
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    test('Velocity should reset after period', () => {
      document.dispatchEvent(MockTouchEvent.oneTouchAtCoords('touchmove', 100, 200));
      jest.advanceTimersByTime(40);
      expect(Mouse.VelocityVector()).toStrictEqual(new Vector2(0, 0));
    });

    test('Timeout should be cleared after successive mouse moves', () => {
      document.dispatchEvent(MockTouchEvent.oneTouchAtCoords('touchmove', 100, 200));
      document.dispatchEvent(MockTouchEvent.oneTouchAtCoords('touchmove', 100, 200));
      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });
  });
});
