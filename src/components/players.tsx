import React, { useState, useEffect } from 'react';
import { Player as PlayerRenderable } from './player';
import { Players as PlayerManager } from '../drivers/players';

type RazorProps = {
  players: PlayerManager;
  numPlayers: number;
};

const Players = ({ players: playerData, numPlayers }: RazorProps) => {
  const [players, setPlayers] = useState<PlayerManager['players']>({});

  useEffect(() => {
    const interval = setInterval(() => setPlayers(playerData.players), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {Object.values(players).map((player) => (
        <PlayerRenderable updateFrame={player.razor.updateFrame.bind(player.razor)} />
      ))}
    </>
  );
};

export { Players };
