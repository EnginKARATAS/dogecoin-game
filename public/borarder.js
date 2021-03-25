class Boarder {
    constructor() {
        this.xBoarderSize = 80;
        this.boarderPos = width - this.xBoarderSize;
        this.clientCounter = 0;

        this.clientY = 20;

        this.clients = [];

        this.showClients = function () {
            fill(128, 0, 128);
            for (let i = 0; i < this.clients.length; i++) {
                text(this.clients[i], this.boarderPos + 14, this.clientY+10+i*10);
            }
        }
    }

    showBoarder() {
        fill(0, 60);
        rect(this.boarderPos, 0, this.xBoarderSize, 150);
        fill(0);
        textSize(12);
        text("users", this.boarderPos+14, 14);
        this.showClients();
    }


    addClientToBoarder(client) {
        this.clients.push(client);
    }



}