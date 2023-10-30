const videos = [
  {
    title: "First",
    user: "rakuun76",
    views: 76,
    createdAt: "7 minutes ago",
    id: 1,
  },
  {
    title: "Second",
    user: "rakuun76",
    views: 67,
    createdAt: "7 hours ago",
    id: 2,
  },
  {
    title: "Third",
    user: "frog_tongue_169mm",
    views: 169,
    createdAt: "7 days ago",
    id: 3,
  },
];

export const home = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
