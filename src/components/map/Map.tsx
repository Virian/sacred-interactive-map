import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  MouseEvent,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import WarningIcon from '@mui/icons-material/WarningAmber';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import ZoomContext from '../../context/ZoomContext';
import MapCoordOffsetContext from '../../context/MapCoordOffsetContext';
import FiltersContext from '../../context/FiltersContext';
import markersData from '../../assets/markers.json';

import './Map.scss';
import {
  LoadedImages,
  LoadedMarkers,
  Marker,
  CustomMarker,
  MarkerCategories,
} from './types';
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
import useFocusOnPoint from './useFocusOnPoint';

const initialLoadedImages = getInitialLoadedImages();

const isCustomMarker = (marker?: Marker | null): marker is CustomMarker =>
  marker?.category === 'custom';

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
    caves: null,
  });

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const {
    isClipboardInfoOpen,
    clipboardInfoSeverity,
    copyLinkToClipboard,
    handleClipboardInfoClose,
  } = useCopyLinkToClipboard();

  const focusOnPoint = useFocusOnPoint();

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
    [handleMousePositionMove, onMouseMove],
  );

  const handleEnterCaveButton = useCallback(() => {
    const targetMarkerId = clickedMarker?.linkedMarkerId;

    if (!targetMarkerId) {
      return;
    }

    const targetMarker = Object.entries(markersData)
      .flatMap(([category, { markers, filterLabel, size }]) =>
        markers.map((marker) => ({
          ...marker,
          category: category as MarkerCategories,
          categoryFilterLabel: filterLabel,
          size,
        })),
      )
      .find(({ id }) => id === targetMarkerId);

    if (!targetMarker) {
      return;
    }

    setClickedMarker(targetMarker);
    focusOnPoint(targetMarker);
  }, [clickedMarker?.linkedMarkerId, setClickedMarker, focusOnPoint]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  }, [
    mapCoordOffset,
    zoomLevel,
    zoomLevelRef,
    canvasDimensions, // needed to handle canvas resize
  ]);

  useEffect(() => {
    const drawMarkersLayer = async () => {
      const markersContext = markersLayerRef.current?.getContext('2d');

      if (markersContext) {
        const newDrawnMarkers = await drawMarkers({
          context: markersContext,
          mapCoordOffset,
          zoomLevel,
          LoadedMarkersRef,
          filters,
          customMarker: isCustomMarker(clickedMarker) ? clickedMarker : null,
        });

        setDrawnMarkers(newDrawnMarkers);
      }
    };

    drawMarkersLayer();
  }, [
    markersLayerRef,
    mapCoordOffset,
    zoomLevel,
    filters,
    setDrawnMarkers,
    clickedMarker,
    canvasDimensions, // needed to handle canvas resize
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
          height={canvasDimensions.height}
          width={canvasDimensions.width}
          className="Layer"
        />
        <canvas
          ref={markersLayerRef}
          height={canvasDimensions.height}
          width={canvasDimensions.width}
          className="Layer"
        />
        <canvas
          ref={coordsLayerRef}
          height={canvasDimensions.height}
          width={canvasDimensions.width}
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
              hoveredMarker.size / 2
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
              clickedMarker.size / 2
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
            {clickedMarker.linkedMarkerId ? (
              <button
                className="Popup__EnterCaveButton"
                title="Enter the cave"
                onClick={handleEnterCaveButton}
              >
                enter{' '}
                <ChevronRightIcon className="Popup__EnterCaveButtonIcon" />
              </button>
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
