const socket = io(); // io함수는 자동으로 연결된 socket을 추가한다.

const videoDom = document.getElementById('video');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const cameraSelect = document.getElementById('cameraSelect');

let myStream = null; // stream은 비디오, 오디오가 결합된 것
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      cameraSelect.appendChild(option);
    })
    console.log(cameras)

  } catch (e) {
    console.error(e)
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    console.log(myStream);
    videoDom.srcObject = myStream;
    await getCameras();
  } catch (e) {
    console.error(e)
  }
}
getMedia();

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

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);