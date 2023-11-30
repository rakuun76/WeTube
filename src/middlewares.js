import Video from "./models/Video";

export const setLocals = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};
  next();
};

export const publicOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.status(403).redirect(`/users/${req.session.user._id}`);
  }
};

export const loginOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.status(403).render("users/login", {
      pageTitle: "Login",
      errorMessage: "Login first",
    });
  }
};

//OAuthOnly true 유저만 통과
export const OAuthOnly = (req, res, next) => {
  const { _id, OAuthOnly } = req.session.user;

  if (OAuthOnly) {
    return next();
  } else {
    return res.status(403).redirect(`/users/${_id}`);
  }
};

//OAuthOnly false 유저만 통과
export const passwordOnly = (req, res, next) => {
  const { _id, OAuthOnly } = req.session.user;

  if (!OAuthOnly) {
    return next();
  } else {
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
    return res.status(403).redirect(`/users/${id}`);
  }
};
