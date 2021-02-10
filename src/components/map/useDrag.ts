import { useState, useCallback, MouseEvent, Dispatch, SetStateAction } from 'react';

import { Coords } from './types';

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
        setDragDelta({ x: event.clientX, y: event.clientY });
        return {
          x: currentOffset.x + xDelta,
          y: currentOffset.y + yDelta,
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
