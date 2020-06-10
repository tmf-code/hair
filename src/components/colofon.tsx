import React, { useState } from 'react';
import { ColofonText } from './colofon-text';

type ColofonProps = {
  roomName: string;
  url: string;
};

const Colofon = ({ roomName, url }: ColofonProps) => {
  const [display, showColofon] = useState(false);
  // react hook useState
  const ToggleColofonState = () => showColofon(!display);
  return (
    <div className="colofon">
      {display && <ColofonText roomName={roomName} url={url} />}
      <button id="colofonButton" onClick={ToggleColofonState}>
        ?
      </button>
    </div>
  );
};

export { Colofon };
