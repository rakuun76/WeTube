import Video from "../models/Video";
import Comment from "../models/Comment";

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  await video.save();

  return res.status(201).json({ commentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id);

  if (String(comment.owner) !== String(user._id)) {
    return res.sendStatus(403);
  }

  const video = await Video.findById(comment.video);
  if (!video) {
    return res.sendStatus(404);
  }
  video.comments = video.comments.filter(
    (id) => String(id) !== String(comment._id)
  );
  await video.save();

  await Comment.findByIdAndDelete(id);

  return res.sendStatus(200);
};
