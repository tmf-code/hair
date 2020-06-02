import React from 'react';

const ColofonText = (): React.ReactElement => {
  return (
    <div className="colofon-text">
      <h1>_title_</h1>
      <p>A project by</p>
      <ul>
        <li>Alexandra Barancová</li>
        <li>Jae Perris</li>
        <li>Roel Wouters</li>
      </ul>
      <p>The project was funded by the Creative Industries Fund NL.</p>
      <img
        className="logo-image"
        src={'/fund-logo-3.png'}
        alt={'Creative Industries Fund NL'}
      ></img>
    </div>
  );
};

export { ColofonText };
