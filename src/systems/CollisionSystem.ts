import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';

export class CollisionSystem {
  
  public checkPlayerPlatformCollisions(player: Player, platforms: Platform[]): void {
    const playerBounds = player.getBounds();
    const playerVelocity = player.getVelocity();
    let isOnGround = false;

    for (const platform of platforms) {
      const platformBounds = platform.getBounds();
      
      // Check if collision is happening
      if (this.isColliding(playerBounds, platformBounds)) {
        // Determine collision direction and resolve
        const collision = this.resolveCollision(playerBounds, platformBounds, playerVelocity);
        
        if (collision.fromTop) {
          // Player is landing on top of platform
          player.setPosition(playerBounds.x, platformBounds.y - playerBounds.height);
          player.setVelocity(playerVelocity.x, 0);
          isOnGround = true;
        } else if (collision.fromBottom) {
          // Player hit platform from below
          player.setPosition(playerBounds.x, platformBounds.y + platformBounds.height);
          player.setVelocity(playerVelocity.x, 0);
        } else if (collision.fromLeft) {
          // Player hit platform from the left
          player.setPosition(platformBounds.x - playerBounds.width, playerBounds.y);
          player.setVelocity(0, playerVelocity.y);
        } else if (collision.fromRight) {
          // Player hit platform from the right
          player.setPosition(platformBounds.x + platformBounds.width, playerBounds.y);
          player.setVelocity(0, playerVelocity.y);
        }
      }
    }

    player.setOnGround(isOnGround);
  }

  private isColliding(rect1: any, rect2: any): boolean {
    return !(rect1.x + rect1.width <= rect2.x || 
             rect2.x + rect2.width <= rect1.x || 
             rect1.y + rect1.height <= rect2.y || 
             rect2.y + rect2.height <= rect1.y);
  }

  private resolveCollision(playerBounds: any, platformBounds: any, velocity: any): {
    fromTop: boolean;
    fromBottom: boolean;
    fromLeft: boolean;
    fromRight: boolean;
  } {
    // Calculate overlap amounts
    const overlapLeft = (playerBounds.x + playerBounds.width) - platformBounds.x;
    const overlapRight = (platformBounds.x + platformBounds.width) - playerBounds.x;
    const overlapTop = (playerBounds.y + playerBounds.height) - platformBounds.y;
    const overlapBottom = (platformBounds.y + platformBounds.height) - playerBounds.y;

    // Find minimum overlap to determine collision direction
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    // Determine collision direction based on velocity and overlap
    const result = {
      fromTop: false,
      fromBottom: false,
      fromLeft: false,
      fromRight: false
    };

    if (minOverlap === overlapTop && velocity.y > 0) {
      result.fromTop = true;
    } else if (minOverlap === overlapBottom && velocity.y < 0) {
      result.fromBottom = true;
    } else if (minOverlap === overlapLeft && velocity.x > 0) {
      result.fromLeft = true;
    } else if (minOverlap === overlapRight && velocity.x < 0) {
      result.fromRight = true;
    } else {
      // Default to vertical collision if velocity is small
      if (overlapTop < overlapBottom) {
        result.fromTop = true;
      } else {
        result.fromBottom = true;
      }
    }

    return result;
  }

  // Check collision between two rectangular bounds
  public checkRectCollision(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ): boolean {
    return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
  }

  // Get the center point of a rectangular bounds
  public getCenter(bounds: { x: number, y: number, width: number, height: number }): { x: number, y: number } {
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  }
}