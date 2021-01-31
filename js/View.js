import Block from './Block';

export default class View {
  constructor(gameState, gameWidth) {
    this.gameState = gameState;
    this.viewState = [];
    this.animationQueue = [];

    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < gameState[i].length; j++) {
        if (this.gameState[i][j] !== 0) {
          const blockWidth = 400 / gameWidth;
          this.viewState.push(new Block(j * blockWidth, i * blockWidth,
            this.gameState[i][j], blockWidth, blockWidth, 12, 12));
        }
      }
    }
  }

  tick(isShuflling) {
    let isAnimationActive = false;
    for (let i = 0; i < this.viewState.length; i++) {
      if (isShuflling) {
        isAnimationActive = isAnimationActive || this.viewState[i].tick();
      } else {
        this.viewState[i].tick();
      }
    }

    if (!isAnimationActive && this.animationQueue.length > 0) {
      const step = this.animationQueue.shift();
      switch (step[0]) {
        case 'right':
          this.viewState[step[1]].incTargetX();
          break;
        case 'left':
          this.viewState[step[1]].decTargetX();
          break;
        case 'down':
          this.viewState[step[1]].incTargetY();
          break;
        case 'up':
          this.viewState[step[1]].decTargetY();
          break;
        default:
          break;
      }
    }
  }

  toRight(value, isShuflling) {
    if (isShuflling) {
      this.animationQueue.push(['right', value - 1]);
    } else {
      this.viewState[value - 1].incTargetX();
    }
  }

  toLeft(value, isShuflling) {
    if (isShuflling) {
      this.animationQueue.push(['left', value - 1]);
    } else {
      this.viewState[value - 1].decTargetX();
    }
  }

  toDown(value, isShuflling) {
    if (isShuflling) {
      this.animationQueue.push(['down', value - 1]);
    } else {
      this.viewState[value - 1].incTargetY();
    }
  }

  toUp(value, isShuflling) {
    if (isShuflling) {
      this.animationQueue.push(['up', value - 1]);
    } else {
      this.viewState[value - 1].decTargetY();
    }
  }

  getState() {
    return this.viewState;
  }
}
