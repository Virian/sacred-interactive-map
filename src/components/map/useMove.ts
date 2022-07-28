import { useState, useCallback, useMemo, MouseEvent, Dispatch, SetStateAction } from 'react';
import throttle from 'lodash/throttle';

import { Coords } from './types';
import { MAP_WIDTH, MAP_HEIGHT, MOUSE_MOVE_THROTTLE_TIMEOUT } from './constants';

interface UseMoveParams {
  setMapCoordOffset: Dispatch<SetStateAction<Coords>>;
  scale?: number;
}

interface UseMove {
  isMoving: boolean;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: () => void;
}

const useMove = ({ setMapCoordOffset, scale = 1 }: UseMoveParams): UseMove => {
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveDelta, setMoveDelta] = useState<Coords>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: MouseEvent) => {
    setMoveDelta({ x: event.clientX, y: event.clientY });
    setIsMoving(true);
  }, []);

  const handleMouseMove = useMemo(
    () => throttle(
      (event: MouseEvent) => {
        if (isMoving) {
          setMapCoordOffset(currentOffset => {
            const xDelta = moveDelta.x - event.clientX;
            const yDelta = moveDelta.y - event.clientY;

            let newXPos = currentOffset.x + (xDelta * scale);
            let newYPos = currentOffset.y + (yDelta * scale);

            if (newXPos < 0) {
              newXPos = 0;
            } else if (newXPos > MAP_WIDTH - (window.innerWidth * scale)) {
              newXPos = MAP_WIDTH - (window.innerWidth * scale);
            }

            if (newYPos < 0) {
              newYPos = 0;
            } else if (newYPos > MAP_HEIGHT - (window.innerHeight * scale)) {
              newYPos = MAP_HEIGHT - (window.innerHeight * scale);
            }

            setMoveDelta({ x: event.clientX, y: event.clientY });
            return {
              x: newXPos,
              y: newYPos,
            }
          })
        }
      },
      MOUSE_MOVE_THROTTLE_TIMEOUT,
    ),
    [setMapCoordOffset, isMoving, moveDelta.x, moveDelta.y, scale],
  );

  const handleMouseUp = useCallback(() =>{
    setIsMoving(false);
  }, []);

  return {
    isMoving,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

export default useMove;
