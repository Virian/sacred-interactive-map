import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import throttle from 'lodash/throttle';

import { Coords } from './types';
import { MAP_SCALE_LEVELS, MAP_HEIGHT, MAP_WIDTH } from './constants';

interface UseWheelParams {
  setMapCoordOffset: Dispatch<SetStateAction<Coords>>;
  mousePosition: Coords;
}

const useWheel = ({ setMapCoordOffset, mousePosition }: UseWheelParams) => {
  const [scaleLevel, setScaleLevel] = useState(MAP_SCALE_LEVELS[0]);

  const handleWheel = useMemo(
    () => throttle(
      ({ deltaY }) => {
        if (deltaY < 0) {
          // zooming in
          setScaleLevel((currentScaleLevel) => {
            const currentIndex = MAP_SCALE_LEVELS.indexOf(currentScaleLevel);
            let newScaleLevel = currentScaleLevel;
            if (currentIndex !== 0) {
              newScaleLevel = MAP_SCALE_LEVELS[currentIndex - 1];
            }

            if (currentScaleLevel.level !== newScaleLevel.level) {
              setMapCoordOffset(currentCoordOffset => {
                const currentMouseCoords = {
                  x: currentCoordOffset.x + mousePosition.x * currentScaleLevel.scale,
                  y: currentCoordOffset.y + mousePosition.y * currentScaleLevel.scale,
                }

                return {
                  x: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.x - mousePosition.x * newScaleLevel.scale,
                      MAP_WIDTH - window.innerWidth * newScaleLevel.scale,
                    ),
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.y - mousePosition.y * newScaleLevel.scale,
                      MAP_HEIGHT - window.innerHeight * newScaleLevel.scale,
                    )
                  ),
                }
              })
            }

            return newScaleLevel;
          });
        } else if (deltaY > 0) {
          // zooming out
          setScaleLevel((currentScaleLevel) => {
            const currentIndex = MAP_SCALE_LEVELS.indexOf(currentScaleLevel);
            let newScaleLevel = currentScaleLevel;
            if (currentIndex !== MAP_SCALE_LEVELS.length - 1) {
              newScaleLevel =  MAP_SCALE_LEVELS[currentIndex + 1];
            }

            if (currentScaleLevel.level !== newScaleLevel.level) {
              setMapCoordOffset(currentCoordOffset => {
                const currentMouseCoords = {
                  x: currentCoordOffset.x + mousePosition.x * currentScaleLevel.scale,
                  y: currentCoordOffset.y + mousePosition.y * currentScaleLevel.scale,
                }

                return {
                  x: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.x - mousePosition.x * newScaleLevel.scale,
                      MAP_WIDTH - window.innerWidth * newScaleLevel.scale,
                    ),
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      currentMouseCoords.y - mousePosition.y * newScaleLevel.scale,
                      MAP_HEIGHT - window.innerHeight * newScaleLevel.scale,
                    )
                  ),
                }
              })
            }

            return newScaleLevel
          });
        }
      },
      100,
    ),
    [setMapCoordOffset, mousePosition],
  );

  return { scaleLevel, handleWheel };
};

export default useWheel;
