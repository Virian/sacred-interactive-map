import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  MouseEvent,
} from 'react';

import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';
import FiltersContext from '../../context/FiltersContext';

import './Map.scss';
import { LoadedImages, LoadedMarkers } from './types';
import { MARKER_SIZE } from './constants';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMousePosition from './useMousePosition';
import useMove from './useMove';
import useWheel from './useWheel';
import useMarkers from './useMarkers';
import drawMapTiles from './drawMapTiles';
import drawMarkers from './drawMarkers';
import drawMouseCoords from './drawMouseCoords';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const { zoomLevel } = useContext(ZoomContext);
  const { mapCoordOffset } = useContext(MapCoordOffsetContext);
  const { filters } = useContext(FiltersContext);

  const tilesLayerRef = useRef<HTMLCanvasElement>(null);
  const coordsLayerRef = useRef<HTMLCanvasElement>(null);

  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);
  const LoadedMarkersRef = useRef<LoadedMarkers>({
    dragons: null,
    portals: null,
    chests: null,
    bountyHunt: null,
  });

  const { mousePosition, handleMouseMove: handleMousePositionMove } =
    useMousePosition();

  const { handleWheel } = useWheel({ mousePosition });

  const {
    markersLayerRef,
    setDrawnMarkers,
    hoveredMarker,
    clickedMarker,
    setClickedMarker,
    clickedMarkerTranslateX,
    clickedMarkerTranslateY,
    checkMarkerClick,
  } = useMarkers({ mousePosition });

  const {
    isMoving,
    handleMouseDown,
    handleMouseMove: onMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMove({ onMoveEnd: checkMarkerClick });

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      handleMousePositionMove(event);
      onMouseMove(event);
    },
    [handleMousePositionMove, onMouseMove]
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
      const newDrawnMarkers = drawMarkers({
        context: markersContext,
        mapCoordOffset,
        zoomLevel,
        LoadedMarkersRef,
        filters,
      });

      setDrawnMarkers(newDrawnMarkers);
    }
  }, [markersLayerRef, mapCoordOffset, zoomLevel, filters, setDrawnMarkers]);

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
      {hoveredMarker?.label && hoveredMarker.id !== clickedMarker?.id ? (
        <div
          className="Tooltip"
          style={{
            transform: `translate(calc(-50% + ${
              MARKER_SIZE / 2
            }px), -100%) translate(${hoveredMarker.screenX}px, ${
              hoveredMarker.screenY
            }px)`,
          }}
        >
          <span className="Tooltip__Content">{hoveredMarker.label}</span>
          <span className="Tooltip__Arrow" />
        </div>
      ) : null}
      {clickedMarker?.label ? (
        <div
          className="Popup"
          style={{
            transform: `translate(calc(-50% + ${
              MARKER_SIZE / 2
            }px), -100%) translate(${clickedMarkerTranslateX}px, ${clickedMarkerTranslateY}px)`,
          }}
        >
          <div className="Popup__Content">
            <button
              className="Popup__CloseButton"
              onClick={() => setClickedMarker(null)}
            >
              X
            </button>
            <h3 className="Popup__Title">{clickedMarker.label}</h3>
            <i className="Popup__Category">{clickedMarker.category}</i>
            {clickedMarker.description ? (
              <span className="Popup__Description">
                {clickedMarker.description}
              </span>
            ) : null}
          </div>
          <span className="Popup__Arrow" />
        </div>
      ) : null}
    </div>
  );
};

export default Map;
