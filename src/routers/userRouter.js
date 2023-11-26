import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  startGithubLogin,
  finishGithubLogin,
  logout,
  profile,
  getEdit,
  postEdit,
  getChangePW,
  postChangePW,
  getCreatePW,
  postCreatePW,
} from "../controllers/userControllers";
import { publicOnly, loginOnly, OAuthOnly, passwordOnly } from "../middlewares";
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
userRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
userRouter.get("/github/start", publicOnly, startGithubLogin);
userRouter.get("/github/finish", publicOnly, finishGithubLogin);
userRouter.get("/logout", loginOnly, logout);
userRouter.get("/:id([0-9a-f]{24})", loginOnly, profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loginOnly)
  .get(getEdit)
  .post(upload.single("avatar"), postEdit);
userRouter
  .route("/:id([0-9a-f]{24})/change-pw")
  .all(loginOnly, passwordOnly)
  .get(getChangePW)
  .post(postChangePW);
userRouter
  .route("/:id([0-9a-f]{24})/create-pw")
  .all(loginOnly, OAuthOnly)
  .get(getCreatePW)
  .post(postCreatePW);

export default userRouter;
