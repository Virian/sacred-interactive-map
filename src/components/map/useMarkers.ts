import { useRef, useState, useMemo, useCallback, useContext } from 'react';

import { Coords } from '../../types';
import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';

import { MARKER_SIZE } from './constants';
import { Marker } from './types';
import calculatePopupTranslate from './calculatePopupTranslate';

interface UseMarkersParams {
  mousePosition: Coords;
}

const useMarkers = ({ mousePosition }: UseMarkersParams) => {
  const { zoomLevel } = useContext(ZoomContext);
  const { mapCoordOffset } = useContext(MapCoordOffsetContext);

  const markersLayerRef = useRef<HTMLCanvasElement>(null);

  const [drawnMarkers, setDrawnMarkers] = useState<Marker[]>([]);
  const [clickedMarker, setClickedMarker] = useState<Marker | null>(null);

  const hoveredMarker = useMemo(() => {
    const markersContext = markersLayerRef.current?.getContext('2d');

    // reversing because markers that were drawn later will be displayed on
    // top of those drawn earlier
    return (
      drawnMarkers.reverse().find(({ screenX, screenY }) => {
        const markerBoundingBox = new Path2D();
        markerBoundingBox.rect(screenX, screenY, MARKER_SIZE, MARKER_SIZE);
        return markersContext?.isPointInPath(
          markerBoundingBox,
          mousePosition.x,
          mousePosition.y
        );
      }) || null
    );
  }, [drawnMarkers, mousePosition]);

  const { x: clickedMarkerTranslateX, y: clickedMarkerTranslateY } = useMemo(
    () =>
      calculatePopupTranslate(clickedMarker, mapCoordOffset, zoomLevel.scale),
    [clickedMarker, mapCoordOffset, zoomLevel.scale]
  );

  const checkMarkerClick = useCallback(
    (eventCoords: Coords, moveStartingCoords: Coords) => {
      if (
        eventCoords.x === moveStartingCoords.x &&
        eventCoords.y === moveStartingCoords.y
      ) {
        const markersContext = markersLayerRef.current?.getContext('2d');

        // reversing because markers that were drawn later will be displayed on
        // top of those drawn earlier
        const newClickedMarker =
          drawnMarkers.reverse().find(({ screenX, screenY }) => {
            const markerBoundingBox = new Path2D();
            markerBoundingBox.rect(screenX, screenY, MARKER_SIZE, MARKER_SIZE);
            return markersContext?.isPointInPath(
              markerBoundingBox,
              eventCoords.x,
              eventCoords.y
            );
          }) || null;

        if (!newClickedMarker) {
          setClickedMarker(null);
        } else if (
          newClickedMarker &&
          newClickedMarker.id === clickedMarker?.id
        ) {
          setClickedMarker(null);
        } else if (newClickedMarker) {
          setClickedMarker(newClickedMarker);
        }
      }
    },
    [drawnMarkers, clickedMarker?.id]
  );

  return {
    markersLayerRef,
    setDrawnMarkers,
    hoveredMarker,
    clickedMarker,
    setClickedMarker,
    clickedMarkerTranslateX,
    clickedMarkerTranslateY,
    checkMarkerClick,
  };
};

export default useMarkers;
