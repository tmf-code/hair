import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';

import io from 'socket.io-client';

import './styles/App.css';
import { Rotations } from './types/types';
import { Hairs } from './components/Hairs';
import { hairPositions } from './drivers/HairPositions';
import { hairRotations } from './drivers/HairRotations';
import { Socket } from './drivers/Socket';
import { Razor } from './components/Razor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new Socket(io, process.env.NODE_ENV);
const razor = new Razor();
const hairs = new Hairs();
const App = () => {
  const [hairGrid, setHairPositions] = useState<[number, number][]>([]);
  const [rotations, setRotations] = useState<Rotations>([]);

  setInterval(() => {
    setHairPositions(hairPositions.getPositions());
    setRotations(hairRotations.getRotations());
  }, 1000);

  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <razor.screenElement />
      <hairs.screenElement
        grid={hairGrid}
        rotations={rotations}
        razorContainsPoint={razor.containsPoint.bind(razor)}
      />
    </Canvas>
  );
};

export default App;
