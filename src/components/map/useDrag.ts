import { useState, useCallback, MouseEvent, Dispatch, SetStateAction } from 'react';

import { Coords } from './types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';

type UseDragParams = {
  setMapOffset: Dispatch<SetStateAction<Coords>>;
}

type UseDrag = {
  isDragging: boolean;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: () => void;
}

const useDrag = ({ setMapOffset }: UseDragParams): UseDrag => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragDelta, setDragDelta] = useState<Coords>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: MouseEvent) => {
    setDragDelta({ x: event.clientX, y: event.clientY });
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      setMapOffset(currentOffset => {
        const xDelta = dragDelta.x - event.clientX;
        const yDelta = dragDelta.y - event.clientY;

        let newXPos = currentOffset.x + xDelta;
        let newYPos = currentOffset.y + yDelta;

        if (newXPos < 0) {
          newXPos = 0;
        } else if (newXPos > MAP_WIDTH - window.innerWidth) {
          newXPos = MAP_WIDTH - window.innerWidth;
        }

        if (newYPos < 0) {
          newYPos = 0;
        } else if (newYPos > MAP_HEIGHT - window.innerHeight) {
          newYPos = MAP_HEIGHT - window.innerHeight;
        }

        setDragDelta({ x: event.clientX, y: event.clientY });
        return {
          x: newXPos,
          y: newYPos,
        }
      })
    }
  }, [setMapOffset, isDragging, dragDelta.x, dragDelta.y]);

  const handleMouseUp = useCallback(() =>{
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

export default useDrag;
