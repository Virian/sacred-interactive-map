import React, { useEffect, useRef, useState } from 'react';

import './Map.css';
import { Coords, LoadedImage } from './types';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';
import useDrag from './useDrag';

const TILE_SIZE = 256;

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mapOffset, setMapOffset] = useState<Coords>({ x: 27136, y: 8704 });
  const loadedImagesRef = useRef<LoadedImage[]>([]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {

      const numberOfHorizontalTiles = Math.ceil(window.innerWidth / TILE_SIZE) + 1;
      const numberOfVerticalTiles = Math.ceil(window.innerHeight / TILE_SIZE) + 1;
      // console.log({ width: window.innerWidth, height: window.innerHeight, numberOfHorizontalTiles, numberOfVerticalTiles });
      const { x: currentXOffset, y: currentYOffset } = mapOffset;
      const xOverflow = currentXOffset % TILE_SIZE;
      const yOverflow = currentYOffset % TILE_SIZE;
  
      for (let i = 0; i < numberOfHorizontalTiles; i += 1) {
        for (let j = 0; j < numberOfVerticalTiles; j += 1) {
          const xOffset = currentXOffset + i * TILE_SIZE;
          const yOffset = currentYOffset + j * TILE_SIZE;
          const xCoord = Math.floor(xOffset / TILE_SIZE);
          const yCoord = Math.floor(yOffset / TILE_SIZE);
  
          if (isTileAvailable({ x: xCoord, y: yCoord })) {
            const loadedImage = loadedImagesRef.current.find(({ coords: { x, y }}) => x === xCoord && y === yCoord);
            if (loadedImage) {
              context.drawImage(loadedImage.img, i * TILE_SIZE - xOverflow, j * TILE_SIZE - yOverflow);
            } else {
              const img = new Image();
              img.src = require(`../../assets/tiles/${coordToString(xCoord)}_${coordToString(yCoord)}.png`).default;
              img.onload = () => {
                loadedImagesRef.current.push({
                  img,
                  coords: {
                    x: xCoord,
                    y: yCoord,
                  }
                });
                context.drawImage(img, i * TILE_SIZE - xOverflow, j * TILE_SIZE - yOverflow);
              }
            }
          } else {
            context.fillStyle = 'black';
            context.fillRect(i * TILE_SIZE - xOverflow, j * TILE_SIZE - yOverflow, TILE_SIZE, TILE_SIZE);
          }
        }
      }
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