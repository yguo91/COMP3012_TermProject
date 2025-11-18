import express from "express";
import passport from "../middleware/passport";
const router = express.Router();

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  })
);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: "/posts",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

export default router;
