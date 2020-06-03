import { useThree, useFrame } from 'react-three-fiber';
import React, { useEffect, useState } from 'react';
import { coverFit, coverFit2 } from '../utilities/utilities';
import { mapAspectRatio } from '../utilities/constants';
import { Viewport } from '../types/viewport';
import { Vector3, PerspectiveCamera } from 'three';

type CameraControllerProps = {};

const getScreenLimits = (viewport: Viewport) => {
  const [width, height] = coverFit(viewport.width / viewport.height, mapAspectRatio, 2, 2);

  const left = -width / 2;
  const right = width / 2;
  const top = height / 2;
  const bottom = -height / 2;

  return { left, right, top, bottom };
};

const clampInLimits = (
  camera: PerspectiveCamera,
  limits: { left: number; right: number; top: number; bottom: number },
) => {
  const [wNear, hNear] = coverFit2(1.0, camera.aspect, 2, 2);
  const cameraLeft = +wNear / 2.0;
  const cameraRight = -wNear / 2.0;
  const cameraTop = -hNear / 2.0;
  const cameraBottom = +hNear / 2.0;

  const limitsWithCameraEdges = {
    left: limits.left + cameraLeft,
    right: limits.right + cameraRight,
    top: limits.top + cameraTop,
    bottom: limits.bottom + cameraBottom,
  };

  /**
   * I really have no idea why 4 works here.
   * My goal was to find the camera centerpoint on the game plane (z=0)
   * Add the edges
   * See if the point is outside the game map
   * Then not allowt he camera to continue to move.
   *
   * 4 seems to work perfectly except for the left edge.
   * TODO: Will have to return to this to figure it out further.
   */
  const topLeft = new Vector3(limitsWithCameraEdges.left * 4, limitsWithCameraEdges.top * 4, 0);
  const botRight = new Vector3(
    limitsWithCameraEdges.right * 4,
    limitsWithCameraEdges.bottom * 4,
    0,
  );

  if (camera.position.x < topLeft.x) {
    camera.position.x = topLeft.x;
  }
  if (camera.position.x > botRight.x) {
    camera.position.x = botRight.x;
  }
  if (camera.position.y > topLeft.y) {
    camera.position.y = topLeft.y;
  }
  if (camera.position.y < botRight.y) {
    camera.position.y = botRight.y;
  }

  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  camera.updateMatrix();
};

const CameraController = ({}: CameraControllerProps) => {
  const { viewport, mouse, camera } = useThree();
  const [screenLimits, setScreenLimits] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  useEffect(() => {
    setScreenLimits(getScreenLimits(viewport));
  }, [viewport]);

  const cameraMoveSpeed = 0.05;
  useFrame(() => {
    const isLeftBorder = mouse.x < -0.9;
    const isRightBorder = mouse.x > 0.9;
    const isTopBorder = mouse.y > 0.9;
    const isBottomBorder = mouse.y < -0.9;

    if (isLeftBorder) {
      camera.position.x -= cameraMoveSpeed;
    }

    if (isRightBorder) {
      camera.position.x += cameraMoveSpeed;
    }

    if (isTopBorder) {
      camera.position.y += cameraMoveSpeed;
    }

    if (isBottomBorder) {
      camera.position.y -= cameraMoveSpeed;
    }

    clampInLimits(camera as PerspectiveCamera, screenLimits);
  });

  return <></>;
};

export { CameraController };
