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

// Setup a connection
io.sockets.on('connection', newConnection);

function Rect(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

setInterval(heartbeat, 1000);

function heartbeat() {
  io.sockets.emit('heartbeat', rects);
}


function newConnection(socket) {

  let id = socket.id;
  send('new_client_boarder', id);

  socket.on('start', data=>{
    console.log(socket.id + ' ' + data.x + ' ' + data.y);

    let rect = new Rect();
    rect.id = socket.id;
    rect.x = data.x;
    rect.y = data.y;

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

  function send(vareible, message) {
    io.emit(vareible, message);
  }
  console.log("socket id : " + socket.id);
  //when mouse message comes, socket.on('mouse',mouseMsg) working
  socket.on('mouse', mouseMsg)

  function mouseMsg(data) {
    console.log(data);
    socket.broadcast.emit('mouse', data);
    //do can be useful for online pacman game?
    // io.socket.emit('mouse', data)
  }
}