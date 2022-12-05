const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const verifyJwt = require("./jwt");
require("dotenv").config();
// middle wares
const app = express();
app.use(cors());
app.use(express.json());

//port
const PORT = process.env.PORT || 5000;

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tfzr2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const userCollection = client.db("CSTE").collection("user");
const userRegForm = client.db("CSTE").collection("form");
const addStudent = client.db("CSTE").collection("students");
const addTeacher = client.db("CSTE").collection("Teacher");
const chairmanMsg = client.db("CSTE").collection("ChairmanMsg");
const programmer = client.db("CSTE").collection("Programmer");
const otherExprience = client.db("CSTE").collection("otherExp");
const galaryCollection = client.db("CSTE").collection("Galay");
const materialCollection = client.db("CSTE").collection("Material");

//router

//user post register router
// app.post("/api/user/register", async (req, res) => {
//   try {
//     const user = req.body;
//     // console.log(user);
//     const payload = {
//       user: {
//         email: user.email,
//       },
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRETE, {
//       expiresIn: "1d",
//     });
//     res.status(200).send({ msg: "Login Successfully", token: token });
//     // console.log(result);
//   } catch (err) {
//     console.log(err);
//   }
// });
//user post login router
app.post("/api/user/login", async (req, res) => {
  try {
    const user = req.body;
    //console.log(user);
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

//user get all register router
app.get("/api/user", async (req, res) => {
  try {
    const result = await userCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//user post registration
app.post("/api/user/registration", async (req, res) => {
  try {
    const form = req.body;
    await userRegForm.insertOne(form);
    res.status(400).send({ msg: "registration completed" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

app.get("/api/user/registration/:id", async (req, res) => {
  const id = req.params.id;
  //console.log(id);
  try {
    const result = await userRegForm.findOne({
      "studentInfo.studentID": id,
    });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ error: "Not Registed" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//chairman msg
app.post("/api/chairman/sms", async (req, res) => {
  try {
    const msg = req.body;
    await chairmanMsg.insertOne(msg);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/chairman/sms", async (req, res) => {
  try {
    const allMsg = await chairmanMsg.find({}).toArray();
    res.status(200).send({ sms: allMsg });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//add student api
app.post("/api/student/add", async (req, res) => {
  try {
    const student = req.body;
    const exsistStudent = await addStudent.findOne({
      studentId: req.body.studentId,
    });
    if (exsistStudent) {
      res.status(200).send({ error: `${student.name} Already Added` });
    } else {
      await addStudent.insertOne(student);
      res.status(400).send({ msg: `${student.name} Added` });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//get all student
app.get("/api/student/add", async (req, res) => {
  try {
    const allStudent = await addStudent.find({}).toArray();
    res.status(200).send(allStudent);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete a student
app.delete("/api/student/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    await addStudent.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "Deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//edit a student
app.patch("/api/student/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        picture: req.body.picture,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Add your picture" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//hsc result a student
app.patch("/api/student/hsc/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        hsc: req.body,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//hsc result a student
app.patch("/api/student/ssc/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        ssc: req.body,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//add teacher api
app.post("/api/teacher/add", async (req, res) => {
  try {
    const teacher = req.body;
    const exsistTeacher = await addTeacher.findOne({
      email: req.body.email,
    });
    if (exsistTeacher) {
      res.status(400).send({ error: `${teacher.name} Already Added` });
    } else {
      await addTeacher.insertOne(teacher);
      res.status(200).send({ msg: `${teacher.name} Added` });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//get all teacher
app.get("/api/teacher/add", async (req, res) => {
  try {
    const allTeacher = await addTeacher.find({}).toArray();
    res.status(200).send(allTeacher);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete a student
app.delete("/api/teacher/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    await addTeacher.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "Deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//top programmer
app.post("/api/programmer/add", async (req, res) => {
  try {
    const coder = req.body;
    // console.log(coder);
    await programmer.insertOne(coder);
    res.status(200).send({ msg: `${coder.name} Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/programmer/add", async (req, res) => {
  try {
    const coder = await programmer
      .find({})
      .limit(10)
      .sort({ rating: -1 })
      .toArray();
    res.status(200).send({ coderList: coder });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//other exprience
app.post("/api/other/exp/add", async (req, res) => {
  try {
    const exp = req.body;
    // console.log(coder);
    await otherExprience.insertOne(exp);
    res.status(200).send({ msg: `${exp.name} Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/other/exp/add", async (req, res) => {
  try {
    const expList = await otherExprience.find({}).limit(10).toArray();
    res.status(200).send({ expList: expList });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//galary
app.post("/api/img/add", async (req, res) => {
  try {
    const img = req.body;
    // console.log(coder);
    await galaryCollection.insertOne(img);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/img/add", async (req, res) => {
  try {
    const allImg = await galaryCollection
      .find({})
      .limit(8)
      .sort({ date: -1 })
      .toArray();
    res.status(200).send({ imgList: allImg });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//add materials
app.post("/api/add/material", async (req, res) => {
  try {
    const data = req.body;
    // console.log(coder);
    await materialCollection.insertOne(data);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/material", async (req, res) => {
  try {
    const allMaterials = await materialCollection.find({}).toArray();
    res.status(200).send({ material: allMaterials });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//test api
app.get("/", (req, res) => {
  res.status(200).send("Hi server!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
