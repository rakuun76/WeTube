import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleError = (error) => console.log("❌ db error");
const handleOpen = () => console.log("✅ connected to db");

db.on("error", handleError);
db.once("open", handleOpen);
