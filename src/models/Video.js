import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, maxLength: 100 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

videoSchema.static("formatHashtags", (hashtags) =>
  hashtags.split(/\s*,\s*/).map((e) => (e.startsWith("#") ? e : `#${e}`))
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
