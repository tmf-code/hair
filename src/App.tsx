import React, { useState } from 'react';
import './App.css';

import { Mouse } from './drivers/Mouse';
import { Socket } from './drivers/Socket';
import { HairGrid } from './components/hair-grid';

setInterval(() => Socket.emit('mouse', Mouse.Position()), 100);

const colors = [...new Array(20)]
  .fill('')
  .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

const App: React.FC = () => {
  const [positions, setPositions] = useState<[number, number][]>([]);
  Socket.addListener('Mice Listener', setPositions);

  return (
    <>
      <div className="App">
        <HairGrid screenHeight={window.innerHeight} screenWidth={window.innerWidth} />
        {/* {positions.map((position, index) => {
      })} */}
      </div>
    </>
  );
};

export default App;
