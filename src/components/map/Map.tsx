import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  MouseEvent,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import MapStateContext from '../../context/MapStateContext';
import FiltersContext from '../../context/FiltersContext';
import OptionsContext from '../../context/OptionsContext';
import { MapStateActions } from '../../state/constants';
import type { Marker, MarkerCategories } from '../../types';
import markersData from '../../assets/markers.json';

import './Map.scss';
import type { LoadedImages, LoadedMarkers, CustomMarker } from './types';
import Popup from './popup/Popup';
import MapTooltip from './tooltip/Tooltip';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMousePosition from './useMousePosition';
import useMove from './useMove';
import useWheel from './useWheel';
import useMarkers from './useMarkers';
import useCopyLinkToClipboard from './useCopyLinkToClipboard';
import drawMapTiles from './drawMapTiles';
import drawMarkers from './drawMarkers/drawMarkers';
import drawMouseCoords from './drawMouseCoords';
import drawMapLabels from './drawMapLabels/drawMapLabels';
import drawRegions from './drawRegions';

const initialLoadedImages = getInitialLoadedImages();

const isCustomMarker = (marker?: Marker | null): marker is CustomMarker =>
  marker?.category === 'custom';

const Map = () => {
  const {
    state: { coordOffset, zoomLevel, zoomLevelRef },
    dispatch,
  } = useContext(MapStateContext);
  const { filters } = useContext(FiltersContext);
  const { options } = useContext(OptionsContext);

  const tilesLayerRef = useRef<HTMLCanvasElement>(null);
  const regionLayerRef = useRef<HTMLCanvasElement>(null);
  const mapLabelsLayerRef = useRef<HTMLCanvasElement>(null);
  const coordsLayerRef = useRef<HTMLCanvasElement>(null);

  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);
  const LoadedMarkersRef = useRef<LoadedMarkers>({
    custom: null,
    dragons: null,
    portals: null,
    quests: null,
    chests: null,
    bountyHunt: null,
    regionBoss: null,
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
    dispatch({ type: MapStateActions.FOCUS_ON_POINT, payload: targetMarker });
  }, [clickedMarker?.linkedMarkerId, setClickedMarker]);

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
        mapCoordOffset: coordOffset,
        zoomLevel,
        loadedImagesRef,
        zoomLevelRef,
      });
    }
  }, [
    coordOffset,
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
          mapCoordOffset: coordOffset,
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
    coordOffset,
    zoomLevel,
    filters,
    setDrawnMarkers,
    clickedMarker,
    canvasDimensions, // needed to handle canvas resize
  ]);

  useEffect(() => {
    const regionContext = regionLayerRef.current?.getContext('2d');

    if (regionContext) {
      drawRegions({
        context: regionContext,
        shouldDisplayRegions: options.showRegions,
        mapCoordOffset: coordOffset,
        zoomLevel,
      });
    }
  }, [options.showRegions, coordOffset, zoomLevel]);

  useEffect(() => {
    const mapLabelsContext = mapLabelsLayerRef.current?.getContext('2d');

    if (mapLabelsContext) {
      drawMapLabels({
        context: mapLabelsContext,
        shouldDisplayLabels: options.shouldDisplayLabels,
        showRegions: options.showRegions,
        mapCoordOffset: coordOffset,
        zoomLevel,
      });
    }
  }, [
    options.shouldDisplayLabels,
    options.showRegions,
    coordOffset,
    zoomLevel,
  ]);

  useEffect(() => {
    const coordsContext = coordsLayerRef.current?.getContext('2d');

    if (coordsContext) {
      drawMouseCoords({
        context: coordsContext,
        mapCoordOffset: coordOffset,
        zoomLevel,
        mousePosition,
      });
    }
  }, [coordOffset, mousePosition, zoomLevel]);

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
          ref={regionLayerRef}
          height={canvasDimensions.height}
          width={canvasDimensions.width}
          className="Layer"
        />
        <canvas
          ref={mapLabelsLayerRef}
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
        <MapTooltip
          style={{
            transform: `translate(calc(-50% + ${
              hoveredMarker.size / 2
            }px), -100%) translate(${hoveredMarker.screenX}px, ${
              hoveredMarker.screenY
            }px)`,
          }}
        >
          {hoveredMarker.label}
        </MapTooltip>
      ) : null}
      {clickedMarker?.label ? (
        <Popup
          marker={clickedMarker}
          style={{
            transform: `translate(calc(-50% + ${
              clickedMarker.size / 2
            }px), -100%) translate(${clickedMarkerTranslateX}px, ${clickedMarkerTranslateY}px)`,
          }}
          onClose={() => setClickedMarker(null)}
          onLinkButtonClick={copyLinkToClipboard}
          onEnterCaveButtonClick={handleEnterCaveButton}
        />
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
