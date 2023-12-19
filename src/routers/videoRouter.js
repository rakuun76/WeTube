import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoControllers";
import { loginOnly, videoOwnerOnly } from "../middlewares";
import multer from "multer";

const videoRouter = express.Router();
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
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
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
