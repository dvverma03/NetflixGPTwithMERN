const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CookieParser = require("cookie-parser");
const { DATABASE_NAME } = require("./src/constants.js");
require("dotenv").config();
const User = require("./src/models/user.model.js");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin: ["http://localhost:3000", "https://assignment-lavitation-frontend.vercel.app"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB connected !! DB HOST: ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.error("MONGODB connection FAILED ", err);
    process.exit(1);
  });

app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ error: "User already exist" });
    }

    const hash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ fullName, email, password: hash });
    console.log(createdUser);
    const token = jwt.sign(
      { email: createdUser.email },

      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const updatedUser = await User.findByIdAndUpdate(
      createdUser._id,
      { token: token },
      { new: true }
    );
    res
      .status(200)
      .json({
        status: "ok",
        user: updatedUser._id,
        token: token,
        fullName: updatedUser.fullName,
      });
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!isMatch) {
          return res.status(402).json({ error: "Password is incorrect" });
        }

        const token = jwt.sign(
          { email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          }
        );

        User.findByIdAndUpdate(user._id, { token }, { new: true })
          .then((updatedUser) => {
            return res.status(200).json(updatedUser);
          })
          .catch((err) => {
            console.error("Error updating token:", err);
            return res.status(500).json({ error: "Internal server error" });
          });
      });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      return res.status(500).json({ error: "Internal server error" });
    });
});

app.post("/logout", (req, res) => {
  const { token1 } = req.body;
  User.findOne({ token: token1 }).then((user) => {
    if (user) {
      const token2 = Math.random() + new Date();
      User.findByIdAndUpdate(user._id, { token: token2 }, { new: true })
        .then((updatedUser) => {
          return res.json(updatedUser);
        })
        .catch((err) => {
          console.error("Error updating token:", err);
          return res.status(500).json({ error: "Internal server error" });
        });
    } else {
      return res.json("Password is incorrect");
    }
  });
});

app.post("/userInfo", (req, res) => {
  const { userId } = req.body;
  User.findOne({ _id: userId }).then((user) => {
    console.log("user info",user);
    if (user) {
      return res.json(user);
    } else {
      return res.json("Password is incorrect");
    }
  });
});

app.listen(1234, () => {
  console.log(`server is running at port${1234}`);
});
