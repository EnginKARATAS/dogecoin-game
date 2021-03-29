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

 

setInterval(heartbeat, 500);

function heartbeat() {
  io.sockets.emit('heartbeat', rects);
  checkIfEat();

  function checkIfEat() {
    for (let i = 0; i < rects.length; i++) {
      const rectX = rects[i].x;
      const rectY = rects[i].y;

      for (let j = 0; j < cookies.length; j++) {
        const cookiesX = cookies[j].x;
        const cookiesY = cookies[j].y;
        if (Math.abs(rectX - cookiesX) < 10 && Math.abs(rectY - cookiesY) < 10) {
          cookies.splice(j,1);
        }
      }
    }
  }
  io.sockets.emit('heartbeat', rects, cookies);
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