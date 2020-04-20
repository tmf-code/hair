import React from 'react';
import './App.css';

import { HairGrid } from './components/hair-grid';

import { Socket } from './drivers/Socket';
import { Hair } from './components/hair';
import { updateState } from './updateLoop';
import { Razor } from './components/razor';

type Vector = [number, number];
type Grid = Vector[];
type Lengths = number[];
type Rotations = number[];

type AppProps = {};

class App extends React.Component {
  constructor(props: AppProps) {
    super(props);
    this.socket = new Socket();
  }

  socket: Socket;
  state = {
    relativelengths: [0] as Lengths,
    absoluteLengths: [0] as Lengths,
    rotations: [0] as Rotations,
    cutHairs: [] as number[],
    grid: [[0, 0]] as Grid,
    cutHairComponents: [] as [number, number, React.ReactElement][],
  };

  componentDidMount() {
    this.update();
  }

  update() {
    const { rotations, grid, relativelengths, absoluteLengths, cutHairs } = updateState(
      this.socket,
    );

    const cutHairComponents = this.createCutHairComponents(
      cutHairs,
      rotations,
      grid,
      absoluteLengths,
    );

    this.sendHairLengths(relativelengths);
    this.setState({
      rotations,
      grid,
      relativelengths,
      absoluteLengths,
      cutHairs: cutHairs,
      cutHairComponents,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  getRemainingCutHairs() {
    const survivalTime = 3000;
    const currentTime = new Date().getTime();
    const lastCutHairComponents = this.state.cutHairComponents.filter(
      ([, startTime]: [number, number, React.ReactElement]) => {
        return currentTime - startTime < survivalTime;
      },
    );

    return lastCutHairComponents;
  }

  createCutHairComponents(
    cutHairs: number[],
    rotations: number[],
    grid: Grid,
    absoluteLengths: Lengths,
  ) {
    const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2.5;
    const thickness = 0.003 * maxDimension;
    // Remove timeout lastCutHairComponents;

    const lastCutHairComponents = this.getRemainingCutHairs();

    const currentTime = new Date().getTime();
    const newCutHairComponents: [number, number, React.ReactElement][] = cutHairs
      .map((cutHairIndex) => {
        const [xPosition, yPosition] = grid[cutHairIndex];
        return [
          cutHairIndex,
          currentTime,

          <Hair
            fall={true}
            key={cutHairIndex}
            rotation={rotations[cutHairIndex]}
            tipX={xPosition}
            tipY={yPosition + Math.min(absoluteLengths[cutHairIndex], 70)}
            bottomLeftX={xPosition - thickness / 2}
            bottomLeftY={yPosition}
            bottomRightX={xPosition + thickness / 2}
            bottomRightY={yPosition}
            color={'black'}
          />,
        ];
      })
      .filter(
        (newCutHair) =>
          !lastCutHairComponents.some((lastCutHair) => lastCutHair[0] === newCutHair[0]),
      ) as [number, number, React.ReactElement][];

    const cutHairComponents = [...lastCutHairComponents, ...newCutHairComponents];

    return cutHairComponents;
  }

  sendHairLengths(relativeLengths: number[]) {
    if (relativeLengths.some((length) => length === 0)) {
      this.socket.socket.emit('updateServerLengths', relativeLengths);
    }
  }

  render() {
    return (
      <div className="App">
        <HairGrid
          cutHairs={this.state.cutHairs}
          lengths={this.state.absoluteLengths}
          rotations={this.state.rotations}
          grid={this.state.grid}
          screenHeight={window.innerHeight}
          screenWidth={window.innerWidth}
        />
        {this.state.cutHairComponents.map(([, , hair]) => hair)}
        <Razor />
      </div>
    );
  }
}

export default App;
