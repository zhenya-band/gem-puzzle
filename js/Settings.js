import create from './utils/create';
import Game from './Game';

export default class Settings {
  constructor() {
    this.select = create('select', 'select', [create('option', 'select-option', '3x3', this.select, ['value', '3']),
      create('option', 'select-option', '4x4', this.select, ['value', '4']),
      create('option', 'select-option', '5x5', this.select, ['value', '5']),
      create('option', 'select-option', '6x6', this.select, ['value', '6']),
      create('option', 'select-option', '7x7', this.select, ['value', '7']),
      create('option', 'select-option', '8x8', this.select, ['value', '8']),
    ]);

    this.games = [];

    this.startBtn = create('button', 'start-btn', 'start');
    this.startScreen = create('div', 'start-screen active', [this.select, this.startBtn]);
    document.body.prepend(this.startScreen);

    this.select.addEventListener('change', (e) => {
      this.width = +e.target.value;
      this.height = +e.target.value;
    });

    this.startBtn.addEventListener('click', this.startNewGame);
  }

  startNewGame = () => {
    this.startScreen.classList.remove('active');
    const game = new Game(this.width || 3, this.height || 3, this.startBtn, this.startScreen);
    game.init();
    game.startGame();
  }
}
