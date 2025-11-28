// /config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import NguoiDung from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://nnkb-vpk7.onrender.com/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Google profile:", profile);

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        let user = await NguoiDung.findOne({ where: { email } });

        if (!user) {
          user = await NguoiDung.create({
            name,
            email,
            avatar_url: avatar,
            role: "user",
          });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // ✅ Convert Sequelize instance sang plain object
        done(null, { user: user.toJSON(), token });
      } catch (err) {
        console.log("❌ Google strategy error:", err);
        done(err, null);
      }
    }
  )
);

// Không cần serialize/deserialize nếu session: false
export const passportInstance = passport;
