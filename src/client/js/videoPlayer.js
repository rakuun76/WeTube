const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoControls = document.getElementById("videoControls");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeRange = document.getElementById("volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let volume = 1;
let timeformat_w = 0;
let hideTimeoutId = null;

const handleVideoEnd = () => {
  playBtn.innerText = "Play";
};

const handlePlayBtnClick = () => {
  if (video.paused) {
    playBtn.innerText = "Pause";
    video.play();
  } else {
    playBtn.innerText = "Play";
    video.pause();
  }
};

const mute = () => {
  muteBtn.innerText = "Unmute";
  video.muted = true;
};

const unmute = () => {
  muteBtn.innerText = "Mute";
  video.muted = false;
};

const handleMuteBtnClick = () => {
  if (video.muted) {
    volumeRange.value = volume;
    unmute();
  } else {
    volumeRange.value = 0;
    mute();
  }
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (value !== "0") {
    volume = value;
  }
};

const handleVolumeInput = (event) => {
  const {
    target: { value },
  } = event;

  if (value === "0") {
    mute();
  } else {
    unmute();
  }

  video.volume = value;
};

//time format을 위한 가중치 결정
const setWeight = (duration) => {
  if (duration < 600) {
    timeformat_w = 4;
  } else if (duration < 3600) {
    timeformat_w = 3;
  } else if (duration < 36000) {
    timeformat_w = 1;
  } else {
    timeformat_w = 0;
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().slice(11 + timeformat_w, 19);

const handleLoadedMetadata = () => {
  setWeight(video.duration);
  currentTime.innerText = formatTime(0);
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration * 10) / 10;
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime * 10) / 10;
};

const handleTimelineInput = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreenBtnClick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

//ESC 같은 조작이 발생했을 때에도 버튼 텍스트 변경을 위해
const handleFullscreenchange = () => {
  if (document.fullscreenElement) {
    fullscreenBtn.innerText = "Exit Fullscreen";
  } else {
    fullscreenBtn.innerText = "Enter Fullscreen";
  }
};

const hideVideoControls = () => videoControls.classList.remove("showing");

const handleMousemove = () => {
  videoControls.classList.add("showing");

  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  hideTimeoutId = setTimeout(hideVideoControls, 3000);
};

const handleMouseleave = () => {
  hideVideoControls();
};

video.addEventListener("ended", handleVideoEnd);
playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
volumeRange.addEventListener("change", handleVolumeChange);
volumeRange.addEventListener("input", handleVolumeInput);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineInput);
fullscreenBtn.addEventListener("click", handleFullscreenBtnClick);
document.addEventListener("fullscreenchange", handleFullscreenchange);
videoContainer.addEventListener("mousemove", handleMousemove);
videoContainer.addEventListener("mouseleave", handleMouseleave);
