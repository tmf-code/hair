import { triangleGeometry } from './Triangle';
import { Grid, Rotations, HairLengths } from '../types/types';
import { useThree, useFrame } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import React, { useMemo, useRef, useState, forwardRef } from 'react';
import { socket } from '../drivers/Socket';
import {
  Object3D,
  InstancedMesh,
  MeshBasicMaterial,
  Color,
  Vector2,
  Box2,
  Vector3,
  TextureLoader,
  Mesh,
} from 'three';
import { lerp, mouseToWorld } from './utilities';
import { hairColor, razorWidth, razorHeight, swirlRadius } from './constants';
import { Mouse } from '../drivers/Mouse';

import razorPNG from './svgs/razor.svg';

type TrianglesProps = {
  grid: Grid;
  rotations: Rotations;
};

type ViewportDimensions = {
  width: number;
  height: number;
};

const calculatePositions = function (grid: Grid, viewport: ViewportDimensions) {
  return grid.map(([xPos, yPos]) => relativeToWorld(new Vector2(xPos, yPos), viewport));
};

/** This component loads an image and projects it onto a plane */
const Image = forwardRef(
  (
    {
      url,
      scale,
    }: {
      ref: any;
      url: string;
      opacity: number;
      scale: typeof a.mesh['scale'];
      props?: any;
    },
    ref,
  ) => {
    const texture = useMemo(() => new TextureLoader().load(url), [url]);
    const [mouseUp, setMouseUp] = useState(true);

    window.addEventListener('mousedown', () => {
      setMouseUp(false);
    });
    window.addEventListener('touchstart', () => {
      setMouseUp(false);
    });
    window.addEventListener('mouseup', () => {
      setMouseUp(true);
    });
    window.addEventListener('touchend', () => {
      setMouseUp(true);
    });

    const { factor } = useSpring({ factor: mouseUp ? 1.1 : 1 });

    return (
      <a.mesh ref={ref} scale={factor.interpolate((f: number) => [scale * f, scale * f, 1])}>
        <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
        <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
      </a.mesh>
    );
  },
);

const relativeToWorld = function (
  { x, y }: Vector2,
  { width, height }: { width: number; height: number },
) {
  return [lerp(-width / 2.0, width / 2.0, x), lerp(height / 2.0, -height / 2.0, y)];
};

const mouseLeft = new Vector2();
const mouseRight = new Vector2();
const razorBox = new Box2();
const transformHolder = new Object3D();

let lastLengths: HairLengths = [];

let rotationOffsets: Rotations = [];

const Triangles = ({ grid, rotations }: TrianglesProps) => {
  const { viewport, mouse, camera } = useThree();

  const hairGeo = useMemo(() => triangleGeometry(viewport.width), [viewport.width]);
  const positions = useMemo(() => calculatePositions(grid, viewport), [grid, viewport]);

  const ref = useRef<InstancedMesh>();
  const razorRef = useRef<Mesh>();
  useFrame(() => {
    lastLengths = socket.lengths;

    if (!ref.current) return;
    if (socket.lengths.length === 0) return;
    if (grid.length === 0) return;
    if (rotationOffsets.length === 0) rotationOffsets = grid.map(() => 0);
    ref.current.instanceMatrix.needsUpdate = true;

    const mousePos = mouseToWorld(mouse, camera);
    mouseLeft.set(mousePos.x - razorWidth, mousePos.y - razorHeight);
    mouseRight.set(mousePos.x + razorWidth, mousePos.y + razorHeight);
    razorBox.set(mouseLeft, mouseRight);

    if (razorRef.current) {
      razorRef.current.position.set(mousePos.x, mousePos.y - (2.1 / 2) * 0.9, mousePos.z);
    }

    // Update display
    lastLengths.forEach((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const rotation = rotations[lengthIndex] + rotationOffsets[lengthIndex];

      transformHolder.position.set(xPos, yPos, 0);
      transformHolder.rotation.set(0, 0, rotation);
      transformHolder.scale.set(1, length, 1);
      transformHolder.updateMatrix();
      ref.current?.setMatrixAt(lengthIndex, transformHolder.matrix);
    });

    const cutAffect = lastLengths.map((length, lengthIndex) => {
      const [xPos, yPos] = positions[lengthIndex];
      const hover = razorBox.containsPoint(new Vector2(xPos, yPos));
      return hover && Mouse.isClicked();
    });

    const swirlAffect = lastLengths.map((length, lengthIndex) => {
      const directionVector = Mouse.VelocityVector().normalize();
      const [xPos, yPos] = positions[lengthIndex];
      const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
      const hover = distance < swirlRadius;
      const shouldSwirl = hover && !Mouse.isClicked() && Mouse.VelocityVector().length() > 0.001;
      return shouldSwirl
        ? directionVector.multiplyScalar(1 - distance / swirlRadius)
        : new Vector2(0, 0);
    });

    rotationOffsets = swirlAffect.map((swirlAmount, hairIndex) => {
      const rotationDifference =
        Math.atan2(swirlAmount.y, swirlAmount.x) - rotationOffsets[hairIndex];
      const newRotation =
        rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
      return newRotation;
    });

    socket.updateCuts(cutAffect);
  });

  return (
    <>
      <Image ref={razorRef} scale={1} opacity={1} url={razorPNG}></Image>
      <instancedMesh
        ref={ref}
        args={[hairGeo, new MeshBasicMaterial({ color: new Color(hairColor) }), grid.length]}
      ></instancedMesh>
    </>
  );
};

export { Triangles };
