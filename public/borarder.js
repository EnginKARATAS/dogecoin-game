class Boarder {
    constructor() {
        this.xBoarderSize = 80;
        this.boarderPos = width - this.xBoarderSize;
        this.rectCounter = 0;

        this.rectY = 20;

        this.rects = [];

        this.showRects = function () {
            fill(128, 0, 128);
            for (let i = 0; i < this.rects.length; i++) {
                text(this.rects[i].id, this.boarderPos + 14, this.rectY + 10 + i * 10);
            }
        }
        this.showBoarder = function () {
            fill(0, 60);
            rect(this.boarderPos, 0, this.xBoarderSize, 150);
            fill(0);
            textSize(12);
            text("users", this.boarderPos + 14, 14);
        }
    }

    assign(){
        this.rects = rects;
    }

    show() {
        this.showBoarder();
        this.showRects();
    }

}