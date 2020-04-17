import { socket } from './socket';

export class Mouse {
  static instance = new Mouse();
  public position: [number, number];

  private constructor() {
    this.position = [0, 0];
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.position = [event.clientX, event.clientY];
      socket.emit('mouse', this.position);
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      this.position = [event.touches[0].clientX, event.touches[0].clientY];
      socket.emit('mouse', this.position);
    });
  }
  static Position(): [number, number] {
    return this.instance.position;
  }
}
