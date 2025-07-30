export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  LOADING = 'loading'
}

export class GameStateManager {
  private currentState: GameState;
  private previousState: GameState;
  private stateHistory: GameState[] = [];
  private stateChangeCallbacks: Map<GameState, (() => void)[]> = new Map();

  constructor(initialState: GameState = GameState.MENU) {
    this.currentState = initialState;
    this.previousState = initialState;
    this.stateHistory.push(initialState);
    
    // Initialize callback arrays for each state
    Object.values(GameState).forEach(state => {
      this.stateChangeCallbacks.set(state, []);
    });
  }

  public setState(newState: GameState): void {
    if (newState === this.currentState) {
      return; // No change needed
    }

    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateHistory.push(newState);

    // Keep history limited to prevent memory issues
    if (this.stateHistory.length > 10) {
      this.stateHistory.shift();
    }

    // Trigger callbacks for the new state
    this.triggerStateChangeCallbacks(newState);

    console.log(`Game state changed: ${this.previousState} -> ${this.currentState}`);
  }

  public getCurrentState(): GameState {
    return this.currentState;
  }

  public getPreviousState(): GameState {
    return this.previousState;
  }

  public isState(state: GameState): boolean {
    return this.currentState === state;
  }

  public isAnyState(states: GameState[]): boolean {
    return states.includes(this.currentState);
  }

  // Check if the game is in a playable state
  public isPlayable(): boolean {
    return this.currentState === GameState.PLAYING;
  }

  // Check if the game is paused or can be paused
  public isPausable(): boolean {
    return this.currentState === GameState.PLAYING || this.currentState === GameState.PAUSED;
  }

  // Toggle between playing and paused states
  public togglePause(): boolean {
    if (this.currentState === GameState.PLAYING) {
      this.setState(GameState.PAUSED);
      return true;
    } else if (this.currentState === GameState.PAUSED) {
      this.setState(GameState.PLAYING);
      return true;
    }
    return false;
  }

  // Go back to the previous state (if valid)
  public goToPreviousState(): boolean {
    const validTransitions = [
      { from: GameState.PAUSED, to: GameState.PLAYING },
      { from: GameState.GAME_OVER, to: GameState.MENU },
      { from: GameState.PLAYING, to: GameState.MENU }
    ];

    const validTransition = validTransitions.find(
      transition => transition.from === this.currentState && transition.to === this.previousState
    );

    if (validTransition) {
      this.setState(this.previousState);
      return true;
    }
    return false;
  }

  // Register a callback to be called when entering a specific state
  public onStateEnter(state: GameState, callback: () => void): void {
    const callbacks = this.stateChangeCallbacks.get(state);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  // Remove a callback for a specific state
  public removeStateCallback(state: GameState, callback: () => void): void {
    const callbacks = this.stateChangeCallbacks.get(state);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private triggerStateChangeCallbacks(state: GameState): void {
    const callbacks = this.stateChangeCallbacks.get(state);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error(`Error executing state change callback for ${state}:`, error);
        }
      });
    }
  }

  // Get state history for debugging
  public getStateHistory(): GameState[] {
    return [...this.stateHistory];
  }

  // Reset state manager to initial state
  public reset(): void {
    this.setState(GameState.MENU);
    this.stateHistory = [GameState.MENU];
  }

  // Check if a state transition is valid
  public isValidTransition(fromState: GameState, toState: GameState): boolean {
    // Define valid state transitions
    const validTransitions: { [key: string]: GameState[] } = {
      [GameState.MENU]: [GameState.PLAYING, GameState.LOADING],
      [GameState.LOADING]: [GameState.PLAYING, GameState.MENU],
      [GameState.PLAYING]: [GameState.PAUSED, GameState.GAME_OVER, GameState.MENU],
      [GameState.PAUSED]: [GameState.PLAYING, GameState.MENU],
      [GameState.GAME_OVER]: [GameState.MENU, GameState.PLAYING]
    };

    const allowedTransitions = validTransitions[fromState];
    return allowedTransitions ? allowedTransitions.includes(toState) : false;
  }

  // Force a state change (bypasses validation)
  public forceSetState(newState: GameState): void {
    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateHistory.push(newState);

    if (this.stateHistory.length > 10) {
      this.stateHistory.shift();
    }

    this.triggerStateChangeCallbacks(newState);
    console.log(`Game state force changed: ${this.previousState} -> ${this.currentState}`);
  }
}