export type PixelSprite = {
  rows: readonly string[];
  ink: Readonly<Record<string, string>>;
};

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  { rows, ink }: PixelSprite,
  x: number,
  y: number,
  size: number,
  exposed?: (x: number, y: number) => boolean,
) {
  const left = Math.round(x - (rows[0].length * size) / 2);
  const top = Math.round(y - (rows.length * size) / 2);
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      const fill = ink[rows[row][col]];
      if (!fill) continue;
      const px = left + col * size;
      const py = top + row * size;
      if (exposed && !exposed(px, py)) continue;
      ctx.fillStyle = fill;
      ctx.fillRect(px, py, size, size);
    }
  }
}
