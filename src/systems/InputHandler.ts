export class InputHandler {
  private keys: Map<string, boolean> = new Map();
  private keyCodes: Map<number, boolean> = new Map();

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    // Initialize commonly used keys
    const commonKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'a', 'A', 'd', 'D', 'w', 'W', 's', 'S',
      ' ', 'r', 'R', 'Enter', 'Escape'
    ];

    commonKeys.forEach(key => {
      this.keys.set(key, false);
    });

    // Initialize commonly used key codes
    const commonKeyCodes = [
      32, // Space
      37, 38, 39, 40, // Arrow keys
      65, 68, 83, 87, // WASD
      82, // R key
      13, // Enter
      27  // Escape
    ];

    commonKeyCodes.forEach(keyCode => {
      this.keyCodes.set(keyCode, false);
    });
  }

  public setKeyPressed(key: string, keyCode: number, pressed: boolean): void {
    this.keys.set(key, pressed);
    this.keyCodes.set(keyCode, pressed);
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public isKeyCodePressed(keyCode: number): boolean {
    return this.keyCodes.get(keyCode) || false;
  }

  public update(): void {
    // This method can be used for any per-frame input processing
    // Currently not needed but available for future extensions
  }

  // Convenience methods for common controls
  public isMovingLeft(): boolean {
    return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a') || this.isKeyPressed('A');
  }

  public isMovingRight(): boolean {
    return this.isKeyPressed('ArrowRight') || this.isKeyPressed('d') || this.isKeyPressed('D');
  }

  public isJumping(): boolean {
    return this.isKeyPressed('ArrowUp') || this.isKeyPressed('w') || this.isKeyPressed('W') || this.isKeyPressed(' ');
  }

  public isMovingDown(): boolean {
    return this.isKeyPressed('ArrowDown') || this.isKeyPressed('s') || this.isKeyPressed('S');
  }

  // Get all currently pressed keys (for debugging)
  public getPressedKeys(): string[] {
    const pressed: string[] = [];
    this.keys.forEach((isPressed, key) => {
      if (isPressed) {
        pressed.push(key);
      }
    });
    return pressed;
  }

  // Clear all key states (useful for game state changes)
  public clearAll(): void {
    this.keys.forEach((value, key) => {
      this.keys.set(key, false);
    });
    this.keyCodes.forEach((value, keyCode) => {
      this.keyCodes.set(keyCode, false);
    });
  }
}