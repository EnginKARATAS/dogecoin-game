
 var socket;
var boarder;
var player;
let rects = [];
let cookies = [];

let way = 4; //0:up 1:right 2:down 3:left


function setup() {
  createCanvas(400, 400);

  // setTimeout(()=>{console.log("world2!")}, 4000)


  // for (let i = 0; i < 10; i++) {
  //   cookies.push(new Cookie());
  // }

  // Start a socket connection to the server
  socket = io.connect('http://localhost:3000'); 


  socket.on('heartbeat', function (data,data2) {
    //console.log(data);
    rects = data;
    cookies = data2
    for (var i = 0; i < rects.length; i++)
      boarder.addRectToBoarder(rects[i].id);
  });

  socket.on('disconn', rectId => {
    boarder.deleteUser(rectId);
  });

  socket.on('mouse', data => {
    console.log("respond: " + data.y + " " + data.y);
    fill(0, 0, 255);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
  });
  boarder = new Boarder();
  player = new Player();


  let data = {
    x: player.x,
    y: player.y,
    r: player.r
  }
  
  let nothing ;
  socket.emit('start', data); 
  socket.emit('start2', nothing);   


}

function draw() {
  background(200, 222, 20);
  console.log(cookies);
  boarder.show();
  player.show();
  player.update(way);
	way = 5;

  for (let j = 0; j < cookies.length; j++) {
    cookies[j].show();
    if (cookies[j].eats(player)){
      cookies.splice(j, 1);
      player.r += 6;      
    }
  }

  


  for (let i = 0; i < rects.length; i++) {
    fill(0)
    fill(random(255),random(255),random(255));
    rect(rects[i].x, rects[i].y, rects[i].r, rects[i].r, );
  }

  console.log(cookies);
  for (let i = 0; i < cookies.length; i++) {
    fill(0)
  
    ellipse(cookies[i].x, cookies[i].y, cookies[i].r, cookies[i].r, );
  }

  let playerData = {
    x: player.x,
    y: player.y,
    r: player.r
  }

  socket.emit('update', playerData);
  socket.emit('update2',  cookies);
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