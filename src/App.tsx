import React from 'react';
import './App.css';

import { HairGrid } from './components/hair-grid';

import { Socket } from './drivers/Socket';
import { updateState } from './updateLoop';
import { Razor } from './components/razor';

import type { HairLengths, Rotations, Grid, CutHair, Vector2 } from './types/types';
import { Mouse } from './drivers/Mouse';
import { HairDrop } from './components/hair-drop';
import { hairThickness, hairDropColor } from './components/constants';

type AppProps = {};

class App extends React.PureComponent {
  constructor(props: AppProps) {
    super(props);
    this.socket = new Socket();
  }

  socket: Socket;
  state = {
    absoluteLengths: [] as HairLengths,
    rotations: [] as Rotations,
    grid: [] as Grid,
    cutHairs: [] as CutHair[],
  };

  componentDidMount() {
    this.update();

    this.socket.addListener('updateClientGrid', (grid: Grid) => {
      const scaleGrid = (gridRelative: Grid) => {
        const grid = gridRelative.map(
          ([xPos, yPos]) => [xPos * window.innerWidth, yPos * window.innerHeight] as Vector2,
        );

        return grid;
      };

      return this.setState({ grid: scaleGrid(grid) });
    });
    this.socket.addListener('updateClientRotations', (rotations: Rotations) => {
      return this.setState({ rotations });
    });
  }

  update() {
    const { relativeLengths, absoluteLengths, cutHairs: unfilteredCutHairs } = updateState(
      this.socket,
    );

    const lengthsNeedUpdating = !absoluteLengths.every(
      (length, lengthIndex) => length === this.state.absoluteLengths[lengthIndex],
    );

    if (lengthsNeedUpdating) {
      this.setState({
        absoluteLengths,
      });
    }

    if (!Mouse.isClicked()) {
      requestAnimationFrame(this.update.bind(this));
      return;
    }

    const remainingCutHairs = this.getRemainingCutHairs(this.state.cutHairs);
    const newCuts = this.getNewCuts(unfilteredCutHairs, remainingCutHairs);
    const cutHairs = [...remainingCutHairs, ...newCuts];

    const cutsNeedUpdating = cutHairs.length !== this.state.cutHairs.length;

    if (cutsNeedUpdating) {
      console.log('new cuts');
      this.sendHairLengths(relativeLengths);
      this.setState({
        cutHairs,
      });
    }

    requestAnimationFrame(this.update.bind(this));
  }

  getRemainingCutHairs(cutHairs: CutHair[]) {
    const survivalTime = 3000;
    const currentTime = new Date().getTime();
    const lastCutHairComponents = cutHairs.filter(
      ([hairIndex, startTime, hairLength]: [number, number, number]) => {
        return currentTime - startTime < survivalTime;
      },
    );

    return lastCutHairComponents;
  }

  getNewCuts(unfilteredCuts: CutHair[], remainingCutHairs: CutHair[]) {
    const removedDuplicates = unfilteredCuts.filter(
      (newCutHair) => !remainingCutHairs.some((oldCutHairs) => oldCutHairs[0] === newCutHair[0]),
    );

    return removedDuplicates;
  }

  getNewCutHairComponents(newCutHairs: CutHair[], rotations: number[], grid: Grid) {
    const newCutHairComponents: (React.ReactElement | undefined)[] = newCutHairs.map(
      ([cutHairIndex, timeStamp, hairLength]) => {
        if (!grid) {
          return undefined;
        }
        const [xPosition, yPosition] = grid[cutHairIndex];
        return (
          <HairDrop
            key={cutHairIndex}
            rotation={rotations[cutHairIndex]}
            tipX={xPosition}
            tipY={yPosition + Math.min(hairLength, 70)}
            bottomLeftX={xPosition - hairThickness / 2}
            bottomLeftY={yPosition}
            bottomRightX={xPosition + hairThickness / 2}
            bottomRightY={yPosition}
            color={hairDropColor}
          />
        );
      },
    );

    return newCutHairComponents;
  }

  sendHairLengths(relativeLengths: number[]) {
    if (relativeLengths.some((length) => length === 0)) {
      this.socket.socket.emit('updateServerLengths', relativeLengths);
    }
  }

  render() {
    const cutHairComponents = this.getNewCutHairComponents(
      this.state.cutHairs,
      this.state.rotations,
      this.state.grid,
    );

    return (
      <div className="App">
        <HairGrid
          lengths={this.state.absoluteLengths}
          rotations={this.state.rotations}
          grid={this.state.grid}
        />
        {cutHairComponents}
        <Razor />
      </div>
    );
  }
}

export default App;
