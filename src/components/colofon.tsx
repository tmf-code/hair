import React, { useState } from 'react';
import { ColofonText } from './colofon-text';

type ColofonProps = {
  roomName: string;
  url: string;
};

const Colofon = ({ roomName, url }: ColofonProps): React.ReactElement => {
  const [display, showColofon] = useState(false);
  // react hook useState
  const ToggleColofonState = () => showColofon(!display);
  return (
    <div className="colofon">
      {display && <ColofonText roomName={formattedRoomName()} url={window.location.href} />}
      {display && <button className="closeButton" onClick={ToggleColofonState}></button>}
      {!display && (
        <button className="questionmarkButton" id="colofonButton" onClick={ToggleColofonState}>
          ?
        </button>
      )}
    </div>
  );
};

const formattedRoomName = () => {
  const removedHash = window.location.hash.replace('#', '');
  const selectDash = new RegExp(/(-)/, 'g');
  return removedHash.replace(selectDash, ' ');
};

export { Colofon };
