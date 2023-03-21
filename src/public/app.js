// alert('This is frontend');
const msgList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const msgForm = document.querySelector('#msg');

// string 형태로 바꿔주는 함수 (사용하는 클라이언트가 GO, JAVA일 수 도 있기때문에 JS Object형태로 보내면 안 되고, String형태로 보내 모든 언어에 맞출수 있게 한다!)
const makeMsg = (type, payload) => {
    return JSON.stringify({type, payload});
}

const handlSendPaylod = (e) => {
    const type = e.target.id;
    e.preventDefault();
    const input = (type === "nickname" ? nicknameForm : msgForm).querySelector('input');
    const inputValue = input.value;
    socket.send(makeMsg(type, inputValue));
    input.value = '';
}

nicknameForm.addEventListener('submit', handlSendPaylod)
msgForm.addEventListener('submit', handlSendPaylod);
// 서버로 연결!
const socket = new WebSocket(`ws://${window.location.host}`); // 프론트,서버 연결성공! socket을 이용해 프론트에서 서버로 메세지 전송가능!

socket.addEventListener('open', () => {
    console.log('Connected to Server ✅');
});

socket.addEventListener('message', (msg) => {
    const li = document.createElement('li');
    li.innerText = msg.data;
    msgList.append(li);
});

socket.addEventListener('error', (err) => {
    console.log('error: ', err)
})

socket.addEventListener('close', () => {
    console.log('Disconnected to server ❌')
})

