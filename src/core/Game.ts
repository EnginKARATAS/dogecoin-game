import p5 from 'p5';
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { Camera } from '../systems/Camera';
import { CollisionSystem } from '../systems/CollisionSystem';
import { PlatformGenerator } from '../systems/PlatformGenerator';
import { InputHandler } from '../systems/InputHandler';
import { GameState, GameStateManager } from '../systems/GameStateManager';

export class Game {
  private p5: p5;
  private player: Player;
  private platforms: Platform[] = [];
  private camera: Camera;
  private collisionSystem: CollisionSystem;
  private platformGenerator: PlatformGenerator;
  private inputHandler: InputHandler;
  private gameStateManager: GameStateManager;
  
  private score: number = 0;
  private level: number = 1;

  constructor(p5Instance: p5) {
    this.p5 = p5Instance;
    this.initializeGame();
  }

  private initializeGame(): void {
    // Initialize core systems
    this.camera = new Camera(this.p5.width, this.p5.height);
    this.collisionSystem = new CollisionSystem();
    this.platformGenerator = new PlatformGenerator();
    this.inputHandler = new InputHandler();
    this.gameStateManager = new GameStateManager();

    // Create player
    this.player = new Player(100, 300, this.p5);

    // Generate initial platforms
    this.platforms = this.platformGenerator.generateInitialPlatforms();
    
    console.log(`Game initialized with ${this.platforms.length} platforms`);
  }

  public update(): void {
    if (this.gameStateManager.getCurrentState() !== GameState.PLAYING) {
      return;
    }

    // Update input
    this.inputHandler.update();

    // Update player
    this.player.update(this.inputHandler);

    // Update camera to follow player
    this.camera.update(this.player.getPosition());

    // Check collisions
    this.collisionSystem.checkPlayerPlatformCollisions(this.player, this.platforms);

    // Generate new platforms as player progresses
    const playerX = this.player.getPosition().x;
    this.platforms = this.platformGenerator.updatePlatforms(this.platforms, playerX);

    // Update score based on player progress
    const newScore = Math.floor(playerX / 100);
    if (newScore > this.score) {
      this.score = newScore;
      this.updateUI();
    }

    // Check if player fell off the world
    if (this.player.getPosition().y > 800) {
      this.gameStateManager.setState(GameState.GAME_OVER);
    }
  }

  public render(): void {
    // Clear background
    this.p5.background(135, 206, 250); // Sky blue

    // Apply camera transform
    this.p5.push();
    this.camera.apply(this.p5);

    // Draw platforms
    this.platforms.forEach(platform => {
      platform.render(this.p5);
    });

    // Draw player
    this.player.render(this.p5);

    this.p5.pop();

    // Draw UI elements (not affected by camera)
    this.renderUI();
  }

  private renderUI(): void {
    const state = this.gameStateManager.getCurrentState();
    
    if (state === GameState.MENU) {
      this.renderMenu();
    } else if (state === GameState.GAME_OVER) {
      this.renderGameOver();
    }
  }

  private renderMenu(): void {
    this.p5.fill(0, 0, 0, 150);
    this.p5.rect(0, 0, this.p5.width, this.p5.height);
    
    this.p5.fill(255);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(48);
    this.p5.text('Platform Game Advanced', this.p5.width / 2, this.p5.height / 2 - 50);
    
    this.p5.textSize(24);
    this.p5.text('Press SPACE to Start', this.p5.width / 2, this.p5.height / 2 + 20);
    
    this.p5.textSize(16);
    this.p5.text('Use ARROW KEYS or WASD to move', this.p5.width / 2, this.p5.height / 2 + 60);
  }

  private renderGameOver(): void {
    this.p5.fill(0, 0, 0, 150);
    this.p5.rect(0, 0, this.p5.width, this.p5.height);
    
    this.p5.fill(255, 100, 100);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(48);
    this.p5.text('Game Over', this.p5.width / 2, this.p5.height / 2 - 50);
    
    this.p5.fill(255);
    this.p5.textSize(24);
    this.p5.text(`Final Score: ${this.score}`, this.p5.width / 2, this.p5.height / 2);
    
    this.p5.textSize(18);
    this.p5.text('Press R to Restart', this.p5.width / 2, this.p5.height / 2 + 40);
  }

  public handleKeyPressed(key: string, keyCode: number): void {
    this.inputHandler.setKeyPressed(key, keyCode, true);
    
    const state = this.gameStateManager.getCurrentState();
    
    if (state === GameState.MENU && (key === ' ' || keyCode === 32)) {
      this.gameStateManager.setState(GameState.PLAYING);
    } else if (state === GameState.GAME_OVER && (key === 'r' || key === 'R')) {
      this.restartGame();
    }
  }

  public handleKeyReleased(key: string, keyCode: number): void {
    this.inputHandler.setKeyPressed(key, keyCode, false);
  }

  private restartGame(): void {
    this.score = 0;
    this.level = 1;
    this.player = new Player(100, 300, this.p5);
    this.platforms = this.platformGenerator.generateInitialPlatforms();
    this.camera = new Camera(this.p5.width, this.p5.height);
    this.gameStateManager.setState(GameState.PLAYING);
    this.updateUI();
  }

  private updateUI(): void {
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    
    if (scoreElement) scoreElement.textContent = `Score: ${this.score}`;
    if (levelElement) levelElement.textContent = `Level: ${this.level}`;
  }
}