import express from "express";

const PORT = 4000;
const app = express();

const handleHome = (req, res) => {
  return res.send("Hello Fxcking world!!");
};
app.get("/", handleHome);

app.listen(PORT);
