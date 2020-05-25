import React from 'react';
import { Canvas } from 'react-three-fiber';

import io from 'socket.io-client';

import './styles/App.css';
import { Hairs as HairRenderable } from './components/Hairs';
import { HairPositions } from './drivers/HairPositions';
import { HairRotations } from './drivers/HairRotations';
import { Socket, SocketCallbacks } from './drivers/Socket';
import { Razor as RazorRenderable } from './components/Razor';
import { Razor } from './drivers/Razor';
import { HairCuts } from './drivers/HairCuts';
import { HairLengths } from './drivers/HairLengths';
import { widthPoints, heightPoints } from './utilities/constants';
import { Hairs } from './drivers/Hairs';

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
