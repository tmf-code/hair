import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';

import './styles/App.css';
import { Rotations } from './types/types';
import { Triangles } from './components/Triangles';
import { hairPositions } from './drivers/HairPositions';
import { hairRotations } from './drivers/HairRotations';
import { Socket } from './drivers/Socket';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new Socket();
const App = () => {
  const [hairGrid, setHairPositions] = useState<[number, number][]>([]);
  const [rotations, setRotations] = useState<Rotations>([]);

  setInterval(() => {
    setHairPositions(hairPositions.getPositions());
    setRotations(hairRotations.getRotations());
  }, 1000);

  return (
    <Canvas gl2={false} orthographic={false} pixelRatio={window.devicePixelRatio}>
      <Triangles grid={hairGrid} rotations={rotations} />
    </Canvas>
  );
};

export default App;
