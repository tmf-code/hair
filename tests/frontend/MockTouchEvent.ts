class MockTouch implements Touch {
  readonly altitudeAngle: number = 0;
  readonly azimuthAngle: number = 0;
  readonly clientX: number = 0;
  readonly clientY: number = 0;
  readonly force: number = 0;
  readonly identifier: number = 0;
  readonly pageX: number = 0;
  readonly pageY: number = 0;
  readonly radiusX: number = 0;
  readonly radiusY: number = 0;
  readonly rotationAngle: number = 0;
  readonly screenX: number = 0;
  readonly screenY: number = 0;
  readonly target: EventTarget = document;
  readonly touchType: TouchType = 'direct';
  static atCoords(clientX: number, clientY: number) {
    return new MockTouch(clientX, clientY);
  }
  private constructor(clientX: number, clientY: number) {
    this.clientX = clientX;
    this.clientY = clientY;
  }
}

class MockTouchList implements TouchList {
  [index: number]: MockTouch;
  length: number = 1;
  item(index: number): MockTouch {
    return this[0];
  }

  private constructor(clientX?: number, clientY?: number) {
    if (clientX !== undefined && clientY !== undefined) {
      this[0] = MockTouch.atCoords(clientX, clientY);
    }
  }

  static oneTouchAtCoords(clientX: number, clientY: number) {
    return new MockTouchList(clientX, clientY);
  }

  static noTouches() {
    return new MockTouchList();
  }
  [Symbol.iterator](): IterableIterator<Touch> {
    throw new Error('Method not implemented.');
  }
}

export class MockTouchEvent extends Event implements TouchEvent {
  altKey: boolean = false;
  changedTouches: TouchList = MockTouchList.noTouches();
  ctrlKey: boolean = false;
  metaKey: boolean = false;
  shiftKey: boolean = false;
  targetTouches: TouchList = MockTouchList.noTouches();
  touches: TouchList;
  detail: number = 0;
  view: Window = window;
  which: number = 0;

  private constructor(type: string, clientX: number, clientY: number) {
    super(type);
    this.touches = MockTouchList.oneTouchAtCoords(clientX, clientY);
  }

  static oneTouchAtCoords(type: string, clientX: number, clientY: number) {
    return new MockTouchEvent(type, clientX, clientY);
  }
}
