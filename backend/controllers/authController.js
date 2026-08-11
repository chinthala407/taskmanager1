const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");

// ================= Register =================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check system settings - is new registration allowed?
    const settingsResult = await db.query(
      "SELECT allow_registration FROM settings WHERE id = 1"
    );

    if (
      settingsResult.rows.length > 0 &&
      settingsResult.rows[0].allow_registration === false
    ) {
      return res.status(403).json({
        message: "New user registration is currently disabled by the administrator.",
      });
    }

    // Check if user already exists
    const user = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await db.query(
      `INSERT INTO users(name, email, password)
       VALUES($1, $2, $3)
       RETURNING id, name`,
      [name, email, hashedPassword]
    );

    // Create notification for Admin
    await db.query(
      `INSERT INTO notifications(type, title, message)
       VALUES($1, $2, $3)`,
      [
        "user",
        "New User Registered",
        `${newUser.rows[0].name} has registered successfully.`
      ]
    );

    res.status(201).json({
      message: "User Registered Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Google Auth =================

const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        message: "Missing Google access token",
      });
    }

    // Verify token with Google and get profile info
    let googleProfile;

    try {
      const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      googleProfile = googleRes.data;
    } catch (err) {
      return res.status(400).json({
        message: "Invalid Google token",
      });
    }

    const { email, name, sub: googleId, email_verified } = googleProfile;

    if (!email_verified) {
      return res.status(400).json({
        message: "Google email is not verified",
      });
    }

    // Check if user already exists
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let user;

    if (existing.rows.length === 0) {

      // Check system settings - is new registration allowed?
      const settingsResult = await db.query(
        "SELECT allow_registration FROM settings WHERE id = 1"
      );

      if (
        settingsResult.rows.length > 0 &&
        settingsResult.rows[0].allow_registration === false
      ) {
        return res.status(403).json({
          message: "New user registration is currently disabled by the administrator.",
        });
      }

      // Create a new user (no password needed for Google sign-in)
      const newUser = await db.query(
        `INSERT INTO users(name, email, google_id)
         VALUES($1, $2, $3)
         RETURNING id, name, email, role`,
        [name, email, googleId]
      );

      user = newUser.rows[0];

      // Create notification for Admin
      await db.query(
        `INSERT INTO notifications(type, title, message)
         VALUES($1, $2, $3)`,
        [
          "user",
          "New User Registered",
          `${user.name} has registered successfully via Google.`
        ]
      );

    } else {

      user = existing.rows[0];

      // Blocked user cannot login
      if (user.status && user.status.toLowerCase() === "blocked") {
        return res.status(403).json({
          message: "Your account has been blocked by the administrator.",
        });
      }

      // Link Google account to existing email/password user, if not linked yet
      if (!user.google_id) {
        await db.query(
          "UPDATE users SET google_id = $1 WHERE email = $2",
          [googleId, email]
        );
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({

      message: "Signed in with Google successfully",

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Login =================

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(400).json({
        message: "Invalid Email or Password",
      });

    }

    const user = result.rows[0];

    // Blocked user cannot login
    if (user.status && user.status.toLowerCase() === "blocked") {

      return res.status(403).json({
        message: "Your account has been blocked by the administrator."
      });

    }

    // Check system settings - is maintenance mode on?
    // Admins are exempt so they can always log in (e.g. to turn maintenance mode back off)
    const isAdmin =
      user.role && user.role.toLowerCase() === "admin";

    if (!isAdmin) {

      const settingsResult = await db.query(
        "SELECT maintenance_mode FROM settings WHERE id = 1"
      );

      if (
        settingsResult.rows.length > 0 &&
        settingsResult.rows[0].maintenance_mode === true
      ) {
        return res.status(503).json({
          message: "System is currently under maintenance. Please try again later.",
        });
      }

    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account was created with Google. Please use 'Continue with Google' to sign in.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Email or Password",
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({

      message: "Login Successful",

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Server Error",

    });

  }

};

// ================= Forgot Password =================

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      "UPDATE users SET otp=$1, otp_expiry=$2 WHERE email=$3",
      [otp, otpExpiry, email]
    );

    await sendEmail(
      email,
      "Task Manager Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Verify OTP =================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    // Clear OTP after successful verification
    await db.query(
      "UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = $1",
      [email]
    );

    res.status(200).json({
      message: "OTP Verified Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Reset Password =================

const resetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password=$1, otp=NULL, otp_expiry=NULL WHERE email=$2",
      [hashedPassword, email]
    );

    res.status(200).json({
      message: "Password Reset Successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// ================= Export =================
// This is the ONLY module.exports in this file. If your actual file on
// disk has a second module.exports block anywhere above this one, the
// later block silently wins and any name missing from it (e.g.
// `register`) becomes undefined when required elsewhere - which is
// exactly the "argument handler must be a function" error you hit.

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
};