import User from "../models/User";

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
  await User.create({ name, email, password, confirm });
  return res.redirect("login");
};
export const getLogin = (req, res) => res.send("login");
