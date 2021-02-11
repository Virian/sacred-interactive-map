import React, { useEffect, useRef, useState } from 'react';

import './Map.css';
import { Coords, LoadedImages } from './types';
import { TILE_SIZE } from './constants';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';
import getCoordsForView from './getCoordsForView';
import getInitialLoadedImages from './getInitialLoadedImages';
import useDrag from './useDrag';

const initialLoadedImages = getInitialLoadedImages();

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mapOffset, setMapOffset] = useState<Coords>({ x: 27136, y: 8704 });
  const loadedImagesRef = useRef<LoadedImages>(initialLoadedImages);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      // adding 3 because 1 is an additional tile to ensure that the whole screen will be coverted
      // and next 2 to load tiles outside of the screen (on both ends)
      const numberOfHorizontalTiles = Math.ceil(window.innerWidth / TILE_SIZE) + 3;
      const numberOfVerticalTiles = Math.ceil(window.innerHeight / TILE_SIZE) + 3;

      const { x: currentXOffset, y: currentYOffset } = mapOffset;
      const xOverflow = currentXOffset % TILE_SIZE;
      const yOverflow = currentYOffset % TILE_SIZE;

      const {
        xCoords,
        yCoords,
      } = getCoordsForView(numberOfHorizontalTiles, numberOfVerticalTiles, currentXOffset, currentYOffset);

      xCoords.forEach((xCoord, xIndex) => {
        yCoords.forEach((yCoord, yIndex) => {
          const shouldDraw = xIndex !== 0
            && xIndex !== xCoords.length - 1
            && yIndex !== 0
            && yIndex !== yCoords.length - 1;
          
          if (isTileAvailable({ x: xCoord, y: yCoord })) {
            const loadedImage = loadedImagesRef.current[`${xCoord}`].find(({ coords: { y }}) => y === yCoord);
            if (loadedImage && shouldDraw) {
              context.drawImage(loadedImage.img, (xIndex - 1) * TILE_SIZE - xOverflow, (yIndex - 1) * TILE_SIZE - yOverflow);
            } else {
              // draw a black tile until the image is loaded
              context.fillStyle = 'black';
              context.fillRect((xIndex - 1) * TILE_SIZE - xOverflow, (yIndex - 1) * TILE_SIZE - yOverflow, TILE_SIZE, TILE_SIZE);

              const img = new Image();
              img.src = require(`../../assets/tiles/${coordToString(xCoord)}_${coordToString(yCoord)}.png`).default;
              img.onload = () => {
                loadedImagesRef.current[`${xCoord}`].push({
                  img,
                  coords: {
                    x: xCoord,
                    y: yCoord,
                  }
                });
                if (shouldDraw) {
                  context.drawImage(img, (xIndex - 1) * TILE_SIZE - xOverflow, (yIndex - 1) * TILE_SIZE - yOverflow);
                }
              }
            }
          } else if (shouldDraw) {
            context.fillStyle = 'black';
            context.fillRect((xIndex - 1) * TILE_SIZE - xOverflow, (yIndex - 1) * TILE_SIZE - yOverflow, TILE_SIZE, TILE_SIZE);
          }
        })
      })
    }
  }, [mapOffset]);

  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrag({ setMapOffset });

  return (
    <canvas
      ref={canvasRef}
      height={window.innerHeight}
      width={window.innerWidth}
      className={`Map ${isDragging ? 'isDragging' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Map;