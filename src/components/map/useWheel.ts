import { useMemo, useContext } from 'react';
import throttle from 'lodash/throttle';

import type { Coords } from '../../types';
import MapStateContext from '../../context/MapStateContext';
import { MapStateActions } from '../../state/constants';

interface UseWheelParams {
  mousePosition: Coords;
}

const useWheel = ({ mousePosition }: UseWheelParams) => {
  const { dispatch } = useContext(MapStateContext);

  const handleWheel = useMemo(
    () =>
      throttle(({ deltaY }) => {
        if (deltaY < 0) {
          // zooming in
          dispatch({ type: MapStateActions.ZOOM_IN, payload: mousePosition });
        } else if (deltaY > 0) {
          // zooming out
          dispatch({ type: MapStateActions.ZOOM_OUT, payload: mousePosition });
        }
      }, 100),
    [mousePosition],
  );

  return { handleWheel };
};

export default useWheel;
