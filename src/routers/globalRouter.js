import express from "express";
import { home } from "../controllers/videoControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);

export default globalRouter;
