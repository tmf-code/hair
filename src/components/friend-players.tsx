import React, { useState, useEffect, useMemo } from 'react';
import { FriendPlayerRazor } from './friend-player-razor';
import { FriendPlayers as FriendPlayersManager } from '../drivers/player/friend-players';
import razorSVG from '../images/friend-razor.png';
import { TextureLoader } from 'three';
type RazorProps = {
  players: FriendPlayersManager;
};

const FriendPlayers = ({ players: playerData }: RazorProps) => {
  const [players, setPlayers] = useState<FriendPlayersManager['players']>({});
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);

  useEffect(() => {
    const interval = setInterval(() => setPlayers({ ...playerData.players }), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [playerData]);

  return (
    <>
      {Object.values(players).map((player, playerIndex) => (
        <FriendPlayerRazor
          texture={texture}
          key={playerIndex}
          updateFrame={player.razor.updateFrame.bind(player.razor)}
        />
      ))}
    </>
  );
};

export { FriendPlayers };
