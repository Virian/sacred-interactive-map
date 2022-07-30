import React, { useEffect, useRef, useState, useCallback, MouseEvent } from 'react';

import { SHOULD_DRAW_TILE_EDGES, SHOULD_DRAW_COORDS } from '../../config';

import './Map.css';
import { Coords, LoadedImages } from './types';
import { TILE_SIZE } from './constants';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';
import translateScreenToCoords from './translateScreenToCoords';
import translateMapCoordsToGameCoords from './translateMapCoordsToGameCoords';
import getTileCoordsForView from './getTileCoordsForView';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMousePosition from './useMousePosition';
import useMove from './useMove';
import useWheel from './useWheel';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mapCoordOffset, setMapCoordOffset] = useState<Coords>({ x: 26880, y: 8704 }); // TODO: change initial coords and zoom
  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);

  const { mousePosition, handleMouseMove: onMouseMove } = useMousePosition();

  const { scaleLevel, handleWheel } = useWheel({ setMapCoordOffset, mousePosition });

  const {
    isMoving,
    handleMouseDown,
    handleMouseMove: onMapMove,
    handleMouseUp,
  } = useMove({ setMapCoordOffset, scale: scaleLevel.scale });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    onMouseMove(event);
    onMapMove(event);
  }, [onMouseMove, onMapMove]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (context) {
      // adding 3 because 1 is an additional tile to ensure that the whole screen will be covered
      // and next 2 to load tiles outside of the screen (on both ends)
      const numberOfHorizontalTiles = Math.ceil(window.innerWidth / TILE_SIZE) + 3;
      const numberOfVerticalTiles = Math.ceil(window.innerHeight / TILE_SIZE) + 3;

      const { x: currentXCoordOffset, y: currentYCoordOffset } = mapCoordOffset;
      const screenXOverflow = (currentXCoordOffset % (TILE_SIZE * scaleLevel.scale)) / scaleLevel.scale;
      const screenYOverflow = (currentYCoordOffset % (TILE_SIZE * scaleLevel.scale)) / scaleLevel.scale;

      const {
        tileXCoords,
        tileYCoords,
      } = getTileCoordsForView(
        numberOfHorizontalTiles,
        numberOfVerticalTiles,
        currentXCoordOffset,
        currentYCoordOffset,
        scaleLevel.scale,
      );

      tileXCoords.forEach((tileXCoord, tileXCoordIndex) => {
        tileYCoords.forEach((tileYCoord, tileYCoordIndex) => {
          const shouldDraw = tileXCoordIndex !== 0 // don't draw tiles outside of the view
            && tileXCoordIndex !== tileXCoords.length - 1
            && tileYCoordIndex !== 0
            && tileYCoordIndex !== tileYCoords.length - 1;

          if (isTileAvailable({ x: tileXCoord, y: tileYCoord, scaleLevel: scaleLevel.level })) {
            const loadedImage = loadedImagesRef.current[`${scaleLevel.level}`][`${tileXCoord}`].find(({ coords: { y }}) => y === tileYCoord);
            if (loadedImage && shouldDraw) {
              context.drawImage(
                loadedImage.img,
                (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                TILE_SIZE,
                TILE_SIZE,
              );
              if (SHOULD_DRAW_TILE_EDGES) {
                context.strokeStyle = 'black';
                context.strokeRect(
                  (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                  (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                  TILE_SIZE,
                  TILE_SIZE,
                );
              }
            } else {
              // draw a black tile until the image is loaded
              context.fillStyle = 'black';
              context.fillRect(
                (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                TILE_SIZE,
                TILE_SIZE,
              );

              const img = new Image();
              // functions can't be used in a string literal with file path
              const stringTileXCoord = coordToString(tileXCoord);
              const stringTileYCoord = coordToString(tileYCoord);
              img.src = require(`../../assets/tiles/${scaleLevel.level}/${stringTileXCoord}_${stringTileYCoord}.webp`).default;
              img.onload = () => {
                loadedImagesRef.current[`${scaleLevel.level}`][`${tileXCoord}`].push({
                  img,
                  coords: {
                    x: tileXCoord,
                    y: tileYCoord,
                  }
                });
                if (shouldDraw) {
                  context.drawImage(
                    img,
                    (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                    (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                    TILE_SIZE,
                    TILE_SIZE,
                  );
                  if (SHOULD_DRAW_TILE_EDGES) {
                    context.strokeStyle = 'black';
                    context.strokeRect(
                      (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                      (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                      TILE_SIZE,
                      TILE_SIZE,
                    );
                  }
                }
              }
            }
          } else if (shouldDraw) {
            context.fillStyle = 'black';
            context.fillRect(
              (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
              (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
              TILE_SIZE,
              TILE_SIZE,
            );
          }
        });
      });

      if (SHOULD_DRAW_COORDS) {
        context.fillStyle = 'white';
        context.font = '18px serif';
        const cursorCoords = translateMapCoordsToGameCoords(
          translateScreenToCoords(
            { screenCoords: mousePosition,
              mapCoordOffset,
              scale: scaleLevel.scale,
            })
        );
        context.fillText(`(${cursorCoords.x}, ${cursorCoords.y})`, mousePosition.x, mousePosition.y);
      }
    }
  }, [mapCoordOffset, mousePosition, scaleLevel]);

  return (
    <canvas
      ref={canvasRef}
      height={window.innerHeight}
      width={window.innerWidth}
      className={`Map ${isMoving ? 'isMoving' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default Map;
