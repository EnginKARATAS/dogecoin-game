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
  this.x = Math.floor(Math.random() * 1115);;
  this.y = Math.floor(Math.random() * 480);;
  this.r = 6;
}

for (let i = 0; i < 25; i++) {
  cookies.push(new Cookie());
}

setInterval(heartbeat, 33);
setInterval(addCookies,500);

function addCookies(){
  if (cookies.length < 60) { //number of cookies
    cookies.push(new Cookie());
  }
  
};
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

  socket.on("giveId",()=>{
    socket.emit("yourId",id)
    
  })

  socket.on('disconnect', () => {
    for (let i = 0; i < rects.length; i++) {
      let value = rects[i].id;
      let isId = value == id
      if (isId) {
        console.log("i:" + i + "--");
        rects.splice(i, 1);
      }
    }
  });s

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

  //when mouse message comes, socket.on('mouse',mouseMsg) working//TESTİNG!
  // socket.on('mouse', mouseMsg)

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    //do can be useful for online pacman game?
    // io.socket.emit('mouse', data)
  }
});