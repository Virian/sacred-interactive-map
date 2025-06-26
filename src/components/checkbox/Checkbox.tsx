import './Checkbox.scss';

interface CheckboxProps {
  checked: boolean;
  onChange?: (newValue: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

const Checkbox = ({
  checked,
  onChange,
  className,
  children,
}: CheckboxProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLLabelElement, MouseEvent>,
  ) => {
    event.preventDefault();
    onChange?.(!checked);
  };

  return (
    <label
      className={`Checkbox ${className}`}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        className="Checkbox__Input"
      />
      <div className="Checkbox__IconContainer">
        <div
          className={`Checkbox__Icon ${checked ? 'Checkbox__Icon--Checked' : ''}`}
        />
      </div>
      <span className="Checkbox__Label">{children}</span>
    </label>
  );
};

export default Checkbox;
