const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");


// Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    // Check the user in database first
    let user = await User.findOne({ username: username });
    const SALT = await bcrypt.genSalt(10);

    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);
    user = new User({
      username: username,
      password: hashedPassword,
      role: role,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "registration failed" });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "invalid credentials" });
  }

  // Check the user in db
  let user = await User.findOne({ username: username });

  if (user) {
    let matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(400).json({ message: "invalid credentials" });
    }
    // JWT TOKEN GENERATION
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "60m", // We can tune this parameter as per requirement.
    });
    res.status(200).json({ message: "logged in", token: token });
  } else {
    res.status(404).json({ message: "user does not exists" });
  }
});


router.get("/profile", auth("admin"), async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).select(
    "-password"
  );
  res.status(200).json(user);
});

module.exports = router;
