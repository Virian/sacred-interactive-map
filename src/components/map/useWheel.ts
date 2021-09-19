import { useState, useMemo } from 'react';
import throttle from 'lodash/throttle';

import { MAP_SCALE_DIVISIONS } from './constants';

const useWheel = () => {
  const [scaleDivision, setScaleDivision] = useState(MAP_SCALE_DIVISIONS[0]);

  const handleWheel = useMemo(
    () => throttle(
      ({ deltaY }) => {
        if (deltaY < 0) {
          // zooming in
          setScaleDivision((currentScaleDivision) => {
            const currentIndex = MAP_SCALE_DIVISIONS.indexOf(currentScaleDivision);
            if (currentIndex === 0) {
              return currentScaleDivision;
            }
            return MAP_SCALE_DIVISIONS[currentIndex - 1];
          });
        } else if (deltaY > 0) {
          // zooming out
          setScaleDivision((currentScaleDivision) => {
            const currentIndex = MAP_SCALE_DIVISIONS.indexOf(currentScaleDivision);
            if (currentIndex === MAP_SCALE_DIVISIONS.length - 1) {
              return currentScaleDivision;
            }
            return MAP_SCALE_DIVISIONS[currentIndex + 1];
          });
        }
      },
      100,
    ),
    [],
  );

  return { scaleDivision, handleWheel };
};

export default useWheel;
