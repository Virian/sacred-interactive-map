import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import throttle from 'lodash/throttle';

import { Coords } from './types';
import {
  MAP_SCALE_LEVELS,
  INITIAL_SCALE_LEVEL,
  MAP_HEIGHT,
  MAP_WIDTH,
} from './constants';

interface UseWheelParams {
  setMapCoordOffset: Dispatch<SetStateAction<Coords>>;
  mousePosition: Coords;
}

const useWheel = ({ setMapCoordOffset, mousePosition }: UseWheelParams) => {
  const [zoomLevel, setZoomLevel] = useState(INITIAL_SCALE_LEVEL);

  const handleWheel = useMemo(
    () =>
      throttle(({ deltaY }) => {
        if (deltaY < 0) {
          // zooming in
          setZoomLevel((currentZoomLevel) => {
            const currentIndex = MAP_SCALE_LEVELS.indexOf(currentZoomLevel);
            let newZoomLevel = currentZoomLevel;
            if (currentIndex !== 0) {
              newZoomLevel = MAP_SCALE_LEVELS[currentIndex - 1];
            }

            if (currentZoomLevel.levelNumber !== newZoomLevel.levelNumber) {
              setMapCoordOffset((currentCoordOffset) => {
                const currentMouseCoords = {
                  x:
                    currentCoordOffset.x +
                    mousePosition.x * currentZoomLevel.scale,
                  y:
                    currentCoordOffset.y +
                    mousePosition.y * currentZoomLevel.scale,
                };

                return {
                  x: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.x -
                        mousePosition.x * newZoomLevel.scale,
                      MAP_WIDTH - window.innerWidth * newZoomLevel.scale
                    )
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.y -
                        mousePosition.y * newZoomLevel.scale,
                      MAP_HEIGHT - window.innerHeight * newZoomLevel.scale
                    )
                  ),
                };
              });
            }

            return newZoomLevel;
          });
        } else if (deltaY > 0) {
          // zooming out
          setZoomLevel((currentZoomLevel) => {
            const currentIndex = MAP_SCALE_LEVELS.indexOf(currentZoomLevel);
            let newZoomLevel = currentZoomLevel;
            if (currentIndex !== MAP_SCALE_LEVELS.length - 1) {
              newZoomLevel = MAP_SCALE_LEVELS[currentIndex + 1];
            }

            if (currentZoomLevel.levelNumber !== newZoomLevel.levelNumber) {
              setMapCoordOffset((currentCoordOffset) => {
                const currentMouseCoords = {
                  x:
                    currentCoordOffset.x +
                    mousePosition.x * currentZoomLevel.scale,
                  y:
                    currentCoordOffset.y +
                    mousePosition.y * currentZoomLevel.scale,
                };

                return {
                  x: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.x -
                        mousePosition.x * newZoomLevel.scale,
                      MAP_WIDTH - window.innerWidth * newZoomLevel.scale
                    )
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.y -
                        mousePosition.y * newZoomLevel.scale,
                      MAP_HEIGHT - window.innerHeight * newZoomLevel.scale
                    )
                  ),
                };
              });
            }

            return newZoomLevel;
          });
        }
      }, 100),
    [setMapCoordOffset, mousePosition]
  );

  return { zoomLevel, handleWheel };
};

export default useWheel;
