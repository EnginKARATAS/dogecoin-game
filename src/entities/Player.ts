import p5 from 'p5';
import { InputHandler } from '../systems/InputHandler';
import { Vector2D } from '../utils/Vector2D';

export class Player {
  private position: Vector2D;
  private velocity: Vector2D;
  private size: Vector2D;
  private p5: p5;
  
  // Physics properties
  private gravity: number = 0.8;
  private jumpForce: number = -15;
  private speed: number = 5;
  private maxSpeed: number = 8;
  private friction: number = 0.8;
  
  // State
  private isOnGround: boolean = false;
  private facingRight: boolean = true;

  constructor(x: number, y: number, p5Instance: p5) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.size = new Vector2D(30, 40);
    this.p5 = p5Instance;
  }

  public update(inputHandler: InputHandler): void {
    this.handleInput(inputHandler);
    this.applyPhysics();
    this.updatePosition();
  }

  private handleInput(inputHandler: InputHandler): void {
    // Horizontal movement
    if (inputHandler.isKeyPressed('ArrowLeft') || inputHandler.isKeyPressed('a') || inputHandler.isKeyPressed('A')) {
      this.velocity.x -= this.speed;
      this.facingRight = false;
    }
    if (inputHandler.isKeyPressed('ArrowRight') || inputHandler.isKeyPressed('d') || inputHandler.isKeyPressed('D')) {
      this.velocity.x += this.speed;
      this.facingRight = true;
    }

    // Jumping
    if ((inputHandler.isKeyPressed('ArrowUp') || inputHandler.isKeyPressed('w') || inputHandler.isKeyPressed('W') || inputHandler.isKeyPressed(' ')) && this.isOnGround) {
      this.velocity.y = this.jumpForce;
      this.isOnGround = false;
    }
  }

  private applyPhysics(): void {
    // Apply gravity
    this.velocity.y += this.gravity;

    // Apply friction to horizontal movement
    this.velocity.x *= this.friction;

    // Limit horizontal speed
    if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
    if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

    // Stop very small movements
    if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
  }

  private updatePosition(): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  public render(p5: p5): void {
    p5.push();
    
    // Player body
    p5.fill(255, 100, 100); // Red color
    p5.stroke(200, 50, 50);
    p5.strokeWeight(2);
    p5.rect(this.position.x, this.position.y, this.size.x, this.size.y, 5);
    
    // Simple face
    p5.fill(255);
    p5.noStroke();
    
    // Eyes
    const eyeSize = 4;
    const eyeOffset = this.facingRight ? 8 : -8;
    p5.circle(this.position.x + this.size.x/2 + eyeOffset, this.position.y + 12, eyeSize);
    p5.circle(this.position.x + this.size.x/2 + eyeOffset, this.position.y + 20, eyeSize);
    
    // Direction indicator
    p5.fill(255, 255, 100);
    if (this.facingRight) {
      p5.triangle(
        this.position.x + this.size.x,
        this.position.y + this.size.y/2 - 5,
        this.position.x + this.size.x,
        this.position.y + this.size.y/2 + 5,
        this.position.x + this.size.x + 8,
        this.position.y + this.size.y/2
      );
    } else {
      p5.triangle(
        this.position.x,
        this.position.y + this.size.y/2 - 5,
        this.position.x,
        this.position.y + this.size.y/2 + 5,
        this.position.x - 8,
        this.position.y + this.size.y/2
      );
    }
    
    p5.pop();
  }

  // Getters and setters
  public getPosition(): Vector2D {
    return this.position.copy();
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public getVelocity(): Vector2D {
    return this.velocity.copy();
  }

  public setVelocity(x: number, y: number): void {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  public getSize(): Vector2D {
    return this.size.copy();
  }

  public getBounds(): { x: number, y: number, width: number, height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y
    };
  }

  public setOnGround(onGround: boolean): void {
    this.isOnGround = onGround;
  }

  public getIsOnGround(): boolean {
    return this.isOnGround;
  }
}