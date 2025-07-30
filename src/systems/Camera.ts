import p5 from 'p5';
import { Vector2D } from '../utils/Vector2D';

export class Camera {
  private position: Vector2D;
  private target: Vector2D;
  private viewportWidth: number;
  private viewportHeight: number;
  private followSpeed: number = 0.05;
  private offsetX: number = -300; // Keep player slightly left of center
  private offsetY: number = -100; // Keep player slightly above center

  constructor(viewportWidth: number, viewportHeight: number) {
    this.position = new Vector2D(0, 0);
    this.target = new Vector2D(0, 0);
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  public update(playerPosition: Vector2D): void {
    // Calculate target camera position based on player position
    this.target.x = playerPosition.x + this.offsetX;
    this.target.y = playerPosition.y + this.offsetY;

    // Smoothly move camera towards target
    this.position.x += (this.target.x - this.position.x) * this.followSpeed;
    this.position.y += (this.target.y - this.position.y) * this.followSpeed;

    // Keep camera within reasonable bounds
    // Don't let camera go too far up (prevent seeing above the world)
    if (this.position.y < -200) {
      this.position.y = -200;
    }

    // Don't let camera go backwards (always progress forward)
    if (this.position.x < 0) {
      this.position.x = 0;
    }
  }

  public apply(p5: p5): void {
    // Apply camera transformation
    p5.translate(-this.position.x, -this.position.y);
  }

  public getPosition(): Vector2D {
    return this.position.copy();
  }

  public getViewBounds(): { left: number, right: number, top: number, bottom: number } {
    return {
      left: this.position.x,
      right: this.position.x + this.viewportWidth,
      top: this.position.y,
      bottom: this.position.y + this.viewportHeight
    };
  }

  public isInView(x: number, y: number, width: number, height: number): boolean {
    const bounds = this.getViewBounds();
    return !(x + width < bounds.left || 
             x > bounds.right || 
             y + height < bounds.top || 
             y > bounds.bottom);
  }

  public setFollowSpeed(speed: number): void {
    this.followSpeed = Math.max(0.01, Math.min(1, speed));
  }

  public setOffset(x: number, y: number): void {
    this.offsetX = x;
    this.offsetY = y;
  }
}