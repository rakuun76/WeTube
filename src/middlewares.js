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
    return res.redirect(`/users/${req.session.user._id}`);
  }
};

export const loginOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.render("users/login", {
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
    return res.redirect(`/users/${_id}`);
  }
};

//OAuthOnly false 유저만 통과
export const passwordOnly = (req, res, next) => {
  const { _id, OAuthOnly } = req.session.user;

  if (!OAuthOnly) {
    return next();
  } else {
    return res.redirect(`/users/${_id}`);
  }
};

//ownerOnly
