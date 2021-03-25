class Player{

    constructor(){
        this.x = 20;
        this.y = random(20, height*0.8);
        this.color = color(random(0,100),random(0,100),random(0,100));
    }

    show(){
        fill(this.color)
        rect(this.x, this.y, 20, 20);
    }

    move(){
        this.color = color(random(0,100),random(0,100),random(0,100));
        this.x += 10;
    }

}