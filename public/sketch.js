
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
  
  socket.on('cookies',data=>{
    cookies = data;
  })
  socket.on('heartbeat', (_rects, _cookies)=>{
    rects = _rects;
    cookies = _cookies;
    for (let i = 0; i < rects.length; i++)
      boarder.addRectToBoarder(rects[i].id);
  });

  socket.on('disconn', rectId => {
    boarder.deleteUser(rectId);
  });

  
  boarder = new Boarder();
  player = new Player();


  let data = {
    x: player.x,
    y: player.y,
    r: player.r
  }

  socket.emit('start', data);

  socket.on('grove',()=>{
    player.r +=10;
  })
}

function draw() {
  background(200, 222, 20);
  boarder.show();
  player.show();
  player.update(way);
  way = 5;
 
//show users
  for (let i = 0; i < rects.length; i++) {
    fill(0)
    fill(random(255), random(255), random(255));
    rect(rects[i].x, rects[i].y, rects[i].r, rects[i].r);
  }
//show, check cookies
 
  for (let i = 0; i <cookies.length; i++) {
    if (cookies[i].eats(player) && cookies.length> 0) {
      socket.emit('isEatCookie',i)
    }
    console.log(i);
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

 
 