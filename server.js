// Setup express web server and listen on port 3000
let express = require('express');
let app = express();
let port = Number(process.env.PORT || 3000);
let server = app.listen(port);

app.use(express.static('public'));
console.log("My socket server is running on port " + port);

// Start socket.io
let socket = require('socket.io');

// Connect it to the web server
let io = socket(server);

//all clients
let rects = [];
let cookies = [];

// Setup a connection
function Rect(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

function Cookie() {
  this.y = Math.floor(Math.random() * 401);;
  this.x = Math.floor(Math.random() * 401);;
  this.r = 6;

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
}

for (let i = 0; i < 10; i++) {
  cookies.push(new Cookie());
}

setInterval(heartbeat, 33);

function heartbeat() {
  // console.log("cookies");
  // console.log(cookies);
  // console.log("rects");
  // console.log(rects);
  io.sockets.emit('heartbeat', rects, cookies);
}

io.on('connection', socket => {
  console.log(rects);
  let id = socket.id.substring(1, 7);

  socket.on('disconnect', () => {
    for (let i = 0; i < rects.length; i++) {
      let value = rects[i].id;
      let isId = value == id
      if (isId) {
        console.log("i:" + i + "--");
        rects.splice(i, 1);
      }
    }
  });

  socket.on("eated", index => {
    cookies.splice(index, 1);
  });


  socket.on('start', data => {
    // console.log(id + ' ' + data.x + ' ' + data.y);
    let rect = new Rect();
    rect.id = id;
    rect.x = data.x;
    rect.y = data.y;
    rect.r = data.r;

    rects.push(rect);
  });

  socket.on('update', data => {
    let rect;
    for (let i = rects.length - 1; i >= 0; i--) {
      if (id == rects[i].id) {
        rect = rects[i];
      }
    }
    rect.x = data.x;
    rect.y = data.y;
    rect.r = data.r;
  });

  //when mouse message comes, socket.on('mouse',mouseMsg) working
  socket.on('mouse', mouseMsg)

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    //do can be useful for online pacman game?
    // io.socket.emit('mouse', data)
  }
});