interface DrawOutlinedTextParams {
  context: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  angle?: number;
}

const drawOutlinedText = ({
  context,
  text,
  x,
  y,
  angle = 0,
}: DrawOutlinedTextParams) => {
  if (angle) {
    context.save();
    context.translate(x, y);
    context.rotate((angle * Math.PI) / 180);
    context.strokeText(text, 0, 0);
    context.fillText(text, 0, 0);
    context.restore();
  } else {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
  }
};

export default drawOutlinedText;
