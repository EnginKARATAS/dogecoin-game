class Player {

    constructor() {
        this.r = 10;
        this.x = width/2;
        this.y = height/2;
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
    }
    reduceSize(){
        this.r -=3
    };
    eat() {
        this.r += 3;
        return true;
    }
    show() {
        translate(width / 2, height / 2);
        let newzoom = 64 / player.r;
        zoom = lerp(zoom, newzoom, 0.05);
        scale(zoom);
        translate(-player.x, -player.y);
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