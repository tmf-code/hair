import React from 'react';

type ColofonLinkButtonProps = {
  buttonText: string;
  copyLink: string;
};

const ColofonLinkButton = ({
  buttonText,
  copyLink,
}: ColofonLinkButtonProps): React.ReactElement => {
  const copyCodeToClipboard = (copyLink: string) => {
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = copyLink;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };
  return (
    <div className="linkButtonContainer">
      <button className="copyLinkButton" onClick={() => copyCodeToClipboard(copyLink)}>
        {buttonText}
      </button>
    </div>
  );
};

export { ColofonLinkButton };
