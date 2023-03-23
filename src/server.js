import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug'); // 뷰엔진은 pug로 설정
app.set('views', __dirname + '/views'); // 템플릿이 있는 폴더위치
app.use('/public', express.static(__dirname + '/public')); // pubilc 폴더를 유저에게 공개
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const httpServer = http.createServer(app); // express app으로부터 http서버생성
const io = SocketIO(httpServer);

// get named-rooms
const getPublicRooms = () => {
  const { sockets: { adapter: { sids, rooms } } } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (!sids.get(key)) {
      publicRooms.push(key);
    }
  })
  return publicRooms;
}

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on('connection', (socket) => {
  socket.nickname = 'Anonymous';
  socket.onAny((event) => console.log(`Socket Event: ${event}`));

  socket.on('enter_room', (roomName, showRoom) => {
    socket.join(roomName); // 방에 들어감
    showRoom();
    io.to(roomName).emit('welcome', socket.nickname, countRoom(roomName)); // roomName방에 있는 모든 사람들한테 welcome이벤트를 날린다.(주의 socket이 아니라 io)
    io.sockets.emit("room_change", getPublicRooms());
  })
  // before disconnect
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => io.to(room).emit('bye', socket.nickname)); // 이 소켓이 있는 모든 방에 bye
  })
  // disconnected
  socket.on('disconnect', () => {
    io.sockets.emit("room_change", getPublicRooms());
  })
  // nickname
  socket.on('nickname', (nickname) => {
    socket.nickname = nickname;
  })
  // new_msg
  socket.on('new_msg', (roomName, msg) => {
    io.to(roomName).emit('new_msg', `${socket.nickname}: ${msg}`);
  })
})

httpServer.listen(3000, () => console.log('Listening 3000~~')); // 서버는 http,ws프로토콜 모두 이해할 수 있다.
