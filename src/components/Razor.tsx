import { forwardRef, useState, useEffect, useMemo } from 'react';
import { TextureLoader, Vector3, Mesh, Vector2, Box2 } from 'three';
import React from 'react';
import { useSpring, a } from 'react-spring/three';
import razorSVG from '../svgs/razor.svg';
import { razorWidth, razorHeight } from '../utilities/constants';

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

const mouseLeft = new Vector2();
const mouseRight = new Vector2();

export const updateRazorBox = (razorBox: Box2, mousePos: Vector3, aspect: number) => {
  mouseLeft.set(mousePos.x - razorWidth * aspect, mousePos.y - razorHeight);
  mouseRight.set(mousePos.x + razorWidth * aspect, mousePos.y + razorHeight);
  razorBox.set(mouseLeft, mouseRight);
};

export const updateRazorPosition = (
  razorRef: React.MutableRefObject<Mesh | undefined>,
  mousePos: Vector3,
  aspect: number,
) => {
  if (razorRef.current) {
    razorRef.current.position.set(mousePos.x, mousePos.y - (2.1 / 2) * 0.9 * aspect, mousePos.z);
  }
};
