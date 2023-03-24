import express from 'express';
import http from 'http';
import SocketIo from 'socket.io';

const app = express();

app.set('view engine', 'pug'); // 뷰엔진은 pug로 설정
app.set('views', __dirname + '/views'); // 템플릿이 있는 폴더위치
app.use('/public', express.static(__dirname + '/public')); // pubilc 폴더를 유저에게 공개
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const httpServer = http.createServer(app); // express app으로부터 http서버생성
const io = SocketIo(httpServer);

io.on('connection', socket => {
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  })

  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  })

  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer)
  })
})

httpServer.listen(3000, () => console.log('Listening 3000~~')); // 서버는 http,ws프로토콜 모두 이해할 수 있다.
