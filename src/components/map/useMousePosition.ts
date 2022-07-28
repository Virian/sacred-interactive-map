import { useState, useMemo, MouseEvent } from 'react';
import throttle from 'lodash/throttle';

import { Coords } from './types';
import { MOUSE_MOVE_THROTTLE_TIMEOUT } from './constants';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Coords>({ x: 0, y: 0 });

  const handleMouseMove = useMemo(
    () => throttle(
      (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY })
      },
      MOUSE_MOVE_THROTTLE_TIMEOUT,
    ),
    [],
  );

  return {
    mousePosition,
    handleMouseMove,
  }
}

export default useMousePosition;
