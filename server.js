const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/public');
console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
console.log("listening on port" + 3000);
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

//all clients
let rects = [];
let cookies = [];

// Setup a connection
function Rect(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}


function Cookie() {
  this.y = Math.floor(Math.random() * 401);;
  this.x = Math.floor(Math.random() * 401);;
  this.r = 6;
}
for (let i = 0; i < 10; i++) {
  cookies.push(new Cookie());
}
io.sockets.emit('cookies', cookies);


setInterval(heartbeat, 1000);

function heartbeat() {
  io.sockets.emit('heartbeat', rects, cookies);

  // checkIfEat();

  function checkIfEat() {
    let rect;
    for (let i = 0; i < rects.length; i++) {

      const rectX = rect.x;
      const rectY = rect.y;
      for (let j = 0; j < cookies.length; j++) {
        const cookiesX = cookies[j].x;
        const cookiesY = cookies[j].y;
        if (Math.abs(rectX - cookiesX) < 10 && Math.abs(rectY - cookiesY) < 10) {
          socket.emit("grove",(""));
          cookies.splice(j, 1);
        }
      }
    }
  }
}

io.on('connection', socket => {
  let id = socket.id.substring(1, 7);

  socket.on('disconnect', () => {

    for (let i = 0; i < rects.length; i++) {
      const isDeleteId = rects[i].id;
      if (isDeleteId == id) {
        rects.splice(i, 1);
      }
    }
    socket.emit('disconn', id)
  });

  socket.on('isEatCookie', i=> {
    cookies.splice(i,1);
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
    for (let i = 0; i < rects.length; i++) {
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