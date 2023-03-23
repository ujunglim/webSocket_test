const socket = io(); // io함수는 자동으로 연결된 socket을 추가한다.

const welcomeForm = document.querySelector('#welcome');
const roomDiv = document.querySelector('#room');
const roomListDiv = document.querySelector('#roomListDiv');
const msgList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const msgForm = document.querySelector('#msg');

let roomName;
roomDiv.hidden = true;

// ================= VIEW CONTROLLERS ====================
const showRoom = () => {
  roomDiv.hidden = false;
  welcomeForm.hidden = true;
}

const addMessage = (message) => {
  const msgList = roomDiv.querySelector('#msgList');
  const li = document.createElement('li');
  li.innerText = message;
  msgList.appendChild(li);
}

const renderTitle = (count) => {
  const roomTitle = document.querySelector('#roomTitle');
  roomTitle.innerText = `Room${roomName} (${count})`
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
socket.on('welcome', (user, count) => {
  renderTitle(count);
  addMessage(`${user} joined!`);
})

socket.on('bye', (user, count) => {
  renderTitle(count);
  addMessage(`${user} left T T`)
})

socket.on('new_msg', (msg) => {
  addMessage(msg);
})

socket.on('room_change', (rooms) => {
  const roomList = roomListDiv.querySelector('ul');
  roomList.innerHTML = '';
  if(rooms.length === 0) {
    return;
  }
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.appendChild(li);
  })
})

welcomeForm.addEventListener('submit', handleRoomSubmit);
nicknameForm.addEventListener('submit', handleNicknameSubmit);
msgForm.addEventListener('submit', handleMsgSubmit);
