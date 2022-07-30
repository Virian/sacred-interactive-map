import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  MouseEvent,
} from 'react';

import './Map.scss';
import { Coords, LoadedImages, LoadedIcons } from './types';
import { MAP_WIDTH, MAP_HEIGHT, INITIAL_SCALE_LEVEL } from './constants';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMousePosition from './useMousePosition';
import useMove from './useMove';
import useWheel from './useWheel';
import drawMapTiles from './drawMapTiles';
import drawIcons from './drawIcons';
import drawMouseCoords from './drawMouseCoords';

interface MapProps {
  filters: Record<string, boolean>;
}

const initialLoadedImages = getInitialLoadedImages();

const Map = ({ filters }: MapProps) => {
  const tilesLayerRef = useRef<HTMLCanvasElement>(null);
  const iconsLayerRef = useRef<HTMLCanvasElement>(null);
  const coordsLayerRef = useRef<HTMLCanvasElement>(null);

  const [mapCoordOffset, setMapCoordOffset] = useState<Coords>(() => {
    const xOffsetToCenterMap =
      MAP_WIDTH / 2 - (window.innerWidth * INITIAL_SCALE_LEVEL.scale) / 2;
    const yOffsetToCenterMap =
      MAP_HEIGHT / 2 - (window.innerHeight * INITIAL_SCALE_LEVEL.scale) / 2;
    return {
      x: Math.max(0, xOffsetToCenterMap),
      y: Math.max(0, yOffsetToCenterMap),
    };
  });
  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);
  const loadedIconsRef = useRef<LoadedIcons>({ dragons: null, portals: null });

  const { mousePosition, handleMouseMove: onMouseMove } = useMousePosition();

  const { scaleLevel, handleWheel } = useWheel({
    setMapCoordOffset,
    mousePosition,
  });

  const {
    isMoving,
    handleMouseDown,
    handleMouseMove: onMapMove,
    handleMouseUp,
  } = useMove({ setMapCoordOffset, scale: scaleLevel.scale });

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
        scaleLevel,
        loadedImagesRef,
      });
    }
  }, [mapCoordOffset, scaleLevel]);

  useEffect(() => {
    const iconsContext = iconsLayerRef.current?.getContext('2d');

    if (iconsContext) {
      drawIcons({
        context: iconsContext,
        mapCoordOffset,
        scaleLevel,
        loadedIconsRef,
        filters,
      });
    }
  }, [mapCoordOffset, scaleLevel, filters]);

  useEffect(() => {
    const coordsContext = coordsLayerRef.current?.getContext('2d');

    if (coordsContext) {
      drawMouseCoords({
        context: coordsContext,
        mapCoordOffset,
        scaleLevel,
        mousePosition,
      });
    }
  }, [mapCoordOffset, mousePosition, scaleLevel]);

  return (
    <div className="MapContainer">
      <canvas
        ref={tilesLayerRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className="Layer"
      />
      <canvas
        ref={iconsLayerRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className="Layer"
      />
      <canvas
        ref={coordsLayerRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className={`Layer ${isMoving ? 'isMoving' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default Map;
