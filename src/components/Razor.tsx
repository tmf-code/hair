import { forwardRef, useState, useEffect, useMemo } from 'react';
import { TextureLoader } from 'three';
import React from 'react';
import { useSpring, a } from 'react-spring/three';
import razorSVG from './svgs/razor.svg';

type RazorProps = {
  ref: any;
  opacity: number;
  scale: typeof a.mesh['scale'];
  props?: any;
};

export const Razor = forwardRef(({ scale }: RazorProps, ref) => {
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);
  const [mouseUp, setMouseUp] = useState(true);

  useEffect(installUseEffects(setMouseUp), []);

  const { factor } = useSpring({ factor: mouseUp ? 1.1 : 1 });

  return (
    <a.mesh
      ref={ref}
      scale={factor.interpolate((amount: number) => [scale * amount, scale * amount, 1])}
    >
      <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
      <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </a.mesh>
  );
});

function installUseEffects(
  setMouseUp: React.Dispatch<React.SetStateAction<boolean>>,
): React.EffectCallback {
  return () => {
    document.addEventListener('mousedown', () => {
      setMouseUp(false);
    });
    document.addEventListener('touchstart', () => {
      setMouseUp(false);
    });
    document.addEventListener('mouseup', () => {
      setMouseUp(true);
    });
    document.addEventListener('touchend', () => {
      setMouseUp(true);
    });
  };
}
