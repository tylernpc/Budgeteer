// JOBS CODE BELOW
const Joi = require("joi");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const jobs = [
  {
    jobID: 1,
    companyName: "Company A",
    jobTitle: "Software Engineer",
    companyEmail: "companyA@email.com",
    jobState: "NY",
    description:
      "Enjoy a fun, supportive work environment with competitive pay.",
  },
];

// create operation
app.post("/api/jobs", (req, res) => {
  const { error } = validateJobPosting(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const job = {
    jobID: jobs.length + 1,
    companyName: req.body.companyName,
    jobTitle: req.body.jobTitle,
    companyEmail: req.body.companyEmail,
    jobState: req.body.jobState,
    description: req.body.description,
  };

  jobs.push(job);
  res.send(job);
});

// read operation
app.get("/api/jobs/:job", (req, res) => {
  const job = jobs.find((j) => j.jobID === parseInt(req.params.job));
  if (!job) {
    res.status(404).send("Apologies, there was no job matching that");
  } else {
    res.send(job);
  }
});

app.get("/api/jobs", (req, res) => {
  res.send(jobs);
});

// update operation
app.put("/api/jobs/:job", (req, res) => {
  const job = jobs.find((j) => j.jobID === parseInt(req.params.job));
  if (!job) {
    res.status(404).send("Apologies, there was no job matching that.");
  } else {
    const { error } = validateJobPosting(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    job.companyName = req.body.companyName;
    job.jobTitle = req.body.jobTitle;
    job.companyEmail = req.body.companyEmail;
    job.jobState = req.body.jobState;
    job.description = req.body.description;

    console.log("Request body: ", req.body);
    res.send(job);
  }
});

// delete operation
app.delete("/api/jobs/:job", (req, res) => {
  const job = jobs.find((j) => j.jobID === parseInt(req.params.job));
  if (!job) {
    res.status(404).send("Apologies, there was no job matching that.");
  } else {
    const index = jobs.indexOf(job);
    jobs.splice(index, 1);
    res.send(jobs);
  }
});

// basic validation function
function validateJobPosting(job) {
  const schema = Joi.object({
    companyName: Joi.string().min(1).required(),

    jobTitle: Joi.string().min(1).required(),

    companyEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu", "gov"] },
      })
      .min(1)
      .required(),

    jobState: Joi.string()
      .pattern(/^[A-Za-z]{2}$/) // Only exactly two letters
      .min(2)
      .max(2)
      .required(),

    description: Joi.string().min(1).required(),
  });

  return schema.validate(job);
}

// USERS CODE BELOW

const users = [
  {
    userID: 1,
    userType: "employer",
    username: "TYLER",
    password: "password",
  },
  {
    userID: 2,
    userType: "user",
    username: "KODAD",
    password: "luna",
  },
];

// create operation
app.post("/api/users", (req, res) => {
  const { error } = validateUserCreation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

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

// basic validation function
function validateUserCreation(user) {
  const schema = Joi.object({
    userType: Joi.string().valid("employer", "user").required().messages({
      "any.only": 'userType must be either "employer" or "user".',
    }),
    username: Joi.string().min(3).max(30).required().messages({
      "string.empty": "userName is required.",
      "string.min": "userName must be at least 3 characters long.",
      "string.max": "userName must be at most 30 characters long.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "password is required.",
      "string.min": "password must be at least 8 characters long.",
    }),
  });

  return schema.validate(user);
}

// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
