const socket = io(); // io함수는 자동으로 연결된 socket을 추가한다.

const videoDom = document.getElementById('video');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const cameraSelect = document.getElementById('cameraSelect');

let myStream = null; // stream은 비디오, 오디오가 결합된 것
let muted = false;
let cameraOff = false;
let currRoomName;
let myPeerConnection;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if(currentCamera.abel === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });

  } catch (e) {
    console.error(e)
  }
}

async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: {facingMode: 'user'}
  }

  const newConstraints = {
    audio: true,
    video: {deviceId: {exact: deviceId}}
  }

  try {
    myStream = await navigator.mediaDevices.getUserMedia(deviceId ? newConstraints : initialConstraints);
    videoDom.srcObject = myStream;
    if(!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.error(e)
  }
}

// =================== HANDLER =====================
const handleMuteClick = () => {
  if (muted) {
    muteBtn.innerText = 'Unmute';
  } else {
    muteBtn.innerText = 'Mute';
  }
  muted = !muted;
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
}

const handleCameraClick = () => {
  if (cameraOff) {
    cameraBtn.innerText = 'Turn camera off'
  } else {
    cameraBtn.innerText = 'Turn camera on'
  }
  cameraOff = !cameraOff;
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
}

const handleCameraSelect = () => {
  getMedia()
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
cameraSelect.addEventListener('input', handleCameraSelect);

// =================== Welcome form ===================
const welcomeDiv = document.getElementById('welcome');
const welcomeForm = welcomeDiv.querySelector('form');
const callDiv = document.getElementById('call');

callDiv.hidden = true;

async function initCall() {
  welcomeForm.hidden = true;
  callDiv.hidden = false;
  // get video, audio
  await getMedia();
  makeConnection();
}

const handleWelcomeSubmit = async (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector('input');
  await initCall(); // webRTC 연결속도가 myPeerConnection를 만드는거보다 빨라서 미리 myPeerConnection를 만들어준다 
  socket.emit('join_room', input.value);
  currRoomName = input.value;
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// ============== Socket code ==============
// broswer1
socket.on('welcome', async () => {
  const offer =  await myPeerConnection.createOffer(); // 다른 브라우저를 초대하는 초대장 만들기
  await myPeerConnection.setLocalDescription(offer) // 만든 초대장으로 연결하기
  socket.emit('offer', offer, currRoomName)// 다른 브라우저에 초대장 보내기 (socketio한테 어떤방이 이 offer를 emit하는지, 누구한테 이 offer를 보낼건지 알려줘야함)
})

// broswer2
// recieve offer
socket.on('offer', async (offer) => {
  // set remote offer
  await myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  await myPeerConnection.setLocalDescription(answer) // 만든 초대장으로 연결하기
  socket.emit('answer', answer, roomName)
})

// broswer1
socket.on('answer', answer => {
  await myPeerConnection.setRemoteDescription(answer);
})

// ============== RTC code ==============
//  각 브라우저에 RTC연결하기
function makeConnection() {
  myPeerConnection = new RTCPeerConnection(); // 각 브라우저에 p2p연결을 만든다
  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream)); // 각 브라우저의 비디오, 오디오 데이터 stream을 받아서 연결 안에 집어 넣는다
}