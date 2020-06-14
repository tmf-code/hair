import { sampleInterval, playerLayer } from './../../utilities/constants';
import { Mouse } from '../mouse/mouse';
import { AbstractPlayer } from './abstract-player';
import { cachedMovementCount } from '../../utilities/constants';

type PlayerLocation = { rotation: number; position: [number, number] };

let ids = 0;
export class CurrentPlayer extends AbstractPlayer {
  private bufferedLocations: PlayerLocation[] = [];
  id: number;

  constructor() {
    super();
    this.id = ids++;
    this.setLayer(playerLayer);
    this.startBufferingLocations();
  }

  startBufferingLocations(): void {
    setInterval(() => {
      return requestAnimationFrame(() => this.recordBufferedLocations());
    }, sampleInterval);
  }

  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.setRotationToVertical();
    if (Mouse.isClicked() || Mouse.isSingleTouched()) return 'START_CUTTING';

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    this.smoothedPosition = this.mouse?.toArray() as [number, number];
    this.updateRazorTriangles();
    this.setRazorTransform();
    this.updateRotation();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.position = this.mouse?.toArray() as [number, number];
    this.rotation = Mouse.getDirection();

    this.updateScaleDown();
    this.updateRotation();
    this.updatePosition();
    this.updateRazorTriangles();
    this.setRazorTransform();

    if (!Mouse.isClicked() && !Mouse.isSingleTouched()) {
      return 'STOP_CUTTING';
    }

    return 'CUTTING';
  }

  updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING' {
    this.setRotationToVertical();
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'NOT_CUTTING';
  }

  private setRotationToVertical() {
    Mouse.setDirectionToVertical();
    this.rotation = Mouse.getDirection();
    this.smoothedRotation = this.rotation;
  }

  private recordBufferedLocations() {
    const newLocation = { rotation: this.rotation, position: this.position };
    this.bufferedLocations.unshift(newLocation);
    const bufferIsFull = this.bufferedLocations.length > cachedMovementCount;
    if (bufferIsFull) {
      this.bufferedLocations.pop();
    }
  }

  getLocation(): PlayerLocation[] {
    return this.bufferedLocations;
  }
}
