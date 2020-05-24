import React from 'react';
import { Canvas } from 'react-three-fiber';

import io from 'socket.io-client';

import './styles/App.css';
import { Hairs } from './components/Hairs';
import { HairPositions } from './drivers/HairPositions';
import { HairRotations } from './drivers/HairRotations';
import { Socket } from './drivers/Socket';
import { Razor } from './components/Razor';
import { HairCuts } from './drivers/HairCuts';
import { HairLengths } from './drivers/HairLengths';

const hairRotations = new HairRotations();
const hairPositions = new HairPositions();
const hairLengths = new HairLengths([]);
const hairCuts = new HairCuts(hairLengths);
const razor = new Razor();
const hairs = new Hairs(hairRotations, hairPositions, hairLengths, hairCuts);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new Socket(
  io,
  process.env.NODE_ENV,
  hairCuts,
  hairLengths,
  hairPositions,
  hairRotations,
);

const App = () => {
  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <razor.screenElement />
      <hairs.screenElement razorContainsPoint={razor.containsPoint.bind(razor)} />
    </Canvas>
  );
};

export default App;
