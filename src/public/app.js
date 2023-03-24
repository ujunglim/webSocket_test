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
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if(currentCamera.abel === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    })
    console.log(cameras)

  } catch (e) {
    console.error(e)
  }
}

// get 
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
getMedia();

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