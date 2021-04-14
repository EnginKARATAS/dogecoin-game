
function Cookie() {
    this.y = Math.floor(Math.random() * 401);;
    this.x = Math.floor(Math.random() * 401);;
    this.r = 6;
    this.vel = createVector(0, 0);

        this.show = function () {
        fill(255);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };
}
