import React from 'react';
import { ColofonLinkButton } from './colofon-link-button';

type ColofonTextProps = {
  roomName: string;
  url: string;
};

const ColofonText = ({ roomName, url }: ColofonTextProps): React.ReactElement => {
  return (
    <div className="colofon-text">
      <h1>Come Shave With Me</h1>
      <p>Shave close with up to 20 friends.</p>
      <p>Share this {roomName}:</p>
      {<ColofonLinkButton defaultButtonText={'Copy link to share'} copyLink={url} />}
      <p>
        Come Shave With Me is a project by{' '}
        <a href={'https://www.tmf.design/about'}>Alexandra Barancová &amp; Jae Perris</a> in
        collaboration with <a href={'https://studiomoniker.com/about'}>Moniker</a>.
      </p>
      <p>
        The project proposes an outlet for social grooming in a time of distancing; Come Shave With
        Me is a virtual skin that people can groom together, online.
      </p>
      <p>
        Sheared silky smooth, maintained mildly prickly or kept rough and bushy… There are countless
        ways you might like it. You won’t know until you try.
      </p>
      <p>
        With public events and gatherings cut down around the world, bodily self-care is – let’s be
        honest – not necessarily a top-most priority. Your arms, armpits, chest, back, genitals, or
        legs are (usually) tucked away during video chats and conferences after all. What part of it
        is just for others’ eyes to see and skins to feel? What do we make of our physical bodies in
        isolation?
      </p>
      <p>
        The virtual world often has neither the patience, nor the infrastructure to accommodate the
        wants and needs of our bodies. Come Shave With Me speculates whether the satisfactions
        enjoyed from bodily grooming could be recreated and shared in virtual spaces.
      </p>
      <p>
        This work is an outcome of Figureable, an artistic research project funded by the Creative
        Industries Fund NL. Figureable explores our relationships to and with our bodies through
        embodiment in games.
      </p>
      <div className="video">
        <iframe
          title="vimeo"
          src="https://player.vimeo.com/video/465902033"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      <p></p>
      <p>This talk presents some of the research and findings from Figureable.</p>
      <img
        className="logo-image"
        src={'/fund-logo-1.png'}
        alt={'Creative Industries Fund NL'}
      ></img>
    </div>
  );
};

export { ColofonText };
