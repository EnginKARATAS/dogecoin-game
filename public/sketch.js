  
// Keep track of our socket connection
var socket;
var boarder;
var player;
let rects = [];
function setup() {
  createCanvas(400, 400);
  // Start a socket connection to the server
  socket = io.connect('http://localhost:3000');

  socket.on('new_client_boarder', client => {
    boarder.addClientToBoarder(client);

    socket.on('heartbeat', function(data) {
      //console.log(data);
      rects = data;
      console.log(rects);
    });
  });

  socket.on('mouse',
    // When we receive data
    function (data) {
      console.log("respond: " + data.y + " " + data.y);
      // Draw a blue circle
      fill(0, 0, 255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
  boarder = new Boarder();
  player = new Player();


  let data = {
    x: player.x,
    y: player.y,
 }
socket.emit('start', data);
  
 
}

function draw() {
  background(200, 222, 20);

  boarder.showBoarder();
  player.show();

  for (let i = 0; i < rects.length; i++) {
    fill(0)
    rect(rects[i].x, rects[i].y, 20, 20);
    
  }

  let playerData = {
    x:player.x,
    y:player.y
  }

  socket.emit('update', playerData);
}

function mouseDragged() {
  // Draw some white circles
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  console.log("sendmouse: " + mouseX + " " + mouseY);

 

  var data = {
    x: mouseX,
    y: mouseY
  };
  //I am a emmitter, and I am seperating all of my "data"
  socket.emit('mouse', data);

}