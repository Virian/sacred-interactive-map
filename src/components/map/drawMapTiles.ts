import { MutableRefObject } from 'react';

import { SHOULD_DRAW_TILE_EDGES } from '../../config';

import { Coords, LoadedImages } from './types';
import { TILE_SIZE } from './constants';
import getTileCoordsForView from './getTileCoordsForView';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';

interface DrawMapTilesParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  scaleLevel: { scale: number; level: number };
  loadedImagesRef: MutableRefObject<LoadedImages>;
}

const drawMapTiles = ({
  context,
  mapCoordOffset,
  scaleLevel,
  loadedImagesRef,
}: DrawMapTilesParams) => {
  // adding 3 because 1 is an additional tile to ensure that the whole screen will be covered
  // and next 2 to load tiles outside of the screen (on both ends)
  const numberOfHorizontalTiles = Math.ceil(window.innerWidth / TILE_SIZE) + 3;
  const numberOfVerticalTiles = Math.ceil(window.innerHeight / TILE_SIZE) + 3;

  const { x: currentXCoordOffset, y: currentYCoordOffset } = mapCoordOffset;
  const screenXOverflow =
    (currentXCoordOffset % (TILE_SIZE * scaleLevel.scale)) / scaleLevel.scale;
  const screenYOverflow =
    (currentYCoordOffset % (TILE_SIZE * scaleLevel.scale)) / scaleLevel.scale;

  const { tileXCoords, tileYCoords } = getTileCoordsForView(
    numberOfHorizontalTiles,
    numberOfVerticalTiles,
    currentXCoordOffset,
    currentYCoordOffset,
    scaleLevel.scale
  );

  tileXCoords.forEach((tileXCoord, tileXCoordIndex) => {
    tileYCoords.forEach((tileYCoord, tileYCoordIndex) => {
      const shouldDraw =
        tileXCoordIndex !== 0 && // don't draw tiles outside of the view
        tileXCoordIndex !== tileXCoords.length - 1 &&
        tileYCoordIndex !== 0 &&
        tileYCoordIndex !== tileYCoords.length - 1;

      if (
        isTileAvailable({
          x: tileXCoord,
          y: tileYCoord,
          scaleLevel: scaleLevel.level,
        })
      ) {
        const loadedImage = loadedImagesRef.current[`${scaleLevel.level}`][
          `${tileXCoord}`
        ].find(({ coords: { y } }) => y === tileYCoord);
        if (loadedImage && shouldDraw) {
          context.drawImage(
            loadedImage.img,
            (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
            (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
            TILE_SIZE,
            TILE_SIZE
          );
          if (SHOULD_DRAW_TILE_EDGES) {
            context.strokeStyle = 'black';
            context.strokeRect(
              (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
              (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
              TILE_SIZE,
              TILE_SIZE
            );
          }
        } else {
          const img = new Image();
          // functions can't be used in a string literal with file path
          const stringTileXCoord = coordToString(tileXCoord);
          const stringTileYCoord = coordToString(tileYCoord);
          img.src =
            require(`../../assets/tiles/${scaleLevel.level}/${stringTileXCoord}_${stringTileYCoord}.webp`).default;
          img.onload = () => {
            loadedImagesRef.current[`${scaleLevel.level}`][
              `${tileXCoord}`
            ].push({
              img,
              coords: {
                x: tileXCoord,
                y: tileYCoord,
              },
            });
            if (shouldDraw) {
              context.drawImage(
                img,
                (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                TILE_SIZE,
                TILE_SIZE
              );
              if (SHOULD_DRAW_TILE_EDGES) {
                context.strokeStyle = 'black';
                context.strokeRect(
                  (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                  (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                  TILE_SIZE,
                  TILE_SIZE
                );
              }
            }
          };
        }
      } else if (shouldDraw) {
        context.fillStyle = 'black';
        context.fillRect(
          (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
          (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    });
  });
};

export default drawMapTiles;
