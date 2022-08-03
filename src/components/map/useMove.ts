import {
  useState,
  useCallback,
  useMemo,
  useContext,
  MouseEvent,
  TouchEvent,
} from 'react';
import throttle from 'lodash/throttle';

import { Coords } from '../../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../../constants';
import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';

import { MOUSE_MOVE_THROTTLE_TIMEOUT } from './constants';

interface UseMove {
  isMoving: boolean;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: (event: MouseEvent) => void;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
}

interface UseMoveProps {
  onMoveEnd: (eventCoords: Coords, moveStartingCoords: Coords) => void;
}

const useMove = ({ onMoveEnd }: UseMoveProps): UseMove => {
  const {
    zoomLevel: { scale = 1 },
  } = useContext(ZoomContext);
  const { setMapCoordOffset } = useContext(MapCoordOffsetContext);

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveDelta, setMoveDelta] = useState<Coords>({ x: 0, y: 0 });
  const [moveStartingCoords, setMoveStartingCoords] = useState<Coords>({
    x: 0,
    y: 0,
  });
  const [touchIdentifier, setTouchIdentifier] = useState<number | null>(null);

  const startMoving = useCallback((startingPosition: Coords) => {
    setMoveDelta({ x: startingPosition.x, y: startingPosition.y });
    setMoveStartingCoords({ x: startingPosition.x, y: startingPosition.y });
    setIsMoving(true);
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!touchIdentifier) {
        setTouchIdentifier(event.changedTouches.item(0).identifier);
        startMoving({
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        });
      }
    },
    [startMoving, touchIdentifier]
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      startMoving({ x: event.clientX, y: event.clientY });
    },
    [startMoving]
  );

  const moveMap = useCallback(
    (newTargetPosition: Coords) => {
      if (isMoving) {
        setMapCoordOffset((currentOffset) => {
          const xDelta = moveDelta.x - newTargetPosition.x;
          const yDelta = moveDelta.y - newTargetPosition.y;

          let newXPos = currentOffset.x + xDelta * scale;
          let newYPos = currentOffset.y + yDelta * scale;

          if (newXPos < 0) {
            newXPos = 0;
          } else if (newXPos > MAP_WIDTH - window.innerWidth * scale) {
            newXPos = MAP_WIDTH - window.innerWidth * scale;
          }

          if (newYPos < 0) {
            newYPos = 0;
          } else if (newYPos > MAP_HEIGHT - window.innerHeight * scale) {
            newYPos = MAP_HEIGHT - window.innerHeight * scale;
          }

          setMoveDelta({ x: newTargetPosition.x, y: newTargetPosition.y });
          return {
            x: newXPos,
            y: newYPos,
          };
        });
      }
    },
    [setMapCoordOffset, isMoving, moveDelta.x, moveDelta.y, scale]
  );

  const handleMouseMove = useMemo(
    () =>
      throttle((event: MouseEvent) => {
        moveMap({ x: event.clientX, y: event.clientY });
      }, MOUSE_MOVE_THROTTLE_TIMEOUT),
    [moveMap]
  );

  const handleTouchMove = useMemo(
    () =>
      throttle((event: TouchEvent) => {
        if (typeof touchIdentifier === 'number') {
          // the logic below can be replaced with `identifiedTouch` method once
          // it gets implemented and working
          const changedTouchesCount = event.changedTouches.length;

          for (let i = 0; i < changedTouchesCount; i++) {
            const changedTouch = event.changedTouches.item(i);
            if (changedTouch.identifier === touchIdentifier) {
              moveMap({ x: changedTouch.clientX, y: changedTouch.clientY });
              break;
            }
          }
        }
      }, MOUSE_MOVE_THROTTLE_TIMEOUT),
    [moveMap, touchIdentifier]
  );

  const stopMoving = useCallback(
    (eventCoords: Coords) => {
      onMoveEnd(eventCoords, moveStartingCoords);
      setIsMoving(false);
    },
    [onMoveEnd, moveStartingCoords]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      // prevents mousedown event that would result in calling `stopMoving`
      // twice
      event.preventDefault();
      if (typeof touchIdentifier === 'number') {
        // the logic below can be replaced with `identifiedTouch` method once
        // it gets implemented and working
        const changedTouchesCount = event.changedTouches.length;

        for (let i = 0; i < changedTouchesCount; i++) {
          const changedTouch = event.changedTouches.item(i);
          if (changedTouch.identifier === touchIdentifier) {
            setTouchIdentifier(null);
            stopMoving({ x: changedTouch.clientX, y: changedTouch.clientY });
            break;
          }
        }
      }
    },
    [touchIdentifier, stopMoving]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      stopMoving({ x: event.clientX, y: event.clientY });
    },
    [stopMoving]
  );

  return {
    isMoving,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useMove;
