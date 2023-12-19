import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxLength: 50 },
  owner: { type: mongoose.ObjectId, required: true, ref: "User" },
  description: { type: String, required: true, trim: true, maxLength: 100 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
  },
});

//hashtags keyword split -> "#keyword" mapping
videoSchema.static("formatHashtags", (hashtags) =>
  hashtags.split(/\s*,\s*/).map((e) => (e.startsWith("#") ? e : `#${e}`))
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
