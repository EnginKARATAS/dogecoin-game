
var socket = io();
var boarder;
var player;
let rects = [];
let cookies = [];

let way = 4; //0:up 1:right 2:down 3:left

function setup() {
  createCanvas(1200, 480);
  // setTimeout(()=>{console.log("world2!")}, 4000)

  // for (let i = 0; i < 10; i++) {
  //   cookies.push(new Cookie());
  // }

  // Start a socket connection to the server

  socket.on('heartbeat', (_rects, _cookies) => {
    rects = _rects;
    boarder.rects = _rects;
    cookies = _cookies
  });


  socket.on('mouse', data => {
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
  socket.emit('start', data);
}

function draw() {
  background(200, 222, 20);
  boarder.show();
  player.show();
  player.update(way);
  way = 5;
  checkIfEat();
  //------------------------------------------------



  function checkIfEat() {
    for (let j = cookies.length - 1; j >= 0; j--) {
      const cookiesX = cookies[j].x;
      const cookiesY = cookies[j].y;
      if (Math.abs(player.x - cookiesX) < 10 && Math.abs(player.y - cookiesY) < 10) {
        console.log(j);
        cookies.splice(j, 1);
        socket.emit("eated", j);
        player.eat()
      }
    }
  }

  //------------------------------------------------
  for (let j = 0; j < cookies.length; j++) {
    ellipse(cookies[j].x, cookies[j].y, cookies[j].r, cookies[j].r);
    // if (cookies[j].eats(player)) {
    //   cookies.splice(j, 1);
    //   player.r += 6;
    // }
  }

  for (let i = 0; i < rects.length; i++) {
    fill(0)
    fill(random(255), random(255), random(255));
    rect(rects[i].x, rects[i].y, rects[i].r, rects[i].r,);
  }

  for (let i = 0; i < cookies.length; i++) {
    fill(0)
    ellipse(cookies[i].x, cookies[i].y, cookies[i].r, cookies[i].r,);
  }

  let playerData = {
    x: player.x,
    y: player.y,
    r: player.r
  }

  socket.emit('update', playerData);
}

