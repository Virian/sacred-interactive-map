import { useCallback, useContext } from 'react';

import MapStateContext from '../../context/MapStateContext';
import { MapStateActions } from '../../state/constants';

import './ZoomControls.scss';

const ZoomDirection = {
  IN: 'in',
  OUT: 'out',
} as const;

const ZoomControls = () => {
  const { dispatch } = useContext(MapStateContext);

  const handleZoomChange = useCallback(
    (direction: (typeof ZoomDirection)[keyof typeof ZoomDirection]) => {
      if (direction === ZoomDirection.IN) {
        dispatch({
          type: MapStateActions.ZOOM_IN,
          payload: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        });
      } else if (direction === ZoomDirection.OUT) {
        dispatch({
          type: MapStateActions.ZOOM_OUT,
          payload: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        });
      }
    },
    [dispatch],
  );

  return (
    <div className="ZoomControls">
      <button
        className="ZoomControls__Button"
        onClick={() => handleZoomChange(ZoomDirection.IN)}
      >
        +
      </button>
      <div className="ZoomControls__Separator" />
      <button
        className="ZoomControls__Button"
        onClick={() => handleZoomChange(ZoomDirection.OUT)}
      >
        -
      </button>
    </div>
  );
};

export default ZoomControls;
