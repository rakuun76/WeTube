const videos = [
  {
    title: "First",
    user: "rakuun76",
    views: 76,
    createdAt: "7 minutes ago",
  },
  {
    title: "Second",
    user: "rakuun76",
    views: 67,
    createdAt: "7 hours ago",
  },
  {
    title: "Third",
    user: "frog_tongue_169mm",
    views: 169,
    createdAt: "7 days ago",
  },
];

export const home = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });

export const search = (req, res) => {
  res.send("search");
};

export const watch = (req, res) => {
  res.send("watch");
};

export const upload = (req, res) => {
  res.send("upload");
};

export const edit = (req, res) => {
  res.send("edit");
};

export const deleteVideo = (req, res) => {
  res.send("delete video");
};
