import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import type { Coords, Marker } from '../../types';
import FiltersContext from '../../context/FiltersContext';
import ClickedMarkerContext from '../../context/ClickedMarkerContext';
import MapStateContext from '../../context/MapStateContext';

import calculatePopupTranslate from './calculatePopupTranslate';
import { CUSTOM_MARKER_SIZE } from './constants';

interface UseMarkersParams {
  mousePosition: Coords;
}

const useMarkers = ({ mousePosition }: UseMarkersParams) => {
  const {
    state: { coordOffset, zoomLevel },
  } = useContext(MapStateContext);
  const { filters } = useContext(FiltersContext);
  const { clickedMarker, setClickedMarker } = useContext(ClickedMarkerContext);

  const markersLayerRef = useRef<HTMLCanvasElement>(null);

  const [drawnMarkers, setDrawnMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (clickedMarker) {
      searchParams.set('x', clickedMarker.x.toString());
      searchParams.set('y', clickedMarker.y.toString());
    }

    window.history.replaceState(
      null,
      '',
      clickedMarker ? `?${searchParams.toString()}` : '/',
    );
  }, [clickedMarker]);

  useEffect(() => {
    if (
      clickedMarker &&
      clickedMarker.category !== 'custom' &&
      !filters[clickedMarker.category]
    ) {
      setClickedMarker(null);
    }
  }, [clickedMarker, filters, setClickedMarker]);

  const hoveredMarker = useMemo(() => {
    const markersContext = markersLayerRef.current?.getContext('2d');

    // reversing because markers that were drawn later will be displayed on
    // top of those drawn earlier
    return (
      drawnMarkers.reverse().find(({ screenX = 0, screenY = 0, size }) => {
        const markerBoundingBox = new Path2D();
        markerBoundingBox.rect(screenX, screenY, size, size);
        return markersContext?.isPointInPath(
          markerBoundingBox,
          mousePosition.x,
          mousePosition.y,
        );
      }) || null
    );
  }, [drawnMarkers, mousePosition]);

  const { x: clickedMarkerTranslateX, y: clickedMarkerTranslateY } = useMemo(
    () =>
      calculatePopupTranslate(
        clickedMarker,
        coordOffset,
        zoomLevel.scale,
        clickedMarker?.size,
      ),
    [clickedMarker, coordOffset, zoomLevel.scale],
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
          drawnMarkers.reverse().find(({ screenX = 0, screenY = 0, size }) => {
            const markerBoundingBox = new Path2D();
            markerBoundingBox.rect(screenX, screenY, size, size);
            return markersContext?.isPointInPath(
              markerBoundingBox,
              eventCoords.x,
              eventCoords.y,
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
            x: coordOffset.x + eventCoords.x * zoomLevel.scale,
            y: coordOffset.y + eventCoords.y * zoomLevel.scale,
            z: 0,
            size: CUSTOM_MARKER_SIZE,
          });
        }
      }
    },
    [
      drawnMarkers,
      clickedMarker,
      coordOffset,
      zoomLevel.scale,
      setClickedMarker,
    ],
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
