import express from 'express';
import http from 'http';
import WebSocket from 'ws';
const app = express();

app.set('view engine', 'pug'); // 뷰엔진은 pug로 설정
app.set('views', __dirname + '/views'); // 템플릿이 있는 폴더위치
app.use('/public', express.static(__dirname + '/public')); // pubilc 폴더를 유저에게 공개
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const server = http.createServer(app); // express app으로부터 http서버생성
const wss = new WebSocket.Server({server}); // http서버위에 webSocket서버생성, 위의 http로 만든 server는 필수 X - 이렇게 하면 http / ws 서버 모두 같은 3000번 포트를 이용해서 돌릴 수 있다!

// 서버, 프론트 연결
wss.on("connection", (socket) => { // wss서버에 브라우저 연결이 됬을때, socket(=연결된 브라우저)을 콜백으로 받는다 / socket을 통해 frontend와 real-time 소통가능!
    console.log('Connected to Broswer ✅');
    socket.on('close', () => console.log('Disconnected to Server ❌')) // 서버를 끌때
    socket.on('message', message => {
        const utfMsg = message.toString('utf8'); // 프론트로부터 온 메세지는 버퍼형태로 전달되기때문에 toString을 사용해 utf8로 변환!
        console.log('🖥 Message from Browser: ', utfMsg); // 프론트로부터 메세지 받기 
    })
    socket.send('Hello from server!'); // 프론트로 메시지 보내기
}); 

server.listen(3000, () => console.log('Listening 3000~~')); // 서버는 http,ws프로토콜 모두 이해할 수 있다.
