import './Tooltip.scss';

interface TooltipProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Tooltip = ({ children, style }: TooltipProps) => (
  <div
    className="Tooltip"
    style={style}
  >
    <span className="Tooltip__Content">{children}</span>
    <span className="Tooltip__Arrow" />
  </div>
);

export default Tooltip;
