import p5 from 'p5';
import { Game } from './core/Game';

// Global game instance
let game: Game;

// P5.js sketch function
const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(1200, 600);
    canvas.parent('game-container');
    
    // Initialize the game
    game = new Game(p);
    
    console.log('Platform Game Advanced - Initialized!');
  };

  p.draw = () => {
    if (game) {
      game.update();
      game.render();
    }
  };

  // Handle key presses
  p.keyPressed = () => {
    if (game) {
      game.handleKeyPressed(p.key, p.keyCode);
    }
  };

  p.keyReleased = () => {
    if (game) {
      game.handleKeyReleased(p.key, p.keyCode);
    }
  };
};

// Create the P5 instance
new p5(sketch);