import React, { useState, useEffect } from 'react';
import { FriendPlayerRazor } from './friend-player-razor';
import { FriendPlayers as FriendPlayersManager } from '../drivers/player/friend-players';

type RazorProps = {
  players: FriendPlayersManager;
};

const FriendPlayers = ({ players: playerData }: RazorProps) => {
  const [players, setPlayers] = useState<FriendPlayersManager['players']>({});

  useEffect(() => {
    const interval = setInterval(() => setPlayers({ ...playerData.players }), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [playerData]);

  return (
    <>
      {Object.values(players).map((player) => (
        <FriendPlayerRazor updateFrame={player.razor.updateFrame.bind(player.razor)} />
      ))}
    </>
  );
};

export { FriendPlayers };
