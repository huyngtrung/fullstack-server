const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { userName, passWord } = req.body;
  bcrypt.hash(passWord, 10).then((hash) => {
    Users.create({
      userName: userName,
      passWord: hash,
    });
    res.json("success");
  });
});

router.post("/login", async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await Users.findOne({
    where: { userName: userName }, //userName trong bảng = username post
  });

  if (!user) {
    return res.json({ error: "User Doesn't Exitst" });
  }

  //password được nhập và password trong database
  bcrypt.compare(passWord, user.passWord).then(async (match) => {
    if (!match) {
      return res.json({ error: "Wrong UserName And PassWord" });
    }

    const accessToken = sign(
      { userName: user.userName, id: user.id },
      "important"
    );
    res.json({ token: accessToken, userName: userName, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: {
      exclude: ["passWord"],
    },
  });

  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassWord, newPassWord } = req.body;
  const user = await Users.findOne({
    where: { userName: req.user.userName },
  });

  bcrypt.compare(oldPassWord, user.passWord).then(async (match) => {
    if (!match) {
      return res.json({ error: "Wrong password" });
    }

    bcrypt.hash(newPassWord, 10).then((hash) => {
      Users.update(
        { passWord: hash },
        {
          where: {
            userName: req.user.userName,
          },
        }
      );
      res.json("success");
    });
  });
});

module.exports = router;
