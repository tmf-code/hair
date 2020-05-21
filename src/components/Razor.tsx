import { useState, useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Vector3, Mesh, Vector2, Box2 } from 'three';
import React from 'react';
import { useSpring, a } from 'react-spring/three';
import razorSVG from '../svgs/razor.svg';
import { razorWidth, razorHeight } from '../utilities/constants';
import { Position2D } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import { mouseToWorld } from '../utilities/utilities';

type RazorProps = {};

export class Razor {
  private mouseLeft = new Vector2();
  private mouseRight = new Vector2();
  private razorRef: React.MutableRefObject<Mesh | undefined> | undefined;
  private razorBox = new Box2();
  private aspect = 1.0;

  update(mousePos: Vector3, aspect: number) {
    this.aspect = aspect;
    this.updateRazorBox(mousePos);
    this.updateRazorPosition(mousePos);
  }

  containsPoint([xPos, yPos]: Position2D) {
    return this.razorBox.containsPoint(new Vector2(xPos, yPos));
  }

  private updateRazorBox(mousePos: Vector3) {
    this.mouseLeft.set(mousePos.x - razorWidth * this.aspect, mousePos.y - razorHeight);
    this.mouseRight.set(mousePos.x + razorWidth * this.aspect, mousePos.y + razorHeight);
    this.razorBox.set(this.mouseLeft, this.mouseRight);
  }

  private updateRazorPosition(mousePos: Vector3) {
    if (this.razorRef?.current) {
      this.razorRef.current.position.set(
        mousePos.x,
        mousePos.y - (2.1 / 2) * 0.9 * this.aspect,
        mousePos.z,
      );
      this.razorRef.current.matrixWorldNeedsUpdate = true;
    }
  }

  screenElement = () => {
    const { mouse, camera, aspect } = useThree();
    const texture = useMemo(() => new TextureLoader().load(razorSVG), []);
    const [mouseUp, setMouseUp] = useState(true);

    this.razorRef = useRef<Mesh>();
    this.aspect = aspect;

    useEffect(this.installUseEffects(setMouseUp), []);

    const { factor } = useSpring({ factor: mouseUp ? 1.1 : 1 });

    useFrame(() => {
      const mousePos = mouseToWorld(mouse, camera);
      this.updateRazorBox(mousePos);
      this.updateRazorPosition(mousePos);
    });

    return (
      <a.mesh
        ref={this.razorRef}
        scale={factor.interpolate((amount: number) => [
          this.aspect * amount,
          this.aspect * amount,
          1,
        ])}
      >
        <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
        <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
      </a.mesh>
    );
  };
  private installUseEffects = (
    setMouseUp: React.Dispatch<React.SetStateAction<boolean>>,
  ): React.EffectCallback => () => {
    document.addEventListener('mousedown', () => setMouseUp(false));
    document.addEventListener('touchstart', () => setMouseUp(false));
    document.addEventListener('mouseup', () => setMouseUp(true));
    document.addEventListener('touchend', () => setMouseUp(true));
  };
}
