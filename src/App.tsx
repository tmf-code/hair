import React from 'react';
import './App.css';

import { HairGrid } from './components/hair-grid';

import { Socket } from './drivers/Socket';
import { Mouse } from './drivers/Mouse';

type Vector = [number, number];
type Grid = Vector[];
type Lengths = number[];

type AppProps = {};

class App extends React.Component {
  constructor(props: AppProps) {
    super(props);
    this.socket = new Socket();
  }

  socket: Socket;
  state = {
    grid: [[0, 0]] as Grid,
    lengths: [0] as Lengths,
    mousePosition: [0, 0],
  };

  componentDidMount() {
    this.update();
  }

  update() {
    const { grid: gridRelative, lengths: lengthsRelative } = this.socket;

    const grid = gridRelative.map(
      ([xPos, yPos]) => [xPos * window.innerWidth, yPos * window.innerHeight] as Vector,
    );

    const lengthScalingFactor = Math.max(window.innerWidth, window.innerHeight);

    const lengths = lengthsRelative.map((length) => length * lengthScalingFactor);
    const mousePosition = Mouse.Position();
    const [mouseX, mouseY] = mousePosition;

    // Calcuate trims
    const sqrRadius = 20 * 20;

    const updatedLengths = lengths.map((length: number, lengthIndex: number) => {
      // Mouse hitting
      const [hairX, hairY] = grid[lengthIndex];
      const distanceVector = [hairX - mouseX, hairY - mouseY];
      const isInXRange = Math.abs(distanceVector[0]) < 125;
      const isInYRange = Math.abs(distanceVector[1]) < 25;

      // const sqrDistance =
      //   distanceVector[0] * distanceVector[0] + distanceVector[1] * distanceVector[1];
      // const isMouseOver = sqrDistance < sqrRadius;
      const isMouseOver = isInXRange && isInYRange;

      return isMouseOver ? 0 : length;
    });

    const updatedRelativeLengths = updatedLengths.map((length) => length / lengthScalingFactor);

    if (updatedRelativeLengths.some((length) => length === 0)) {
      this.socket.socket.emit('updateServerLengths', updatedRelativeLengths);
    }

    this.setState({
      ...this.state,
      grid,
      lengths,
      mousePosition,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  render() {
    return (
      <div className="App">
        <HairGrid
          lengths={this.state.lengths}
          grid={this.state.grid}
          screenHeight={window.innerHeight}
          screenWidth={window.innerWidth}
        />
        <div
          className="Cursor"
          style={{ left: this.state.mousePosition[0], top: this.state.mousePosition[1] }}
        />
      </div>
    );
  }
}

export default App;
