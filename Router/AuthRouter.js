const express = require("express");
const jwt = require("jsonwebtoken");
const { addStudent } = require("../index");
const authRouter = express.Router();
authRouter.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const user = req.body;
    // console.log(user);
    const loginUser = await addStudent.findOne({
      studentId: user.studentID,
    });

    // const loginUserPass = await userCollection.findOne({
    //   stduentPassword: req.body.stduentPassword,
    // });
    if (loginUser) {
      if (loginUser.password === req.body.stduentPassword) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login by ${user.studentID}`,
          token: token,
          student: loginUser,
        });
      } else {
        res.status(200).send({ error: "Invalid password" });
      }
    } else {
      res.status(200).send({ error: "Invalid ID" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

module.exports = authRouter;
