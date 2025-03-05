const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Local file paths
const userJson = "user.json";
const dataJson = "data.json";

// Load Users
const loadUsers = () => {
  if (fs.existsSync(userJson)) {
    const data = fs.readFileSync(userJson, "utf8");
    try {
      return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error parsing users.json:", error);
      return [];
    }
  }
  return [];
};

// Save Users
const saveUsers = (users) => {
  fs.writeFileSync(userJson, JSON.stringify(users, null, 2));
};

let users = loadUsers();

// Create operation for users
app.post("/api/users", (req, res) => {
  const user = {
    userID: users.length + 1,
    username: req.body.username,
    password: req.body.password,
  };

  users.push(user);
  saveUsers(users);
  res.send(user);
});

// Read operation (single user)
app.get("/api/users/:userID", (req, res) => {
  const user = users.find((u) => u.userID === parseInt(req.params.userID));
  if (!user) {
    return res.status(404).send("Apologies, there was no user matching that");
  }
  res.send(user);
});

// Read operation (all users)
app.get("/api/users", (req, res) => {
  res.send(users);
});

// Load Data
const loadData = () => {
  if (fs.existsSync(dataJson)) {
    const data = fs.readFileSync(dataJson, "utf8");
    try {
      return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error parsing data.json:", error);
      return [];
    }
  }
  return [];
};

// Save Data
const saveData = (data) => {
  fs.writeFileSync(dataJson, JSON.stringify(data, null, 2));
};

let userData = loadData();

// Create operation for data
app.post("/api/data", (req, res) => {
  const data = {
    id: generateGUID(),
    data: req.body.username,
  };

  userData.push(data);
  saveData(userData);
  res.send(data);
});

// GUID Generator
const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// const users = [
//   {
//     userID: 1,
//     username: "TYLER",
//     password: "password",
//   },
//   {
//     userID: 2,
//     username: "KODAD",
//     password: "luna",
//   },
// ];

/* create operation
app.post("/api/users", (req, res) => {
  const user = {
    userID: users.length + 1,
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
*/