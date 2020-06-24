import React, { useState } from 'react';

type ColofonLinkButtonProps = {
  buttonText: string;
  copyLink: string;
};

const ColofonLinkButton = ({
  buttonText,
  copyLink,
}: ColofonLinkButtonProps): React.ReactElement => {
  const [isShowingTooltip, setTooltipState] = useState(false);
  const copyCodeToClipboard = (copyLink: string) => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = copyLink;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    setTooltipState(true);
    setTimeout(() => {
      setTooltipState(false);
    }, 2000);
  };
  return (
    <div className="linkButtonContainer">
      <button className="copyLinkButton" onClick={() => copyCodeToClipboard(copyLink)}>
        <div style={{ visibility: isShowingTooltip ? 'hidden' : 'visible' }}>{buttonText}</div>
        <div
          className="copyLinkTooltip"
          style={{ visibility: isShowingTooltip ? 'visible' : 'hidden' }}
        >
          Copied!
        </div>
      </button>
    </div>
  );
};

export { ColofonLinkButton };
