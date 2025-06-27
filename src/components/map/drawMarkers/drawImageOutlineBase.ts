const drawImageOutlineBase = (
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  thickness: number,
) => {
  if (thickness === 0) {
    return;
  }

  const offsets = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  // draw images at offsets from the array scaled by thickness
  offsets.forEach((offset) => {
    context.drawImage(
      image,
      x + offset.x * thickness,
      y + offset.y * thickness,
    );
  });
};

export default drawImageOutlineBase;
