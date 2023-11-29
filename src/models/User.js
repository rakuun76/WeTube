import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  avatarUrl: String,
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  OAuthOnly: { type: Boolean, default: false },
  password: {
    type: String,
    required: function () {
      return !this.OAuthOnly;
    },
  },
  videos: [{ type: mongoose.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  //OAuth일 경우, this.password === undefined
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
