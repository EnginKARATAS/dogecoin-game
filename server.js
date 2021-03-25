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

setInterval(heartbeat, 500);

function heartbeat() {
  io.sockets.emit('heartbeat', (rects, cookies));
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

    send('disconn', id)
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

  socket.on('start2', data => {

    let cookie = {
      x:55,
      y:55,
      r:6
    }
    for (let i = 0; i < 10; i++) {
      cookies.push("cookie");
    }

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

  socket.on('update2', data => {
    cookies = data;
    console.log(cookies);
  });

  function send(vareible, message) {
    io.emit(vareible, message);
  }

  //when mouse message comes, socket.on('mouse',mouseMsg) working
  socket.on('mouse', mouseMsg)

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    //do can be useful for online pacman game?
    // io.socket.emit('mouse', data)
  }

});