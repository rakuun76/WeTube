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
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.route("/join").get(getJoin).post(postJoin);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})", profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEdit)
  .post(upload.single("avatar"), postEdit);
userRouter
  .route("/:id([0-9a-f]{24})/change-pw")
  .get(getChangePW)
  .post(postChangePW);
userRouter
  .route("/:id([0-9a-f]{24})/create-pw")
  .get(getCreatePW)
  .post(postCreatePW);

export default userRouter;
