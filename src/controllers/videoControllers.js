import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import onDeploy from "../ondeploy";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort("-createdAt").populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumbnail },
  } = req;

  try {
    const newVideo = await Video.create({
      videoUrl: onDeploy ? video[0].location : video[0].path,
      thumbnailUrl: onDeploy
        ? thumbnail[0].location
        : thumbnail[0].path.replace(/[\\]/g, "/"),
      title,
      owner: _id,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();

    return res.redirect(`${newVideo._id}`);
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "404", errorMessage: "Video not found 😰" });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "404", errorMessage: "Video not found 😰" });
  }
  return res.render("videos/edit-video", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  const deletedVideo = await Video.findByIdAndDelete(id);

  const owner = await User.findById(deletedVideo.owner);
  owner.videos = owner.videos.filter(
    (id) => String(id) !== String(deletedVideo._id)
  );
  await owner.save();

  deletedVideo.comments.forEach(async (comment) => {
    await Comment.findByIdAndDelete(comment);
  });

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        //keyword 포함하는 제목
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
