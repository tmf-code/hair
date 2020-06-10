import React from 'react';

type ColofonTextProps = {
  roomName: string;
  url: string;
};

const ColofonText = ({ roomName, url }: ColofonTextProps) => {
  return (
    <div className="colofon-text">
      <h1>Come Shave With Me</h1>
      <p>Shave close with up to 5 friends.</p>
      <p>
        Share this {roomName} at <a href={url}>{url}</a>
      </p>
      <p>A project by</p>
      <ul>
        <li>Alexandra Barancová & Jae Perris</li>
        <li>in collaboration with Moniker</li>
      </ul>
      <p>
        Come Shave With Me is a collaborative web-based work that explores the limits of
        digitally-bound technologies in mediating the bodily aspects of sociality. It is a virtual
        skin that people can groom together, online. As such, the work proposes an outlet for social
        grooming in a time of distancing.
      </p>
      <p>
        With public events and gatherings cut down to an unprecedented minimum around the world,
        bodily self-care is - let’s be honest - not necessarily a top-most priority. Your arms,
        armpits, chest, back, genitals, or legs are (usually) tucked away during video chats and
        conferences after all. What part of it is just for others’ eyes to see and skins to feel?
        What do we make of our physical bodies in isolation? And how do temporalities of bodily
        processes interact with the ‘real-time’ pace of digital media?
      </p>
      <p>
        Bodily processes are an easily overlooked constant to our subjectivity, with the help of
        which we can reflect on a world in flux, like the current pandemic-induced transformations.
        Most people will be able to tell you roughly how much their hair has grown since it all
        started. But the virtual world often has neither the patience, nor the infrastructure to
        accommodate the wants and needs of our bodies. Come Shave With Me speculates whether the
        satisfactions enjoyed from bodily grooming could be recreated and shared in virtual spaces.
        At the same time, it is a reminder of all the bodies sitting behind the screens.
      </p>
      <p>
        This work is an outcome of an artistic research project funded by the Creative Industries
        Fund NL, entitled Figureable. Figureable explores our relationships to and with our bodies
        through embodiment in games.
      </p>
      {/* <p>The project was funded by the Creative Industries Fund NL.</p> */}
      <img
        className="logo-image"
        src={'/fund-logo-3.png'}
        alt={'Creative Industries Fund NL'}
      ></img>
    </div>
  );
};

export { ColofonText };
