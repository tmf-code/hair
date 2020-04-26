import React, { useState, useCallback, useRef, useEffect } from 'react';

const Razor = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handler = useCallback(
    ({ clientX, clientY }) => {
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords],
  );

  useEventListener('mousemove', handler);

  return <div className="Cursor" style={{ left: coords.x, top: coords.y }}></div>;
};

// Hook
function useEventListener(eventName: string, handler: (...args: any[]) => void, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef<typeof handler>();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = (event: Event) => savedHandler.current?.(event);

      element.addEventListener(eventName, eventListener);

      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element], // Re-run if eventName or element changes
  );
}

export { Razor };
