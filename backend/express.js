const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {
    userID: 1,
    userType: "user",
    username: "Tyler",
    password: "password",
  },
  {
    userID: 2,
    userType: "creator",
    username: "Kodad",
    password: "luna",
  },
];

// create operation
app.post("/api/users", (req, res) => {
  const user = {
    userID: users.length + 1,
    userType: req.body.userType,
    username: req.body.username,
    password: req.body.password,
  };

  users.push(user);
  res.send(user);
});

// read operation
app.get("/api/users/:user", (req, res) => {
  const user = users.find((u) => u.userID === parseInt(req.params.user));
  if (!user) {
    res.status(404).send("Apologies, there was no user matching that");
  } else {
    res.send(user);
  }
});

app.get("/api/users", (req, res) => {
  res.send(users);
});

// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
