
function Cookie() {
    this.y = Math.floor(Math.random() * 401);;
    this.x = Math.floor(Math.random() * 401);;
    this.r = 6;
    this.vel = createVector(0, 0);

    this.eats = function (other) {
        let d = dist(this.x, this.y, other.x, other.y);
        if (d < this.r + other.r) {
            var sum = PI * this.r * this.r + PI * other.r * other.r;
            //this.r += other.r;
            return true;
        } else {
            return false;
        }
    };


    this.show = function () {
        fill(255);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };
}
