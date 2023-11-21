import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);

export default userRouter;
