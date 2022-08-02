import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import { Coords } from '../../types';
import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';
import getMarkerFromSearchParams from '../../getMarkerFromSearchParams';

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
  const [clickedMarker, setClickedMarker] = useState<Marker | null>(() => {
    return getMarkerFromSearchParams() || null;
  });

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (clickedMarker) {
      searchParams.set('x', clickedMarker.x.toString());
      searchParams.set('y', clickedMarker.y.toString());
    }

    window.history.replaceState(null, '', `?${searchParams.toString()}`);
  }, [clickedMarker]);

  const hoveredMarker = useMemo(() => {
    const markersContext = markersLayerRef.current?.getContext('2d');

    // reversing because markers that were drawn later will be displayed on
    // top of those drawn earlier
    return (
      drawnMarkers.reverse().find(({ screenX = 0, screenY = 0 }) => {
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
          drawnMarkers.reverse().find(({ screenX = 0, screenY = 0 }) => {
            const markerBoundingBox = new Path2D();
            markerBoundingBox.rect(screenX, screenY, MARKER_SIZE, MARKER_SIZE);
            return markersContext?.isPointInPath(
              markerBoundingBox,
              eventCoords.x,
              eventCoords.y
            );
          }) || null;

        if (newClickedMarker && newClickedMarker.id === clickedMarker?.id) {
          setClickedMarker(null);
        } else if (newClickedMarker) {
          setClickedMarker(newClickedMarker);
        } else if (!newClickedMarker && clickedMarker) {
          setClickedMarker(null);
        } else if (!newClickedMarker) {
          setClickedMarker({
            id: 'custom',
            label: 'Your location',
            category: 'custom',
            categoryFilterLabel: 'Custom location',
            description: null,
            x: mapCoordOffset.x + eventCoords.x * zoomLevel.scale,
            y: mapCoordOffset.y + eventCoords.y * zoomLevel.scale,
          });
        }
      }
    },
    [drawnMarkers, clickedMarker, mapCoordOffset, zoomLevel.scale]
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
