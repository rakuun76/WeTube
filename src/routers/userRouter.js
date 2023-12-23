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
  deleteUser,
} from "../controllers/userControllers";
import {
  publicOnly,
  loginOnly,
  OAuthOnly,
  passwordOnly,
  profileOwnerOnly,
} from "../middlewares";
import multer from "multer";

const userRouter = express.Router();
const upload = multer({
  dest: "uploads/users/",
  limits: {
    fileSize: 3000000,
  },
});

userRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
userRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
userRouter.get("/github/start", publicOnly, startGithubLogin);
userRouter.get("/github/finish", publicOnly, finishGithubLogin);
userRouter.get("/logout", loginOnly, logout);
userRouter.get("/:id([0-9a-f]{24})", profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loginOnly, profileOwnerOnly)
  .get(getEdit)
  .post(upload.single("avatar"), postEdit);
userRouter
  .route("/:id([0-9a-f]{24})/change-pw")
  .all(loginOnly, profileOwnerOnly, passwordOnly)
  .get(getChangePW)
  .post(postChangePW);
userRouter
  .route("/:id([0-9a-f]{24})/create-pw")
  .all(loginOnly, profileOwnerOnly, OAuthOnly)
  .get(getCreatePW)
  .post(postCreatePW);
userRouter.get(
  "/:id([0-9a-f]{24})/delete",
  loginOnly,
  profileOwnerOnly,
  deleteUser
);

export default userRouter;
