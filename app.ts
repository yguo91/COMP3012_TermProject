import dotenv from "dotenv";
// Suppress dotenv promotional messages
const originalLog = console.log;
console.log = (...args) => {
  if (args[0]?.includes?.('[dotenv@')) return;
  originalLog(...args);
};
dotenv.config(); // Load .env file
console.log = originalLog; // Restore original console.log

import express from "express";
import session from "express-session";
import passport from "./middleware/passport";
import "./middleware/passport-google"; // Initialize Google OAuth strategy
const PORT = process.env.PORT || 8000;

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRoute from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/subs", subsRouters);
app.use("/", indexRoute);

app.listen(PORT, () =>
  console.log(`server should be running at http://localhost:${PORT}/`)
);
