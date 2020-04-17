import React, { useState } from 'react';
import './App.css';
import { Hair } from './components/hair';

import { Mouse } from './drivers/Mouse';
import { Socket } from './drivers/Socket';

setInterval(() => Socket.emit('mouse', Mouse.Position()), 100);

const colors = [...new Array(20)]
  .fill('')
  .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

const App: React.FC = () => {
  const [positions, setPositions] = useState<[number, number][]>([]);
  Socket.addListener('Mice Listener', setPositions);

  return (
    <div className="App">
      {positions.map((position, index) => {
        return <Hair color={colors[index]} key={index} tipX={position[0]} tipY={position[1]} />;
      })}
    </div>
  );
};

export default App;
