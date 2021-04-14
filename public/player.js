class Player {

    constructor() {
        this.r = 10;
        this.x = width/2;
        this.y = height/2;
        this.color = color(random(0, 100), random(0, 100), random(0, 100));
        this.id=id;
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
        let newzoom = 128 / player.r;
        zoom = lerp(zoom, newzoom, 0.1);
        scale(zoom*0.5);
        translate(-player.x, -player.y);
        image(dogeplayer, this.x- 25, this.y - 25);
        dogeplayer.resize(this.r + 40, this.r + 40);
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