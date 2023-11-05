import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;

const handleError = (error) => console.log("❌ db error");
const handleOpen = () => console.log("✅ connected to db");

db.on("error", handleError);
db.once("open", handleOpen);
