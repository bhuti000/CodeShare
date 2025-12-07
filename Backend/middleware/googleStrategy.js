import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import googleConfig from "../config/googleAuth.js";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // ✅ Create new user if doesn't exist
          user = await User.create({
            name: profile.displayName,
            email,
            password: "google-auth", // dummy password
          });
          console.log("✅ New Google user created:", user.name, user.email);
        } else {
          // ✅ UPDATE existing user's name (in case they changed it in Google)
          if (user.name !== profile.displayName) {
            user.name = profile.displayName;
            await user.save();
            console.log("✅ Updated user name from Google:", user.name);
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
