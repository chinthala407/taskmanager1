const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
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

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
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
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};