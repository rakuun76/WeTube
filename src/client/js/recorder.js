import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const preview = document.getElementById("preview");
const recordingBtn = document.getElementById("recordingBtn");

let recorder;
let recordingFile;

const FILES = {
  INPUT: "recording.webm",
  OUTPUT: "output.mp4",
  THUMBNAIL: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownloadRecording = async () => {
  recordingBtn.innerText = "Transcoding...";
  recordingBtn.disabled = true;
  recordingBtn.removeEventListener("click", handleDownloadRecording);

  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  await ffmpeg.writeFile(FILES.INPUT, await fetchFile(recordingFile));

  await ffmpeg.exec(["-i", FILES.INPUT, "-r", "60", FILES.OUTPUT]);
  await ffmpeg.exec([
    "-i",
    FILES.INPUT,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    FILES.THUMBNAIL,
  ]);

  const mp4File = await ffmpeg.readFile(FILES.OUTPUT);
  const thumbnailFile = await ffmpeg.readFile(FILES.THUMBNAIL);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbnailBlob = new Blob([thumbnailFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

  downloadFile(mp4Url, FILES.OUTPUT);
  downloadFile(thumbnailUrl, FILES.THUMBNAIL);

  await ffmpeg.deleteFile(FILES.INPUT);
  await ffmpeg.deleteFile(FILES.OUTPUT);
  await ffmpeg.deleteFile(FILES.THUMBNAIL);

  URL.revokeObjectURL(recordingFile);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbnailUrl);

  recordingBtn.disabled = false;
  recordingBtn.innerText = "Record Again";
  recordingBtn.addEventListener("click", handleStartRecording);
};

const handleStartRecording = async () => {
  recordingBtn.innerText = "5s Recording";
  recordingBtn.disabled = true;
  recordingBtn.removeEventListener("click", handleStartRecording);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 1024,
      height: 576,
    },
  });
  preview.srcObject = stream;
  preview.play();

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.addEventListener("dataavailable", (event) => {
    recordingFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = recordingFile;
    preview.loop = true;
    preview.play();

    recordingBtn.innerText = "Download";
    recordingBtn.disabled = false;
    recordingBtn.addEventListener("click", handleDownloadRecording);
  });
  recorder.start();

  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

recordingBtn.addEventListener("click", handleStartRecording);
