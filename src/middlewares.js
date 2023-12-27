import Video from "./models/Video";
import onDeploy from "./ondeploy";

export const setLocals = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.onDeploy = onDeploy;
  next();
};

export const publicOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Public only");
    return res.status(403).redirect(`/users/${req.session.user._id}`);
  }
};

export const loginOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first");
    return res.status(403).redirect("/users/login");
  }
};

//OAuthOnly true 유저만 통과
export const OAuthOnly = (req, res, next) => {
  const { _id, OAuthOnly } = req.session.user;

  if (OAuthOnly) {
    return next();
  } else {
    req.flash("error", "OAuth user only");
    return res.status(403).redirect(`/users/${_id}`);
  }
};

//OAuthOnly false 유저만 통과
export const passwordOnly = (req, res, next) => {
  const { _id, OAuthOnly } = req.session.user;

  if (!OAuthOnly) {
    return next();
  } else {
    req.flash("error", "Only users with password");
    return res.status(403).redirect(`/users/${_id}`);
  }
};

export const videoOwnerOnly = async (req, res, next) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (String(video.owner) === _id) {
    next();
  } else {
    req.flash("error", "Video owner only");
    return res.status(403).redirect(`/videos/${id}`);
  }
};

export const profileOwnerOnly = (req, res, next) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;

  if (_id === id) {
    next();
  } else {
    req.flash("error", "Profile owner only");
    return res.status(403).redirect(`/users/${id}`);
  }
};
