import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// LocalStrategy verify callback type
const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (
    uname: string,
    password: string,
    done: (error: any, user?: Express.User | false, options?: { message: string }) => void
  ) => {
    // Check if user exists in database
    const user = await getUserByEmailIdAndPassword(uname, password);
    // console.log('passport 13: '+ user.uname);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

// Serialize user ID to session
passport.serializeUser(function (
  user: Express.User,
  done: (err: any, id?: number) => void
) {
  console.log("serialize: " + user.id);
  done(null, user.id);
});

// Deserialize user from session using ID
passport.deserializeUser(async function (
  id: number,
  done: (err: any, user?: Express.User | null) => void
) {
  const user = await getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

export default passport.use(localLogin);
