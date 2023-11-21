import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (password !== confirm) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match",
    });
  }
  const already = await User.exists({ $or: [{ name }, { email }] });
  if (already) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This name/email is already taken.",
    });
  }
  try {
    await User.create({ name, email, password, confirm });
    return res.redirect("login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this email does not exist.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
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
    const validEmail = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!validEmail) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: validEmail.email });
    if (!user) {
      user = await User.create({
        name: userData.login,
        avatarUrl: userData.avatar_url,
        email: validEmail.email,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
