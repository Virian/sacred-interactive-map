
import React, { useEffect, useRef, useState, MouseEvent } from 'react';

import availableTiles from '../../assets/availableTiles.json';

const TILE_SIZE = 256;

type Coords = {
  x: number;
  y: number;
}

type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
}

const isTileAvailable = ({ x, y }: Coords) : boolean => availableTiles.some(tile => tile.x === x && tile.y === y);

const coordToString = (coord: number) : string => String(coord).padStart(3, '0');

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mapOffset, setMapOffset] = useState<Coords>({ x: 27136, y: 8704 });
  const loadedImagesRef = useRef<LoadedImage[]>([]);
  const [panDelta, setPanDelta] = useState<Coords>({ x: 0, y: 0 });

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

  const handleMouseDown = (event: MouseEvent) => {
    setPanDelta({ x: event.clientX, y: event.clientY });
    setIsDragging(true);
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setMapOffset(currentOffset => {
        const xDelta = panDelta.x - event.clientX;
        const yDelta = panDelta.y - event.clientY;
        setPanDelta({ x: event.clientX, y: event.clientY });
        return {
          x: currentOffset.x + xDelta,
          y: currentOffset.y + yDelta,
        }
      })
    }
  }

  const handleMouseUp = () =>{
    setIsDragging(false);
  }

  return (
    <canvas
      ref={canvasRef}
      height={window.innerHeight}
      width={window.innerWidth}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Map;