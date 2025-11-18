import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { findOrCreateUser } from "../controller/userController";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: Express.User | false) => void
  ) => {
    try {
      console.log("Google profile:", profile);

      // Extract user data from Google profile
      const userData = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value || "",
        name: profile.displayName || "",
      };

      // Find existing user or create new one
      const user = await findOrCreateUser(userData);

      return done(null, user as Express.User);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return done(error as Error);
    }
  }
);

export default passport.use(googleStrategy);
