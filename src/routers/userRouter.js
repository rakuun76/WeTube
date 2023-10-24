import express from "express";
import { edit, deleteUser, logout, see } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delete", deleteUser);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", see);

export default userRouter;
