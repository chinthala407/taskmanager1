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

    const user = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      `INSERT INTO users(name, email, password)
       VALUES($1, $2, $3)
       RETURNING id, name`,
      [name, email, hashedPassword]
    );

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

    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let user;

    if (existing.rows.length === 0) {

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

      const newUser = await db.query(
        `INSERT INTO users(name, email, google_id)
         VALUES($1, $2, $3)
         RETURNING id, name, email, role`,
        [name, email, googleId]
      );

      user = newUser.rows[0];

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

      if (user.status && user.status.toLowerCase() === "blocked") {
        return res.status(403).json({
          message: "Your account has been blocked by the administrator.",
        });
      }

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

    if (user.status && user.status.toLowerCase() === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by the administrator."
      });
    }

    const isAdmin = user.role && user.role.toLowerCase() === "admin";

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

    const isMatch = await bcrypt.compare(password, user.password);

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

// ================= Forgot Password (logged-out flow) =================

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

// ================= Verify OTP (optional pre-check before showing the reset form) =================

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

    // NOTE: we deliberately do NOT clear the OTP here anymore.
    // resetPassword re-validates it, so the OTP must stay valid
    // until the password is actually changed.

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

// ================= Reset Password (logged-out flow) =================
// FIX: now requires and re-validates the OTP itself, so a stolen/guessed
// email alone is no longer enough to reset someone's password.

const resetPassword = async (req, res) => {

  try {

    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "Email, OTP and new password are required.",
      });
    }

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

    if (!user.otp || !user.otp_expiry) {
      return res.status(400).json({
        message: "Please request a new OTP.",
      });
    }

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

// ================= Send OTP for Change Password (logged-in Settings flow) =================
// Unlike forgotPassword, this trusts req.user (from the JWT) for whose
// account to act on - the email in the body is only used as a UX
// confirmation and is checked against the logged-in user's actual email.

const sendChangePasswordOtp = async (req, res) => {
  try {

    const userId = req.user.id;
    const { email } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      return res.status(400).json({
        message: "Email does not match your account.",
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
      "UPDATE users SET otp=$1, otp_expiry=$2 WHERE id=$3",
      [otp, otpExpiry, userId]
    );

    await sendEmail(
      user.email,
      "Task Manager - Change Password OTP",
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

// ================= Change Password with OTP (logged-in Settings flow) =================

const changePasswordWithOtp = async (req, res) => {
  try {

    const userId = req.user.id;
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({
        message: "OTP and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const result = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (!user.otp || !user.otp_expiry) {
      return res.status(400).json({
        message: "Please request a new OTP.",
      });
    }

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password=$1, otp=NULL, otp_expiry=NULL WHERE id=$2",
      [hashedPassword, userId]
    );

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Export =================

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
  sendChangePasswordOtp,
  changePasswordWithOtp,
};