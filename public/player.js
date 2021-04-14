class Player {

    constructor() {
        this.r = 10;
        this.x = 20;
        this.y = floor(random(20, height * 0.8));
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
    }

    eat() {
        this.r += 3;
        return true;
    }

    show() {
        translate(width/2, height/2);
        scale( 128 /player.r);
        translate(-player.x,-player.y);
        rect(this.x, this.y, this.r, this.r);
    }

    update(way) {
        if (way == 0) {
            this.y -= 10;
        }
        else if (way == 1) {
            this.x += 10;
        }
        else if (way == 2) {
            this.y += 10;
        }
        else if (way == 3) {
            this.x -= 10;
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