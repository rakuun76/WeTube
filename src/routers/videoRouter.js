import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import onDeploy from "../ondeploy";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoControllers";
import { loginOnly, videoOwnerOnly } from "../middlewares";

const videoRouter = express.Router();
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.includes("video")) {
      cb(null, "uploads/videos/");
    } else if (file.mimetype.includes("image")) {
      cb(null, "uploads/thumbnails/");
    } else {
      cb(null, "uploads/");
    }
  },
});
const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  storage: onDeploy
    ? multerS3({
        s3: s3,
        bucket: "rakuun76-wetube",
        acl: "public-read",
        key: function (req, file, cb) {
          if (file.mimetype.includes("video")) {
            cb(null, `videos/${Date.now()}`);
          } else if (file.mimetype.includes("image")) {
            cb(null, `thumbnails/${Date.now()}`);
          }
        },
      })
    : storage,
});

videoRouter
  .route("/upload")
  .all(loginOnly)
  .get(getUpload)
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    postUpload
  );
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loginOnly, videoOwnerOnly)
  .get(getEdit)
  .post(postEdit);
videoRouter.get(
  "/:id([0-9a-f]{24})/delete",
  loginOnly,
  videoOwnerOnly,
  deleteVideo
);

export default videoRouter;
