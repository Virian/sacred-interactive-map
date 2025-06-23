import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import WarningIcon from '@mui/icons-material/WarningAmber';
import MuiTooltip from '@mui/material/Tooltip';

import type { Marker } from '../../../types';
import translateMapCoordsToGameCoords from '../translateMapCoordsToGameCoords';

import './Popup.scss';

interface PopupProps {
  marker: Marker;
  style?: React.CSSProperties;
  onClose: () => void;
  onLinkButtonClick: () => void;
  onEnterCaveButtonClick: () => void;
}

const Popup = ({
  marker,
  style,
  onClose: handleClose,
  onLinkButtonClick: handleLinkButtonClick,
  onEnterCaveButtonClick: handleEnterCaveButtonClick,
}: PopupProps) => (
  <div
    className="Popup"
    style={style}
  >
    <div className="Popup__Content">
      <button
        className="Popup__CloseButton"
        title="Close popup"
        onClick={handleClose}
      >
        <CloseIcon />
      </button>
      <h3 className="Popup__Title">
        {marker.label}
        <div className="Popup__Icons">
          {marker.isFromExpansion && (
            <MuiTooltip
              title="This content in only available with the Underworld expansion"
              placement="top"
            >
              <span className="Popup__ExpansionIcon" />
            </MuiTooltip>
          )}

          <button
            className="Popup__LinkButton"
            title="Copy link to clipboard"
            onClick={handleLinkButtonClick}
          >
            <LinkIcon />
          </button>
        </div>
      </h3>
      <i className="Popup__Category">{marker.categoryFilterLabel}</i>
      <span className="Popup__Coordinates">
        In-game coordinates: [
        {Object.values(translateMapCoordsToGameCoords(marker))
          .concat(marker.z)
          .join(', ')}
        ]
        <MuiTooltip
          title="Coordinates are approximate and may slightly differ from actual in-game coordinates"
          placement="right"
        >
          <WarningIcon className="Popup__CoordinatesWarningIcon" />
        </MuiTooltip>
      </span>
      {marker.description ? (
        <span className="Popup__Description">{marker.description}</span>
      ) : null}
      {marker.linkedMarkerId ? (
        <button
          className="Popup__EnterCaveButton"
          title="Enter the cave"
          onClick={handleEnterCaveButtonClick}
        >
          enter <ChevronRightIcon className="Popup__EnterCaveButtonIcon" />
        </button>
      ) : null}
    </div>
    <span className="Popup__Arrow" />
  </div>
);

export default Popup;
