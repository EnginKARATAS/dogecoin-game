import { Platform, PlatformType } from '../entities/Platform';

export class PlatformGenerator {
  private lastPlatformX: number = 0;
  private platformSpacing: number = 150;
  private platformVariation: number = 100;
  private platformCount: number = 0;

  public generateInitialPlatforms(): Platform[] {
    const platforms: Platform[] = [];

    // Create ground platforms
    for (let x = 0; x < 2000; x += 200) {
      platforms.push(new Platform(x, 500, 200, 50, PlatformType.GROUND));
    }

    // Create floating platforms
    let currentX = 200;
    for (let i = 0; i < 15; i++) {
      const height = 300 + Math.sin(i * 0.5) * 100;
      const width = 100 + Math.random() * 50;
      
      // Randomly choose platform type
      let type = PlatformType.FLOATING;
      if (Math.random() < 0.2) {
        type = PlatformType.MOVING;
      }

      const platform = new Platform(currentX, height, width, 20, type);
      
      if (type === PlatformType.MOVING) {
        platform.setMoveProperties(80, 0.5 + Math.random() * 1);
      }

      platforms.push(platform);
      currentX += 120 + Math.random() * 80;
    }

    this.lastPlatformX = currentX;
    this.platformCount = platforms.length;

    return platforms;
  }

  public updatePlatforms(existingPlatforms: Platform[], playerX: number): Platform[] {
    // Update moving platforms
    existingPlatforms.forEach(platform => {
      platform.update();
    });

    // Generate new platforms as player progresses
    const viewDistance = 1200; // Distance ahead to generate platforms
    const cleanupDistance = 800; // Distance behind player to remove platforms

    // Remove platforms that are too far behind the player
    const filteredPlatforms = existingPlatforms.filter(platform => {
      const platformX = platform.getPosition().x;
      return platformX > playerX - cleanupDistance;
    });

    // Generate new platforms if needed
    while (this.lastPlatformX < playerX + viewDistance) {
      this.generateNextPlatform(filteredPlatforms);
    }

    return filteredPlatforms;
  }

  private generateNextPlatform(platforms: Platform[]): void {
    // Determine platform properties
    const spacing = this.platformSpacing + (Math.random() - 0.5) * this.platformVariation;
    const x = this.lastPlatformX + spacing;
    
    // Vary height based on position
    const baseHeight = 350;
    const heightVariation = Math.sin(x * 0.01) * 150 + Math.random() * 100 - 50;
    const y = baseHeight + heightVariation;
    
    const width = 80 + Math.random() * 60;
    const height = 15 + Math.random() * 10;

    // Determine platform type based on difficulty progression
    let type = PlatformType.FLOATING;
    const difficulty = Math.min(1, x / 2000); // Difficulty increases with distance

    if (Math.random() < 0.1 + difficulty * 0.2) {
      type = PlatformType.MOVING;
    }

    // Occasionally add ground platforms
    if (Math.random() < 0.3) {
      const groundPlatform = new Platform(x, 500, 200, 50, PlatformType.GROUND);
      platforms.push(groundPlatform);
    }

    // Create the main platform
    const platform = new Platform(x, y, width, height, type);
    
    if (type === PlatformType.MOVING) {
      const moveDistance = 60 + Math.random() * 80;
      const moveSpeed = 0.3 + Math.random() * 1.2;
      platform.setMoveProperties(moveDistance, moveSpeed);
    }

    platforms.push(platform);
    this.lastPlatformX = x;
    this.platformCount++;
  }

  // Generate a specific pattern of platforms (for special areas)
  public generatePlatformPattern(startX: number, patternType: 'staircase' | 'challenge' | 'safe'): Platform[] {
    const platforms: Platform[] = [];
    
    switch (patternType) {
      case 'staircase':
        for (let i = 0; i < 5; i++) {
          const x = startX + i * 100;
          const y = 450 - i * 50;
          platforms.push(new Platform(x, y, 80, 20, PlatformType.FLOATING));
        }
        break;
        
      case 'challenge':
        // Series of moving platforms
        for (let i = 0; i < 3; i++) {
          const x = startX + i * 200;
          const y = 300 + Math.sin(i) * 50;
          const platform = new Platform(x, y, 60, 15, PlatformType.MOVING);
          platform.setMoveProperties(100, 1 + i * 0.5);
          platforms.push(platform);
        }
        break;
        
      case 'safe':
        // Large, stable platforms for resting
        for (let i = 0; i < 3; i++) {
          const x = startX + i * 150;
          const y = 400;
          platforms.push(new Platform(x, y, 120, 25, PlatformType.FLOATING));
        }
        break;
    }
    
    return platforms;
  }

  // Get statistics about generated platforms
  public getStats(): { count: number, lastX: number } {
    return {
      count: this.platformCount,
      lastX: this.lastPlatformX
    };
  }

  // Reset the generator state
  public reset(): void {
    this.lastPlatformX = 0;
    this.platformCount = 0;
  }
}