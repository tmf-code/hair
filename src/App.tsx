import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';

import './App.css';
import { Rotations } from './types/types';
import { socket } from './drivers/Socket';
import { Triangles } from './components/Triangles';

const App = () => {
  const [hairPositions, setHairPositions] = useState<[number, number][]>([]);
  const [rotations, setRotations] = useState<Rotations>([]);

  setInterval(() => {
    setHairPositions(socket.getHairPositions());
    setRotations(socket.getRotations());
  }, 1000);

  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <Triangles grid={hairPositions} rotations={rotations} />
    </Canvas>
  );
};

export default App;
