import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { setLocals } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(logger);
app.use(express.urlencoded({ extended: true })); //for req.body
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(setLocals);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () =>
  console.log(`✅ server listening on http://localhost:${PORT}`)
);
