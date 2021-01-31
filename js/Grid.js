export default class Grid {
  constructor(gameWidth, gameHeight, blockWidth, blockHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
  }

  getPositionByValue(value) {
    return {
      x: ((value - 1) % this.gameWidth) * this.blockWidth,
      y: Math.floor((value - 1) / this.gameWidth) * this.blockHeight,
    };
  }
}
