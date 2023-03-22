const socket = io(); // io함수는 자동으로 연결된 socket을 추가한다.

const welcomeForm = document.querySelector('#welcome');
const roomDiv = document.querySelector('#room');

const msgList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const msgForm = document.querySelector('#msg');

let roomName;
roomDiv.hidden = true;

// ================= VIEW CONTROLLERS ====================
const showRoom = () => {
  roomDiv.hidden = false;
  welcomeForm.hidden = true;

  // add room title
  const h3 = document.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
}

const addMessage = (message) => {
  const ul = roomDiv.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

// ================= HANDLER ====================
const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector('input');
  socket.emit(
    'enter_room',
    input.value,
    showRoom
  )
  roomName = input.value;
  input.value = '';
}

const handleNicknameSubmit = (e) => {
  e.preventDefault();
  const input = nicknameForm.querySelector('input');
  socket.emit('nickname', input.value);
  input.value = '';
}

const handleMsgSubmit = (e) => {
  e.preventDefault();
  const input = msgForm.querySelector('input');
  // socket.emit('new_msg', input.value, (nickname, msg) => addMessage(`${nickname}: ${msg}`));
  socket.emit('new_msg', roomName, input.value);
  input.value = '';
}

// ================= EVENT LISTENERS ====================
socket.on('welcome', () => {
  addMessage('someone joined!')
})

socket.on('bye', (user) => {
  addMessage(`${user} left T T`)
})

socket.on('new_msg', (msg) => {
  addMessage(msg);
})

welcomeForm.addEventListener('submit', handleRoomSubmit);
nicknameForm.addEventListener('submit', handleNicknameSubmit);
msgForm.addEventListener('submit', handleMsgSubmit);
