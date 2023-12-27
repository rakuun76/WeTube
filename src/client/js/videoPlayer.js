const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoControls = document.getElementById("videoControls");
const playBtn = document.getElementById("playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenBtnIcon = fullscreenBtn.querySelector("i");

let volume = 1;
let timeformat_w = 0;
let hideTimeoutId = null;

const hideVideoControls = () => videoControls.classList.remove("showing");

const handleMousemove = () => {
  if (video.paused) {
    return;
  }

  videoControls.classList.add("showing");

  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  hideTimeoutId = setTimeout(hideVideoControls, 3000);
};

const handleMouseleave = () => {
  if (video.paused) {
    return;
  }

  hideVideoControls();
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

const handleLoadeddata = () => {
  setWeight(video.duration);
  currentTime.innerText = formatTime(0);
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration * 10) / 10;
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime * 10) / 10;
};

const playAndStop = () => {
  if (video.paused) {
    playBtnIcon.classList = "fas fa-pause";
    video.play();
  } else {
    playBtnIcon.classList = "fas fa-play";
    video.pause();
  }
};

const handleVideoClick = playAndStop;

const handleVideoPlay = () => {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  hideTimeoutId = setTimeout(hideVideoControls, 3000);
};

const handleVideoPause = () => {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  videoControls.classList.add("showing");
};

const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });

  playBtnIcon.classList = "fas fa-play";

  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  videoControls.classList.add("showing");
};

const handlePlayBtnClick = playAndStop;

const mute = () => {
  muteBtnIcon.classList = "fas fa-volume-mute";
  video.muted = true;
};

const unmute = () => {
  muteBtnIcon.classList = "fas fa-volume-up";
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
    fullscreenBtnIcon.classList = "fas fa-compress";
  } else {
    fullscreenBtnIcon.classList = "fas fa-expand";
  }
};

const handleKeydown = (event) => {
  const { key, target } = event;

  //textarea keydown 감지 무시
  if (target !== document.body) {
    return;
  }

  if (key === " ") {
    event.preventDefault();
    playAndStop();
  } else if (key === "f" || key === "F") {
    handleFullscreenBtnClick();
  } else if (key === "m" || key === "M") {
    handleMuteBtnClick();
  } else if (key === "ArrowLeft") {
    video.currentTime = video.currentTime < 5 ? 0 : video.currentTime - 5;
  } else if (key === "ArrowRight") {
    video.currentTime =
      video.duration < video.currentTime + 5
        ? video.duration
        : video.currentTime + 5;
  }
};

videoContainer.addEventListener("mousemove", handleMousemove);
videoContainer.addEventListener("mouseleave", handleMouseleave);
video.addEventListener("loadeddata", handleLoadeddata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handleVideoClick);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("pause", handleVideoPause);
video.addEventListener("ended", handleVideoEnded);
playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
volumeRange.addEventListener("change", handleVolumeChange);
volumeRange.addEventListener("input", handleVolumeInput);
timeline.addEventListener("input", handleTimelineInput);
fullscreenBtn.addEventListener("click", handleFullscreenBtnClick);
document.addEventListener("fullscreenchange", handleFullscreenchange);
document.addEventListener("keydown", handleKeydown);
