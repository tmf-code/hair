import React, { useState } from 'react';
import { ColofonText } from './colofon-text';

const Colofon = (): React.ReactElement => {
  const [display, showColofon] = useState(false);
  // react hook useState
  const ToggleColofonState = () => showColofon(!display);
  return (
    <div>
      {display && <ColofonText />}
      <div className="clickableButtonArea" onClick={ToggleColofonState}></div>
      <button id="colofonButton">i</button>
    </div>
  );
};

export { Colofon };
