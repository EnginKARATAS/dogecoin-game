
var socket = io();
var boarder;
var player;
let rects = [];
let cookies = [];
let zoom = 1;
let way = 4; //0:up 1:right 2:down 3:left
let id = "";

let doge;
let dogeplayer;
function preload() {
  doge = loadImage('assets/images/doge.png');
  dogeplayer = loadImage('assets/images/dogeplayer.png');
}

function setup() {
  createCanvas(1200, 480);

  // setTimeout(()=>{console.log("world2!")}, 4000)

  // for (let i = 0; i < 10; i++) {
  //   cookies.push(new Cookie());
  // }

  // Start a socket connection to the server

  socket.emit("giveId");
  socket.on("yourId", _id => { 
    console.log("your id");
    console.log(_id);
    player.id = _id; 
  });

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
  background(155, 222, 50);

  textStyle(BOLDITALIC);
  let displayTexts = [
		[50, 50, "welcome to doge-game.."],
		[200, 50, "play with friends.."],
		[550, 50, "github/EnginKARATAS"],
		[700, 50, "play with ⬅➡⬆⬇ or W A S D keys"]]
  let [text1, text2, text3, text4] = displayTexts;
  text(text1[2], text1[0], text1[1]) //text, x, y,
  text(text2[2], text2[0], text2[1]) //text, x, y,
  text(text3[2], text3[0], text3[1]) //text, x, y,
  text(text4[2], text4[0], text4[1]) //text, x, y,

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
      if (Math.abs(player.x + player.r / 2 - cookiesX) < 5 + player.r / 2 && Math.abs(player.y + player.r / 2 - cookiesY) < 5 + player.r / 2) {
        console.log(j);
        cookies.splice(j, 1);
        socket.emit("eated", j, player.x, player.y);
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
    if (player.id != rects[i].id) {
      image(dogeplayer, rects[i].x - 25, rects[i].y - 25);
      dogeplayer.resize(rects[i].r + 40, rects[i].r + 40);
    }


  }

  for (let i = 0; i < cookies.length; i++) {
    fill(0)
    image(doge, cookies[i].x - 16, cookies[i].y - 16);
    doge.resize(cookies[i].r + 16, cookies[i].r + 16);

  }

  let playerData = {
    x: player.x,
    y: player.y,
    r: player.r
  }

  socket.emit('update', playerData);

  if (frameCount % 60 == 0) {
    if (player.r > 10 && player.r < 64) {
      // player.r -= 1;
    }
    else if (player.r > 64) {
      // player.r -= 3
    }
  }
}

