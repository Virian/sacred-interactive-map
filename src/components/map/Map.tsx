import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  MouseEvent,
} from 'react';

import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';
import FiltersContext from '../../context/FiltersContext';

import './Map.scss';
import { LoadedImages, LoadedMarkers, Marker } from './types';
import { MARKER_SIZE } from './constants';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMousePosition from './useMousePosition';
import useMove from './useMove';
import useWheel from './useWheel';
import drawMapTiles from './drawMapTiles';
import drawMarkers from './drawMarkers';
import drawMouseCoords from './drawMouseCoords';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const { zoomLevel } = useContext(ZoomContext);
  const { mapCoordOffset } = useContext(MapCoordOffsetContext);
  const { filters } = useContext(FiltersContext);

  const tilesLayerRef = useRef<HTMLCanvasElement>(null);
  const markersLayerRef = useRef<HTMLCanvasElement>(null);
  const coordsLayerRef = useRef<HTMLCanvasElement>(null);

  const [hoveredMarker, setHoveredMarker] = useState<Marker | null>(null);

  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);
  const LoadedMarkersRef = useRef<LoadedMarkers>({
    dragons: null,
    portals: null,
    chests: null,
    bountyHunt: null,
  });

  const { mousePosition, handleMouseMove: onMouseMove } = useMousePosition();

  const { handleWheel } = useWheel({ mousePosition });

  const {
    isMoving,
    handleMouseDown,
    handleMouseMove: onMapMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMove();

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      onMouseMove(event);
      onMapMove(event);
    },
    [onMouseMove, onMapMove]
  );

  useEffect(() => {
    const tilesContext = tilesLayerRef.current?.getContext('2d');

    if (tilesContext) {
      drawMapTiles({
        context: tilesContext,
        mapCoordOffset,
        zoomLevel,
        loadedImagesRef,
      });
    }
  }, [mapCoordOffset, zoomLevel]);

  useEffect(() => {
    const markersContext = markersLayerRef.current?.getContext('2d');

    if (markersContext) {
      const drawnMarkers = drawMarkers({
        context: markersContext,
        mapCoordOffset,
        zoomLevel,
        LoadedMarkersRef,
        filters,
      });

      // reversing because markers that were drawn later will be displayed on
      // top of those drawn earlier
      const currentlyHoveredMarker = drawnMarkers.reverse().find(({ x, y }) => {
        const markerBoundingBox = new Path2D();
        markerBoundingBox.rect(x, y, MARKER_SIZE, MARKER_SIZE);
        return markersContext.isPointInPath(
          markerBoundingBox,
          mousePosition.x,
          mousePosition.y
        );
      });

      setHoveredMarker(currentlyHoveredMarker || null);
    }
  }, [mapCoordOffset, zoomLevel, filters, mousePosition]);

  useEffect(() => {
    const coordsContext = coordsLayerRef.current?.getContext('2d');

    if (coordsContext) {
      drawMouseCoords({
        context: coordsContext,
        mapCoordOffset,
        zoomLevel,
        mousePosition,
      });
    }
  }, [mapCoordOffset, mousePosition, zoomLevel]);

  return (
    <div className="Map">
      <div className="Map__CanvasContainer">
        <canvas
          ref={tilesLayerRef}
          height={window.innerHeight}
          width={window.innerWidth}
          className="Layer"
        />
        <canvas
          ref={markersLayerRef}
          height={window.innerHeight}
          width={window.innerWidth}
          className="Layer"
        />
        <canvas
          ref={coordsLayerRef}
          height={window.innerHeight}
          width={window.innerWidth}
          className={`Layer ${isMoving ? 'isMoving' : ''} ${
            hoveredMarker ? 'isMarkerHovered' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onWheel={handleWheel}
        />
      </div>
      {hoveredMarker?.label ? (
        <div
          className="Tooltip"
          style={{
            transform: `translate(calc(-50% + ${
              MARKER_SIZE / 2
            }px), -100%) translate(${hoveredMarker.x}px, ${hoveredMarker.y}px)`,
          }}
        >
          <span className="Tooltip__Content">{hoveredMarker.label}</span>
          <span className="Tooltip__Arrow" />
        </div>
      ) : null}
    </div>
  );
};

export default Map;
