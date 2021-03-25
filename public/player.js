class Player {

    constructor() {
        this.r = 10;
        this.x = 20;
        this.y = random(20, height * 0.8);
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
    }

    show() {
        fill(this.color)
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