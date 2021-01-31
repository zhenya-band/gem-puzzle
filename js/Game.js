import create from './utils/create';
import addZero from './utils/addZero';
import Render from './Render';
import Grid from './Grid';
import View from './View';
import NPuzzleSolver from './NPuzzleSolver';

let results = JSON.parse(localStorage.getItem('results')) || [];
export default class Game {
  constructor(width, height, startBtn, startScreen) {
    this.width = width;
    this.height = height;
    this.startBtn = startBtn;
    this.startScreen = startScreen;
    this.state = [];
    this.grid = new Grid(this.width, this.height, 400 / this.width, 400 / this.height);
    this.hole = {
      x: this.width - 1,
      y: this.height - 1,
    };
    this.moves = 0;
    this.sec = 0;
    this.min = 0;
    this.isAutoSolve = false;
    this.isShuflling = true;
    this.isVolume = true;
  }

  generateState() {
    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        let value = i * this.width + j + 1;
        if (value === this.width * this.height) {
          value = 0;
        }
        row.push(value);
      }
      this.state.push(row);
    }
  }

  getState() {
    return this.state;
  }

  generateLayout() {
    this.canvas = create('canvas', 'canvas');
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.ctx = this.canvas.getContext('2d');

    this.main = create('div', 'main', this.canvas);

    this.timeBlock = create('div', 'time header__item', 'Time', document.body);
    this.movesBlock = create('div', 'moves header__item', 'Moves', document.body);
    this.newGameBtn = create('button', 'new-game header__item', 'New game');

    this.resultsCloseBtn = create('div', 'close-btn', 'x');
    this.resultsHeader = create('div', 'results-header', [create('div', 'number', '№'),
      create('div', 'moves', 'moves'),
      create('div', 'date', 'date'),
      create('div', 'size', 'size'),
    ]);
    this.results = create('div', 'results', [this.resultsHeader, this.resultsCloseBtn], this.main);
    this.resultsList = create('div', 'results-list');
    this.resultBtn = create('button', 'results-btn header__item', 'Best results');
    this.volumeBlock = create('button', 'volume-btn header__item', null);

    this.headerBlock = create('header', 'header', [this.timeBlock, this.movesBlock, this.newGameBtn,
      this.resultBtn, this.volumeBlock]);

    this.victoreMessage = create('div', 'victory', null, this.main);
    this.audio = create('audio', 'audio', null, document.body);
    this.audio.src = './assets/audio/move.ogg';

    this.autoSolveBtn = create('button', 'solve-btn', 'Autosolve');
    this.referenceBtn = create('button', 'reference-btn', 'Show/hide reference');
    this.options = create('div', 'options', [this.autoSolveBtn, this.referenceBtn], this.main);

    document.body.append(this.headerBlock);
    document.body.append(this.main);

    document.addEventListener('click', this.click);

    this.resultBtn.addEventListener('click', () => {
      this.results.classList.add('active');
      this.printResults();
    });

    this.resultsCloseBtn.addEventListener('click', () => {
      this.results.classList.remove('active');
    });

    this.volumeBlock.addEventListener('click', this.toogleVolume);

    this.autoSolveBtn.addEventListener('click', this.autoSolve);

    this.referenceBtn.addEventListener('click', () => {
      this.img.classList.toggle('open');
    });

    this.newGameBtn.addEventListener('click', () => {
      document.body.removeChild(this.headerBlock);
      document.body.removeChild(this.main);
      document.body.removeChild(this.audio);
      this.startScreen.classList.add('active');
    });
  }

  generateImg() {
    this.img = new Image();
    const randomImg = Math.floor(Math.random() * 149 + 1);
    this.img.src = `./assets/img/box/${randomImg}.jpg`;
    this.img.classList.add('img-reference');
    this.main.appendChild(this.img);
  }

  generateRender() {
    this.render = new Render(this.ctx, this.grid, this.img);
  }

  generateView() {
    this.view = new View(this.getState(), this.width);
  }

  startGame = () => {
    this.interval = setInterval(() => {
      this.CountTime();
    }, 1000);
  }

  CountTime() {
    this.sec = this.sec < 59 ? this.sec += 1 : 0;
    if (this.sec === 0) {
      this.min += 1;
    }
    this.timeBlock.textContent = `Time ${addZero(this.min)} : ${addZero(this.sec)}`;
  }

  shufle() {
    this.isShuflling = false;
    for (let i = 0; i < 500; i++) {
      const rand = Math.random();
      if (rand < 0.25) this.toUp();
      else if (rand < 0.5) this.toRight();
      else if (rand < 0.75) this.toDown();
      else this.toLeft();
    }
  }

  isVictory() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const ref = i * this.width + j + 1;
        if (ref < this.height * this.width && this.state[i][j] !== ref) {
          return false;
        }
      }
    }
    return true;
  }

  ShowVictoryMessage() {
    if (this.isVictory() && !this.isAutoSolve) {
      this.autoSolveBtn.disabled = true;
      document.removeEventListener('click', this.click);
      this.victoreMessage.classList.add('active');
      this.victoreMessage.textContent = `Ура! Вы решили головоломку за 
        ${`${addZero(this.min)} : ${addZero(this.sec)}`} и ${this.moves} ходов`;
      clearInterval(this.interval);
      this.setResult();
    }
  }

  setResult() {
    if (this.isVictory()) {
      const result = {};
      result.moves = this.moves;
      result.date = new Date();
      result.size = `${this.width}x${this.width}`;
      results.push(result);
      results.sort((a, b) => a.moves - b.moves);
      if (results.length > 10) {
        results = results.slice(0, 10);
      }
      localStorage.setItem('results', JSON.stringify(results));
    }
  }

  printResults() {
    this.resultsList.innerHTML = '';
    const resultsFromStor = JSON.parse(localStorage.getItem('results'));
    if (resultsFromStor) {
      resultsFromStor.forEach((item, i) => {
        const result = create('div', 'result', [create('div', 'result-number', `${i + 1}`),
          create('div', 'result-moves', `${item.moves}`),
          create('div', 'result-date', `${item.date.slice(0, 10)}`),
          create('div', 'result-date', `${item.size}`),
        ]);
        this.resultsList.appendChild(result);
      });
      this.results.appendChild(this.resultsList);
    }
  }

  toRight() {
    if (this.hole.x > 0) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y][this.hole.x - 1];
      this.state[this.hole.y][this.hole.x - 1] = 0;
      this.view.toRight(this.state[this.hole.y][this.hole.x], this.isShuflling);
      this.hole.x -= 1;
    }
  }

  toLeft() {
    if (this.hole.x < this.width - 1) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y][this.hole.x + 1];
      this.state[this.hole.y][this.hole.x + 1] = 0;
      this.view.toLeft(this.state[this.hole.y][this.hole.x], this.isShuflling);
      this.hole.x += 1;
    }
  }

  toDown() {
    if (this.hole.y > 0) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y - 1][this.hole.x];
      this.state[this.hole.y - 1][this.hole.x] = 0;
      this.view.toDown(this.state[this.hole.y][this.hole.x], this.isShuflling);
      this.hole.y -= 1;
    }
  }

  toUp() {
    if (this.hole.y < this.height - 1) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y + 1][this.hole.x];
      this.state[this.hole.y + 1][this.hole.x] = 0;
      this.view.toUp(this.state[this.hole.y][this.hole.x], this.isShuflling);
      this.hole.y += 1;
    }
  }

  click = (e) => {
    if (e.target.closest('canvas')) {
      const canvasWidth = document.documentElement.clientWidth <= 570 ? 300 : 400;
      const x = Math.floor(e.offsetX / (canvasWidth / this.width));
      const y = Math.floor(e.offsetY / (canvasWidth / this.height));
      if (this.hole.y === y && this.hole.x === x) {
        this.movesBlock.textContent = `Moves ${this.moves}`;
      } else {
        if (this.hole.y === y) {
          if (this.hole.x === x - 1) {
            this.toLeft();
          } else if (this.hole.x === x + 1) {
            this.toRight();
          }
        } else if (this.hole.x === x) {
          if (this.hole.y === y - 1) {
            this.toUp();
          } else if (this.hole.y === y + 1) {
            this.toDown();
          }
        }
        this.movesBlock.textContent = `Moves ${this.moves += 1}`;
      }

      if (this.audio) {
        this.audio.currentTime = 0;
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
          }).catch((error) => {
            throw new Error(error);
          });
        }
      }

      this.ShowVictoryMessage();
    }
  }

  tick = () => {
    this.view.tick(this.isShuflling);
    this.render.render(this.view.getState(), this.width);
    requestAnimationFrame(this.tick);
  }

  autoSolve = () => {
    this.autoSolveBtn.disabled = true;
    this.isAutoSolve = true;
    this.isShuflling = !this.isShuflling;
    const solver = new NPuzzleSolver(this.state);
    const solution = solver.solve();
    for (let i = 0; i < solution.length; i++) {
      if (this.hole.y === solution[i].empty.y) {
        if (this.hole.x === solution[i].empty.x - 1) {
          this.toLeft();
        } else if (this.hole.x === solution[i].empty.x + 1) {
          this.toRight();
        }
      } else if (this.hole.x === solution[i].empty.x) {
        if (this.hole.y === solution[i].empty.y - 1) {
          this.toUp();
        } else if (this.hole.y === solution[i].empty.y + 1) {
          this.toDown();
        }
      }
    }
    this.toUp();
    clearInterval(this.interval);
    this.img.classList.remove('open');
  }

  toogleVolume = () => {
    if (this.isVolume) {
      this.volumeBlock.style.backgroundImage = 'url(\'./assets/img/volume-off.svg\')';
      this.isVolume = !this.isVolume;
      this.audio.muted = true;
    } else {
      this.audio.muted = false;
      this.volumeBlock.style.backgroundImage = 'url(\'./assets/img/volume-on.svg\')';
      this.isVolume = !this.isVolume;
    }
  }

  init() {
    this.generateLayout();
    this.generateState();
    this.generateImg();
    this.generateRender();
    this.generateView();
    this.shufle();
    this.tick();
  }
}
