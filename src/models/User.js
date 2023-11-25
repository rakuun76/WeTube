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
});

/**
 * OAuth로 user가 생성되는 경우,
 * this.password가 undefined여서 오류가 발생
 * 이를 방지하기 위해 if문 사용
 */
userSchema.pre("save", async function () {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
