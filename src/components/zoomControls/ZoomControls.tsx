import { useCallback, useContext } from 'react';

import { MAP_HEIGHT, MAP_WIDTH, MAP_SCALE_LEVELS } from '../../constants';
import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';

import './ZoomControls.scss';

enum ZoomDirection {
  IN,
  OUT,
}

const ZoomControls = () => {
  const { setZoomLevel } = useContext(ZoomContext);
  const { setMapCoordOffset } = useContext(MapCoordOffsetContext);

  const handleZoomChange = useCallback(
    (direction: ZoomDirection) => {
      if (direction === ZoomDirection.IN) {
        setZoomLevel((currentZoomLevel) => {
          const currentIndex = MAP_SCALE_LEVELS.indexOf(currentZoomLevel);
          let newZoomLevel = currentZoomLevel;
          if (currentIndex !== 0) {
            newZoomLevel = MAP_SCALE_LEVELS[currentIndex - 1];
          }

          if (currentZoomLevel.levelNumber !== newZoomLevel.levelNumber) {
            setMapCoordOffset((currentCoordOffset) => {
              const currentCenterCoords = {
                x:
                  currentCoordOffset.x +
                  (window.innerWidth / 2) * currentZoomLevel.scale,
                y:
                  currentCoordOffset.y +
                  (window.innerHeight / 2) * currentZoomLevel.scale,
              };

              return {
                x: Math.max(
                  0,
                  Math.min(
                    currentCenterCoords.x -
                      (window.innerWidth / 2) * newZoomLevel.scale,
                    MAP_WIDTH - window.innerWidth * newZoomLevel.scale,
                  ),
                ),
                y: Math.max(
                  0,
                  Math.min(
                    currentCenterCoords.y -
                      (window.innerHeight / 2) * newZoomLevel.scale,
                    MAP_HEIGHT - window.innerHeight * newZoomLevel.scale,
                  ),
                ),
              };
            });
          }

          return newZoomLevel;
        });
      } else if (direction === ZoomDirection.OUT) {
        setZoomLevel((currentZoomLevel) => {
          const currentIndex = MAP_SCALE_LEVELS.indexOf(currentZoomLevel);
          let newZoomLevel = currentZoomLevel;
          if (currentIndex !== MAP_SCALE_LEVELS.length - 1) {
            newZoomLevel = MAP_SCALE_LEVELS[currentIndex + 1];
          }

          if (currentZoomLevel.levelNumber !== newZoomLevel.levelNumber) {
            setMapCoordOffset((currentCoordOffset) => {
              const currentCenterCoords = {
                x:
                  currentCoordOffset.x +
                  (window.innerWidth / 2) * currentZoomLevel.scale,
                y:
                  currentCoordOffset.y +
                  (window.innerHeight / 2) * currentZoomLevel.scale,
              };

              return {
                x: Math.max(
                  0,
                  Math.min(
                    currentCenterCoords.x -
                      (window.innerWidth / 2) * newZoomLevel.scale,
                    MAP_WIDTH - window.innerWidth * newZoomLevel.scale,
                  ),
                ),
                y: Math.max(
                  0,
                  Math.min(
                    currentCenterCoords.y -
                      (window.innerHeight / 2) * newZoomLevel.scale,
                    MAP_HEIGHT - window.innerHeight * newZoomLevel.scale,
                  ),
                ),
              };
            });
          }

          return newZoomLevel;
        });
      }
    },
    [setMapCoordOffset, setZoomLevel],
  );

  return (
    <div className="ZoomControls">
      <button
        className="ZoomControls__Button"
        onClick={() => handleZoomChange(ZoomDirection.IN)}
      >
        +
      </button>
      <div className="ZoomControls__Separator" />
      <button
        className="ZoomControls__Button"
        onClick={() => handleZoomChange(ZoomDirection.OUT)}
      >
        -
      </button>
    </div>
  );
};

export default ZoomControls;
