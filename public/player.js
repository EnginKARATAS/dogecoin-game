class Player {

    constructor() {
        this.r = 10;
        this.x = width/2;
        this.y = height/2;
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
        this.id=id;
    }
    reduceSize(){
        // this.r -=0;  
    };
    eat() {
        this.r += 0.5;
        return true;
    }
    show() {
        //FPS MODE
        // translate(width/2, height/2);
        // scale( 20 /player.r*2);
        // translate(-player.x,-player.y);
        //p5 image scaling screw up image quality
        rect(this.x, this.y, this.r, this.r);
    }
    update(way) {
        if (way == 0) {
            this.y -= 15;
        }
        else if (way == 1) {
            this.x += 15;
        }
        else if (way == 2) {
            this.y += 15;
        }
        else if (way == 3) {
            this.x -= 15;
        }
        else {
            this.x += 0;
            this.y += 0;
        }
    }

    move() {
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
    }

}