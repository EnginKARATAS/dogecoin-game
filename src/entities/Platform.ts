import p5 from 'p5';
import { Vector2D } from '../utils/Vector2D';

export enum PlatformType {
  GROUND = 'ground',
  FLOATING = 'floating',
  MOVING = 'moving'
}

export class Platform {
  private position: Vector2D;
  private size: Vector2D;
  private type: PlatformType;
  private color: p5.Color | number[];
  
  // For moving platforms
  private originalX: number;
  private moveDistance: number;
  private moveSpeed: number;
  private moveDirection: number = 1;

  constructor(x: number, y: number, width: number, height: number, type: PlatformType = PlatformType.FLOATING) {
    this.position = new Vector2D(x, y);
    this.size = new Vector2D(width, height);
    this.type = type;
    this.originalX = x;
    this.moveDistance = 100;
    this.moveSpeed = 1;
    
    // Set color based on platform type
    switch (type) {
      case PlatformType.GROUND:
        this.color = [34, 139, 34]; // Forest Green
        break;
      case PlatformType.FLOATING:
        this.color = [70, 130, 180]; // Steel Blue
        break;
      case PlatformType.MOVING:
        this.color = [255, 165, 0]; // Orange
        break;
      default:
        this.color = [128, 128, 128]; // Gray
    }
  }

  public update(): void {
    if (this.type === PlatformType.MOVING) {
      // Move back and forth
      this.position.x += this.moveSpeed * this.moveDirection;
      
      // Check boundaries and reverse direction
      if (this.position.x >= this.originalX + this.moveDistance || this.position.x <= this.originalX - this.moveDistance) {
        this.moveDirection *= -1;
      }
    }
  }

  public render(p5: p5): void {
    p5.push();
    
    // Platform body
    p5.fill(this.color[0], this.color[1], this.color[2]);
    p5.stroke(this.color[0] - 30, this.color[1] - 30, this.color[2] - 30);
    p5.strokeWeight(2);
    
    if (this.type === PlatformType.GROUND) {
      // Ground platforms have a different style
      p5.rect(this.position.x, this.position.y, this.size.x, this.size.y);
      
      // Add grass texture for ground
      p5.fill(50, 205, 50); // Lime green
      p5.noStroke();
      p5.rect(this.position.x, this.position.y, this.size.x, 5);
    } else {
      // Regular platforms
      p5.rect(this.position.x, this.position.y, this.size.x, this.size.y, 5);
      
      // Add highlight for 3D effect
      p5.fill(255, 255, 255, 100);
      p5.noStroke();
      p5.rect(this.position.x, this.position.y, this.size.x, 3, 5);
    }
    
    // Special indicator for moving platforms
    if (this.type === PlatformType.MOVING) {
      p5.fill(255, 255, 0);
      p5.noStroke();
      for (let i = 0; i < 3; i++) {
        p5.circle(this.position.x + (i + 1) * (this.size.x / 4), this.position.y + this.size.y / 2, 4);
      }
    }
    
    p5.pop();
  }

  // Getters
  public getPosition(): Vector2D {
    return this.position.copy();
  }

  public getSize(): Vector2D {
    return this.size.copy();
  }

  public getType(): PlatformType {
    return this.type;
  }

  public getBounds(): { x: number, y: number, width: number, height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y
    };
  }

  // Setters
  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public setMoveProperties(distance: number, speed: number): void {
    this.moveDistance = distance;
    this.moveSpeed = speed;
  }
}