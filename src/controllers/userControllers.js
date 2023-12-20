import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, email, password, pwConfirm } = req.body;

  if (password !== pwConfirm) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match",
    });
  }

  const already = await User.exists({ $or: [{ name }, { email }] });
  if (already) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "This name/email is already taken.",
    });
  }

  //Mongoose Schema로 인해 생기는 error catch
  try {
    await User.create({ name, email, password });
    return res.redirect("login");
  } catch (error) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, OAuthOnly: false });

  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMessage: "An account with this email does not exist.",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.CLIENT_ID,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRes = await fetch(finalUrl, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  const tokenData = await tokenRes.json();

  if ("access_token" in tokenData) {
    const { access_token } = tokenData;
    const apiUrl = "https://api.github.com";

    const userRes = await fetch(`${apiUrl}/user`, {
      headers: { Authorization: `token ${access_token}` },
    });
    const userData = await userRes.json();

    const emailRes = await fetch(`${apiUrl}/user/emails`, {
      headers: { Authorization: `token ${access_token}` },
    });
    const emailData = await emailRes.json();

    //login에 사용할 수 있는 email 추출
    const validEmail = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!validEmail) {
      return res.redirect("/users/login");
    }

    let user = await User.findOne({ email: validEmail.email });
    if (!user) {
      user = await User.create({
        name: userData.login,
        avatarUrl: userData.avatar_url,
        email: validEmail.email,
        OAuthOnly: true,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } else {
    //access_token이 없는 경우
    return res.redirect("/users/login");
  }
};

export const logout = (req, res) => {
  req.session.user = null;
  req.session.loggedIn = false;

  return res.redirect("/");
};

export const profile = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res
      .status(404)
      .render("404", { pageTitle: "404", errorMessage: "User not found 😰" });
  }

  return res.render("users/profile", { pageTitle: "Profile", user });
};

export const getEdit = (req, res) => {
  return res.render("users/edit-user", { pageTitle: "Edit profile" });
};

export const postEdit = async (req, res) => {
  const {
    body: { name, email },
    session: {
      user: { _id, avatarUrl },
    },
    file,
  } = req;

  //변경된 name, email 존재 여부 확인
  const nameExists = await User.exists({ _id: { $ne: _id }, name });
  if (nameExists) {
    return res.status(400).render("users/edit-user", {
      pageTitle: "Edit profile",
      errorMessage: "The name already exists",
    });
  }
  const emailExists = await User.exists({ _id: { $ne: _id }, email });
  if (emailExists) {
    return res.status(400).render("users/edit-user", {
      pageTitle: "Edit profile",
      errorMessage: "The email already exists",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarUrl: file ? file.path : avatarUrl, name, email },
    { new: true }
  );
  req.session.user = updatedUser;

  return res.redirect(`/users/${_id}`);
};

export const getChangePW = (req, res) => {
  return res.render("users/change-pw", { pageTitle: "Change password" });
};

export const postChangePW = async (req, res) => {
  const {
    body: { oldPW, newPW, newPWConfirm },
    session: {
      user: { _id },
    },
  } = req;

  const user = await User.findById(_id);

  const match = await bcrypt.compare(oldPW, user.password);
  if (!match) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change password",
      errorMessage: "The current password is incorrect",
    });
  }

  if (newPW !== newPWConfirm) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change password",
      errorMessage: "Password confirmation does not match",
    });
  }

  user.password = newPW;
  await user.save();

  return res.redirect("/users/logout");
};

export const getCreatePW = (req, res) => {
  return res.render("users/create-pw", { pageTitle: "Create password" });
};

export const postCreatePW = async (req, res) => {
  const {
    body: { password, pwConfirm },
    session: {
      user: { _id },
    },
  } = req;

  if (password !== pwConfirm) {
    return res.status(400).render("users/create-pw", {
      pageTitle: "Create password",
      errorMessage: "Password confirmation does not match",
    });
  }

  const user = await User.findById(_id);
  user.OAuthOnly = false;
  user.password = password;
  await user.save();
  req.session.user = user;

  return res.redirect(`/users/${_id}`);
};
