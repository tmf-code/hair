import React, { useState } from 'react';

type ColofonLinkButtonProps = {
  defaultButtonText: string;
  copyLink: string;
};

const ColofonLinkButton = ({
  defaultButtonText,
  copyLink,
}: ColofonLinkButtonProps): React.ReactElement => {
  const [buttonText, setButtonText] = useState(defaultButtonText);
  const changeText = (text: string) => setButtonText(text);

  const copyCodeToClipboard = (copyLink: string) => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = copyLink;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    changeText('Copied!');
    setTimeout(() => {
      changeText(defaultButtonText);
    }, 2000);
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
