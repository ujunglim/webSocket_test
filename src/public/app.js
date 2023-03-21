alert('This is frontend');
// 서버로 연결!
const socket = new WebSocket(`ws://${window.location.host}`); // 프론트,서버 연결성공! socket을 이용해 프론트에서 서버로 메세지 전송가능!

socket.addEventListener('open', () => {
    console.log('Connected to Server ✅');
});

socket.addEventListener('message', (msg) => {
    console.log('💾 Message from server: ', msg.data)
});

socket.addEventListener('error', (err) => {
    console.log('error: ', err)
})

socket.addEventListener('close', () => {
    console.log('Disconnected to server ❌')
})

setTimeout(() => {
    socket.send('Hello from brower 👋')
}, 5000);

