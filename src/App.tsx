import React from 'react';
import { Canvas } from 'react-three-fiber';

import io from 'socket.io-client';

import './styles/App.css';
import { Hairs as HairRenderable } from './components/hairs';
import { HairPositions } from './drivers/hairs/hair-positions';
import { HairRotations } from './drivers/hairs/hair-rotations';
import { Socket, SocketCallbacks } from './drivers/socket';
import { Razor as RazorRenderable } from './components/razor';
import { Razor } from './drivers/razor';
import { HairCuts } from './drivers/hairs/hair-cuts';
import { HairLengths } from './drivers/hairs/hair-lengths';
import { widthPoints, heightPoints } from './utilities/constants';
import { Hairs } from './drivers/hairs/hairs';

const hairRotations = new HairRotations(widthPoints * heightPoints);
const hairPositions = new HairPositions(widthPoints * heightPoints);
const hairLengths = new HairLengths(widthPoints * heightPoints);
const hairCuts = new HairCuts(widthPoints * heightPoints);
const razor = new Razor();
const hairs = new Hairs(
  razor.containsPoint.bind(razor),
  hairRotations,
  hairPositions,
  hairLengths,
  hairCuts,
);

const socketCallbacks: SocketCallbacks = {
  setPositions: hairPositions.setPositions.bind(hairPositions),
  setRotations: hairRotations.setInitialRotations.bind(hairRotations),
  setLengths: hairLengths.updateLengths.bind(hairLengths),
  tickGrowth: hairLengths.grow.bind(hairLengths),
  setRemoteCuts: hairCuts.addFromServer.bind(hairCuts),
  sendLocalCuts: hairCuts.getClientCuts.bind(hairCuts),
  sentLocalCuts: hairCuts.clearClientCuts.bind(hairCuts),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new Socket(io, process.env.NODE_ENV, socketCallbacks);

const App = () => {
  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <RazorRenderable updateFrame={razor.updateFrame.bind(razor)} />
      <HairRenderable
        instanceCount={hairs.instanceCount()}
        updateFrame={hairs.updateFrame.bind(hairs)}
        viewportChange={hairs.setViewport.bind(hairs)}
      />
    </Canvas>
  );
};

export default App;
