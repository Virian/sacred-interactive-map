import { useState, useCallback, useMemo, MouseEvent, Dispatch, SetStateAction } from 'react';
import throttle from 'lodash/throttle';

import { Coords } from './types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';

interface UseMoveParams {
  setMapCoordOffset: Dispatch<SetStateAction<Coords>>;
}

interface UseMove {
  mousePosition: Coords;
  isMoving: boolean;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: () => void;
}

const useMove = ({ setMapCoordOffset }: UseMoveParams): UseMove => {
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveDelta, setMoveDelta] = useState<Coords>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Coords>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: MouseEvent) => {
    setMoveDelta({ x: event.clientX, y: event.clientY });
    setIsMoving(true);
  }, []);

  const handleMouseMove = useMemo(
    () => throttle(
      (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY })
        if (isMoving) {
          setMapCoordOffset(currentOffset => {
            const xDelta = moveDelta.x - event.clientX;
            const yDelta = moveDelta.y - event.clientY;

            let newXPos = currentOffset.x + xDelta;
            let newYPos = currentOffset.y + yDelta;

            if (newXPos < 0) {
              newXPos = 0;
            } else if (newXPos > MAP_WIDTH - window.innerWidth) {
              newXPos = MAP_WIDTH - window.innerWidth;
            }

            if (newYPos < 0) {
              newYPos = 0;
            } else if (newYPos > MAP_HEIGHT - window.innerHeight) {
              newYPos = MAP_HEIGHT - window.innerHeight;
            }

            setMoveDelta({ x: event.clientX, y: event.clientY });
            return {
              x: newXPos,
              y: newYPos,
            }
          })
        }
      },
      16,
    ),
    [setMapCoordOffset, isMoving, moveDelta.x, moveDelta.y],
  );

  const handleMouseUp = useCallback(() =>{
    setIsMoving(false);
  }, []);

  return {
    mousePosition,
    isMoving,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

export default useMove;
