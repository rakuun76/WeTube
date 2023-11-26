import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoControllers";
import { loginOnly } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload").all(loginOnly).get(getUpload).post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loginOnly)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", loginOnly, deleteVideo);

export default videoRouter;
