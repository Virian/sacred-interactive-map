import { useCallback, useContext } from 'react';

import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';
import { Coords } from '../../types';
import { MAP_SCALE_LEVELS } from '../../constants';
import getOffsetToCenterOnPoint from '../../shared/getOffsetToCenterOnPoint';

const useFocusOnPoint = () => {
  const { zoomLevel, setZoomLevel } = useContext(ZoomContext);
  const { setMapCoordOffset } = useContext(MapCoordOffsetContext);

  const focusOnPoint = useCallback(
    (point: Coords) => {
      let newZoomLevel = zoomLevel;
      if (zoomLevel.scale > 3) {
        newZoomLevel =
          // findLast doesn't work, therefore reversing first
          [...MAP_SCALE_LEVELS].reverse().find(({ scale }) => scale <= 3) ||
          newZoomLevel;
        setZoomLevel(newZoomLevel);
      }
      setMapCoordOffset(getOffsetToCenterOnPoint(point, newZoomLevel.scale));
    },
    [setZoomLevel, zoomLevel, setMapCoordOffset],
  );

  return focusOnPoint;
};

export default useFocusOnPoint;
