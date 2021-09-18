import { useState, useMemo } from 'react';
import throttle from 'lodash/throttle';

import { MAP_SCALE_DIVISIONS } from './constants';

const useWheel = () => {
  const [currentScaleDivision, setCurrentScaleDivision] = useState(MAP_SCALE_DIVISIONS[0]);

  const handleWheel = useMemo(
    () => throttle(
      ({ deltaY }) => {
        if (deltaY < 0) {
          // zooming in
          setCurrentScaleDivision((currentValue) => {
            const currentIndex = MAP_SCALE_DIVISIONS.indexOf(currentValue);
            if (currentIndex === 0) {
              return currentValue;
            }
            return MAP_SCALE_DIVISIONS[currentIndex - 1];
          });
        } else if (deltaY > 0) {
          // zooming out
          setCurrentScaleDivision((currentValue) => {
            const currentIndex = MAP_SCALE_DIVISIONS.indexOf(currentValue);
            if (currentIndex === MAP_SCALE_DIVISIONS.length - 1) {
              return currentValue;
            }
            return MAP_SCALE_DIVISIONS[currentIndex + 1];
          });
        }
      },
      100,
    ),
    [],
  );

  return { currentScaleDivision, handleWheel };
};

export default useWheel;
