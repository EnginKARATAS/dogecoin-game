export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Create a copy of this vector
  public copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  // Add another vector to this vector
  public add(other: Vector2D): Vector2D {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  // Subtract another vector from this vector
  public subtract(other: Vector2D): Vector2D {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  // Multiply this vector by a scalar
  public multiply(scalar: number): Vector2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // Divide this vector by a scalar
  public divide(scalar: number): Vector2D {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  // Get the magnitude (length) of this vector
  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Normalize this vector (make it unit length)
  public normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag > 0) {
      this.divide(mag);
    }
    return this;
  }

  // Get the distance between this vector and another
  public distance(other: Vector2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Set the values of this vector
  public set(x: number, y: number): Vector2D {
    this.x = x;
    this.y = y;
    return this;
  }

  // Static methods for creating new vectors
  static add(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }

  static multiply(v: Vector2D, scalar: number): Vector2D {
    return new Vector2D(v.x * scalar, v.y * scalar);
  }

  static distance(v1: Vector2D, v2: Vector2D): number {
    return v1.distance(v2);
  }
}