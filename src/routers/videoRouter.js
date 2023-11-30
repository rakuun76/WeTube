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
const upload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});

videoRouter
  .route("/upload")
  .all(loginOnly)
  .get(getUpload)
  .post(upload.single("video"), postUpload);
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
