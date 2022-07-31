import { useMemo, useContext } from 'react';
import throttle from 'lodash/throttle';

import { MAP_HEIGHT, MAP_WIDTH, MAP_SCALE_LEVELS } from '../../constants';
import { Coords } from '../../types';
import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';

interface UseWheelParams {
  mousePosition: Coords;
}

const useWheel = ({ mousePosition }: UseWheelParams) => {
  const { zoomLevel, setZoomLevel } = useContext(ZoomContext);
  const { setMapCoordOffset } = useContext(MapCoordOffsetContext);

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
    [setMapCoordOffset, setZoomLevel, mousePosition]
  );

  return { zoomLevel, handleWheel };
};

export default useWheel;
