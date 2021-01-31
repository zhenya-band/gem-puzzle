export default class Block {
  constructor(x, y, value, blockWidth, blockHeight, dx, dy) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.value = value;
    this.width = blockWidth;
    this.height = blockHeight;
    this.dx = dx;
    this.dy = dy;
  }

  tick() {
    if (this.targetX > this.x) {
      this.x += this.dx;
      if (this.x > this.targetX) {
        this.x = this.targetX;
      }
    } else if (this.targetX < this.x) {
      this.x -= this.dx;
      if (this.x < this.targetX) {
        this.x = this.targetX;
      }
    } else if (this.targetY > this.y) {
      this.y += this.dy;
      if (this.y > this.targetY) {
        this.y = this.targetY;
      }
    } else if (this.targetY < this.y) {
      this.y -= this.dy;
      if (this.y < this.targetY) {
        this.y = this.targetY;
      }
    } else {
      return false;
    }
    return true;
  }

  incTargetX() {
    this.targetX += this.width;
  }

  decTargetX() {
    this.targetX -= this.width;
  }

  incTargetY() {
    this.targetY += this.height;
  }

  decTargetY() {
    this.targetY -= this.height;
  }
}
