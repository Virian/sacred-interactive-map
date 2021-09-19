import React, { useEffect, useRef, useState } from 'react';

import './Map.css';
import { Coords, LoadedImages } from './types';
import { TILE_SIZE } from './constants';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';
import translateScreenToCoords from './translateScreenToCoords';
import getTileCoordsForView from './getTileCoordsForView';
import getInitialLoadedImages from './getInitialLoadedImages';
import useMove from './useMove';
import useWheel from './useWheel';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mapCoordOffset, setMapCoordOffset] = useState<Coords>({ x: 26880, y: 8704 });
  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);

  const { scaleDivision, handleWheel } = useWheel();

  const {
    mousePosition,
    isMoving,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useMove({ setMapCoordOffset, scaleDivision });

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    const tileSizeAfterDivision = TILE_SIZE / scaleDivision;
    if (context) {
      // adding 3 because 1 is an additional tile to ensure that the whole screen will be coverted
      // and next 2 to load tiles outside of the screen (on both ends)
      const numberOfHorizontalTiles = Math.ceil(window.innerWidth / tileSizeAfterDivision) + 3;
      const numberOfVerticalTiles = Math.ceil(window.innerHeight / tileSizeAfterDivision) + 3;

      const { x: currentXCoordOffset, y: currentYCoordOffset } = mapCoordOffset;
      const screenXOverflow = (currentXCoordOffset % TILE_SIZE) / scaleDivision;
      const screenYOverflow = (currentYCoordOffset % TILE_SIZE) / scaleDivision;

      const {
        tileXCoords,
        tileYCoords,
      } = getTileCoordsForView(
        numberOfHorizontalTiles,
        numberOfVerticalTiles,
        currentXCoordOffset,
        currentYCoordOffset,
      );

      tileXCoords.forEach((tileXCoord, tileXCoordIndex) => {
        tileYCoords.forEach((tileYCoord, tileYCoordIndex) => {
          const shouldDraw = tileXCoordIndex !== 0 // don't draw tiles outside of the view
            && tileXCoordIndex !== tileXCoords.length - 1
            && tileYCoordIndex !== 0
            && tileYCoordIndex !== tileYCoords.length - 1;

          if (isTileAvailable({ x: tileXCoord, y: tileYCoord })) {
            const loadedImage = loadedImagesRef.current[`${tileXCoord}`].find(({ coords: { y }}) => y === tileYCoord);
            if (loadedImage && shouldDraw) {
              context.drawImage(
                loadedImage.img,
                (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
                (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
                tileSizeAfterDivision,
                tileSizeAfterDivision,
              );
              context.strokeStyle = 'black';
              context.strokeRect(
                (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
                (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
                tileSizeAfterDivision,
                tileSizeAfterDivision,
              );
            } else {
              // draw a black tile until the image is loaded
              context.fillStyle = 'black';
              context.fillRect(
                (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
                (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
                tileSizeAfterDivision,
                tileSizeAfterDivision,
              );

              const img = new Image();
              img.src = require(`../../assets/tiles/${coordToString(tileXCoord)}_${coordToString(tileYCoord)}.png`).default;
              img.onload = () => {
                loadedImagesRef.current[`${tileXCoord}`].push({
                  img,
                  coords: {
                    x: tileXCoord,
                    y: tileYCoord,
                  }
                });
                if (shouldDraw) {
                  context.drawImage(
                    img,
                    (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
                    (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
                    tileSizeAfterDivision,
                    tileSizeAfterDivision,
                  );
                  context.strokeStyle = 'black';
                  context.strokeRect(
                    (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
                    (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
                    tileSizeAfterDivision,
                    tileSizeAfterDivision,
                  );
                }
              }
            }
          } else if (shouldDraw) {
            context.fillStyle = 'black';
            context.fillRect(
              (tileXCoordIndex - 1) * tileSizeAfterDivision - screenXOverflow,
              (tileYCoordIndex - 1) * tileSizeAfterDivision - screenYOverflow,
              tileSizeAfterDivision,
              tileSizeAfterDivision,
            );
          }
        });
      });

      context.fillStyle = 'white';
      context.font = '18px serif';
      const cursorCoords = translateScreenToCoords({ screenCoords: mousePosition, mapCoordOffset, scaleDivision });
      context.fillText(`(${cursorCoords.x}, ${cursorCoords.y})`, mousePosition.x, mousePosition.y);
    }
  }, [mapCoordOffset, mousePosition, scaleDivision]);

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
