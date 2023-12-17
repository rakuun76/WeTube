const preview = document.getElementById("preview");
const recordingBtn = document.getElementById("recordingBtn");

let recorder;
let videoFile;

const handleDownloadRecording = async () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "video.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStopRecording = async () => {
  recordingBtn.innerText = "Download Recording";

  recordingBtn.removeEventListener("click", handleStopRecording);
  recordingBtn.addEventListener("click", handleDownloadRecording);

  recorder.stop();
};

const handleStartRecording = async () => {
  recordingBtn.innerText = "Stop Recording";

  recordingBtn.removeEventListener("click", handleStartRecording);
  recordingBtn.addEventListener("click", handleStopRecording);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  preview.srcObject = stream;
  preview.play();

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.addEventListener("dataavailable", (event) => {
    videoFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
  });
  recorder.start();
};

recordingBtn.addEventListener("click", handleStartRecording);
