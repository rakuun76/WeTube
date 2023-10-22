import express from "express";
import { watch, edit, remove } from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);
videoRouter.get("/remove", remove);

export default videoRouter;
