import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  MouseEvent,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import WarningIcon from '@mui/icons-material/WarningAmber';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

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
import useCopyLinkToClipboard from './useCopyLinkToClipboard';
import drawMapTiles from './drawMapTiles';
import drawMarkers from './drawMarkers';
import drawMouseCoords from './drawMouseCoords';
import translateMapCoordsToGameCoords from './translateMapCoordsToGameCoords';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const { zoomLevel, zoomLevelRef } = useContext(ZoomContext);
  const { mapCoordOffset } = useContext(MapCoordOffsetContext);
  const { filters } = useContext(FiltersContext);

  const tilesLayerRef = useRef<HTMLCanvasElement>(null);
  const coordsLayerRef = useRef<HTMLCanvasElement>(null);

  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);
  const LoadedMarkersRef = useRef<LoadedMarkers>({
    custom: null,
    dragons: null,
    portals: null,
    chests: null,
    bountyHunt: null,
  });

  const {
    isClipboardInfoOpen,
    clipboardInfoSeverity,
    copyLinkToClipboard,
    handleClipboardInfoClose,
  } = useCopyLinkToClipboard();

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
        zoomLevelRef,
      });
    }
  }, [mapCoordOffset, zoomLevel, zoomLevelRef]);

  useEffect(() => {
    const markersContext = markersLayerRef.current?.getContext('2d');

    if (markersContext) {
      const newDrawnMarkers = drawMarkers({
        context: markersContext,
        mapCoordOffset,
        zoomLevel,
        LoadedMarkersRef,
        filters,
        customMarker:
          clickedMarker?.category === 'custom' ? clickedMarker : null,
      });

      setDrawnMarkers(newDrawnMarkers);
    }
  }, [
    markersLayerRef,
    mapCoordOffset,
    zoomLevel,
    filters,
    setDrawnMarkers,
    clickedMarker,
  ]);

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
              title="Close popup"
              onClick={() => setClickedMarker(null)}
            >
              <CloseIcon />
            </button>
            <h3 className="Popup__Title">
              {clickedMarker.label}
              <button
                className="Popup__LinkButton"
                title="Copy link to clipboard"
                onClick={copyLinkToClipboard}
              >
                <LinkIcon />
              </button>
            </h3>
            <i className="Popup__Category">
              {clickedMarker.categoryFilterLabel}
            </i>
            <span className="Popup__Coordinates">
              In-game coordinates: [
              {Object.values(translateMapCoordsToGameCoords(clickedMarker))
                .concat(clickedMarker.z)
                .join(', ')}
              ]
              <Tooltip
                title="Coordinates are approximate and may slightly differ from actual in-game coordinates"
                placement="right"
              >
                <WarningIcon className="Popup__CoordinatesWarningIcon" />
              </Tooltip>
            </span>
            {clickedMarker.description ? (
              <span className="Popup__Description">
                {clickedMarker.description}
              </span>
            ) : null}
          </div>
          <span className="Popup__Arrow" />
        </div>
      ) : null}
      <Snackbar
        open={isClipboardInfoOpen}
        autoHideDuration={5000}
        onClose={handleClipboardInfoClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleClipboardInfoClose}
          severity={clipboardInfoSeverity}
          elevation={5}
        >
          {clipboardInfoSeverity === 'success'
            ? 'Link copied to clipboard'
            : 'Unable to copy to clipboard'}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Map;
