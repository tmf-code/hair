import React from 'react';
import { Canvas } from 'react-three-fiber';

import io from 'socket.io-client';

import './styles/App.css';
import { FriendPlayers } from './drivers/friend-players';
import { FriendPlayers as FriendPlayersRenderable } from './components/friend-players';
import { Hairs as HairRenderable } from './components/hairs';
import { HairPositions } from './drivers/hairs/hair-positions';
import { HairRotations } from './drivers/hairs/hair-rotations';
import { ClientSocket } from './drivers/client-socket';
import { CurrentPlayerRazor as CurrentPlayerRazorRenderable } from './components/current-player-razor';
import { CurrentPlayer } from './drivers/current-player';
import { HairCuts } from './drivers/hairs/hair-cuts';
import { HairLengths } from './drivers/hairs/hair-lengths';
import { widthPoints, heightPoints } from './utilities/constants';
import { Hairs } from './drivers/hairs/hairs';

const hairRotations = new HairRotations(widthPoints * heightPoints);
const hairPositions = new HairPositions(widthPoints * heightPoints);
const hairLengths = new HairLengths(widthPoints * heightPoints);
const hairCuts = new HairCuts(widthPoints * heightPoints);
const currentPlayerRazor = new CurrentPlayer();
const hairs = new Hairs(
  currentPlayerRazor.containsPoint.bind(currentPlayerRazor),
  hairRotations,
  hairPositions,
  hairLengths,
  hairCuts,
);

const players = new FriendPlayers();

const socketCallbacks = {
  setPositions: hairPositions.setPositions.bind(hairPositions),
  setRotations: hairRotations.setInitialRotations.bind(hairRotations),
  setPlayers: players.updatePlayers.bind(players),
  setLengths: hairLengths.updateLengths.bind(hairLengths),
  tickGrowth: hairLengths.grow.bind(hairLengths),
  setRemoteCuts: hairCuts.addFromServer.bind(hairCuts),
  sendLocalCuts: hairCuts.getClientCuts.bind(hairCuts),
  sentLocalCuts: hairCuts.clearClientCuts.bind(hairCuts),
  sendLocation: currentPlayerRazor.getLocation.bind(currentPlayerRazor),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new ClientSocket(io, process.env.NODE_ENV, socketCallbacks);

const App = () => {
  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <FriendPlayersRenderable players={players} />
      <CurrentPlayerRazorRenderable
        updateFrame={currentPlayerRazor.updateFrame.bind(currentPlayerRazor)}
      />
      <HairRenderable
        instanceCount={hairs.instanceCount()}
        updateFrame={hairs.updateFrame.bind(hairs)}
        viewportChange={hairs.setViewport.bind(hairs)}
      />
    </Canvas>
  );
};

export default App;
