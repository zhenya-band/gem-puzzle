export default class Render {
  constructor(ctx, grid, img) {
    this.ctx = ctx;
    this.grid = grid;
    this.img = img;
  }

  clear() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, 400, 400);
  }

  render(viewState, width) {
    this.clear();
    for (let i = 0; i < viewState.length; i++) {
      const block = viewState[i];
      const ip = this.grid.getPositionByValue(block.value);
      const blockWidth = 400 / width;
      const scale = 900 / width / blockWidth;
      this.ctx.drawImage(this.img, ip.x * scale, ip.y * scale, blockWidth * scale,
        blockWidth * scale, block.x, block.y, blockWidth, blockWidth);
    }
  }
}
