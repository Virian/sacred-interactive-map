import { MutableRefObject } from 'react';

import { SHOULD_DRAW_TILE_EDGES } from '../../config';
import { Coords, ZoomLevel } from '../../types';
import { TILE_SIZE } from '../../constants';
import asyncForEach from '../../shared/asyncForEach';

import { LoadedImages } from './types';
import getTileCoordsForView from './getTileCoordsForView';
import isTileAvailable from './isTileAvailable';
import coordToString from './coordToString';

interface DrawMapTilesParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
  loadedImagesRef: MutableRefObject<LoadedImages>;
  zoomLevelRef?: MutableRefObject<ZoomLevel>;
}

const drawMapTiles = async ({
  context,
  mapCoordOffset,
  zoomLevel,
  loadedImagesRef,
  zoomLevelRef,
}: DrawMapTilesParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // adding 3 because 1 is an additional tile to ensure that the whole screen will be covered
  // and next 2 to load tiles outside of the screen (on both ends)
  const numberOfHorizontalTiles = Math.ceil(window.innerWidth / TILE_SIZE) + 3;
  const numberOfVerticalTiles = Math.ceil(window.innerHeight / TILE_SIZE) + 3;

  const { x: currentXCoordOffset, y: currentYCoordOffset } = mapCoordOffset;
  const screenXOverflow =
    (currentXCoordOffset % (TILE_SIZE * zoomLevel.scale)) / zoomLevel.scale;
  const screenYOverflow =
    (currentYCoordOffset % (TILE_SIZE * zoomLevel.scale)) / zoomLevel.scale;

  const { tileXCoords, tileYCoords } = getTileCoordsForView(
    numberOfHorizontalTiles,
    numberOfVerticalTiles,
    currentXCoordOffset,
    currentYCoordOffset,
    zoomLevel.scale,
  );

  await asyncForEach(tileXCoords, (tileXCoord, tileXCoordIndex) =>
    asyncForEach(tileYCoords, async (tileYCoord, tileYCoordIndex) => {
      const shouldDraw =
        tileXCoordIndex !== 0 && // don't draw tiles outside of the view
        tileXCoordIndex !== tileXCoords.length - 1 &&
        tileYCoordIndex !== 0 &&
        tileYCoordIndex !== tileYCoords.length - 1;

      if (
        isTileAvailable({
          x: tileXCoord,
          y: tileYCoord,
          zoomLevelNumber: zoomLevel.levelNumber,
        })
      ) {
        const loadedImage = loadedImagesRef.current[`${zoomLevel.levelNumber}`][
          `${tileXCoord}`
        ].find(({ coords: { y } }) => y === tileYCoord);
        if (loadedImage && shouldDraw) {
          context.drawImage(
            loadedImage.img,
            Math.round((tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow),
            Math.round((tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow),
            TILE_SIZE,
            TILE_SIZE,
          );
          if (SHOULD_DRAW_TILE_EDGES) {
            context.strokeStyle = 'black';
            context.strokeRect(
              Math.round((tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow),
              Math.round((tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow),
              TILE_SIZE,
              TILE_SIZE,
            );
          }
        } else {
          const img = new Image();
          // functions can't be used in a string literal with file path
          const stringTileXCoord = coordToString(tileXCoord);
          const stringTileYCoord = coordToString(tileYCoord);
          img.src = (
            await import(
              `../../assets/tiles/${zoomLevel.levelNumber}/${stringTileXCoord}_${stringTileYCoord}.webp`
            )
          ).default;
          img.onload = () => {
            loadedImagesRef.current[`${zoomLevel.levelNumber}`][
              `${tileXCoord}`
            ].push({
              img,
              coords: {
                x: tileXCoord,
                y: tileYCoord,
              },
            });
            if (
              shouldDraw &&
              // we want to draw the tile only if the zoom level is still the
              // same as it was when we started loading the image
              zoomLevelRef?.current.levelNumber === zoomLevel.levelNumber
            ) {
              context.drawImage(
                img,
                Math.round((tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow),
                Math.round((tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow),
                TILE_SIZE,
                TILE_SIZE,
              );
              if (SHOULD_DRAW_TILE_EDGES) {
                context.strokeStyle = 'black';
                context.strokeRect(
                  Math.round(
                    (tileXCoordIndex - 1) * TILE_SIZE - screenXOverflow,
                  ),
                  Math.round(
                    (tileYCoordIndex - 1) * TILE_SIZE - screenYOverflow,
                  ),
                  TILE_SIZE,
                  TILE_SIZE,
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
          TILE_SIZE,
        );
      }
    }),
  );
};

export default drawMapTiles;
