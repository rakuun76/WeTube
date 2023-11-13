import express from "express";
import { home, search } from "../controllers/videoControllers";
import { getJoin, postJoin, getLogin } from "../controllers/userControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin);

export default globalRouter;
