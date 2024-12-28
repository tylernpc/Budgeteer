let apiJobString = `http://localhost:3000/api/jobs`;
let apiUserString = `http://localhost:3000/api/users`;

// initial check to see if a user is currently logged in

document.addEventListener("DOMContentLoaded", () => {
  const value = localStorage.getItem("user");
  const loginBtn = document.getElementById("login-btn");
  const postBtn = document.getElementById("postJob");

  if (value === null || value.trim() === "") {
    console.log("No user is logged in");
  } else {
    loginBtn.style.display = "none";

    async function getUserType() {
      let response = await fetch("http://localhost:3000/api/users");
      let jsonData = await response.json();

      const value = localStorage.getItem("user");
      for (let user of jsonData) {
        if (value == user.username) {
          let currentUserType = user;
          if (currentUserType.userType != "employer") {
            postBtn.style.display = "none";
          }
        }
      }
    }
    getUserType();
  }
});

// create job function
async function createJob(jobData) {
  try {
    let response = await fetch(apiJobString, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) throw new Error("Failed to create job");

    const newJob = await response.json();
    console.log("Job created:", newJob);
  } catch (error) {
    console.error("Error creating job:", error);
  }
}

async function utilizeCreateJob() {
  await createJob({
    companyName: document.getElementById("companyName").value,
    jobTitle: document.getElementById("jobTitle").value,
    companyEmail: document.getElementById("companyEmail").value,
    jobState: document.getElementById("jobState").value,
    description: document.getElementById("description").value,
  });
  location.reload();
}

async function getJobs() {
  clearInnerHTML();
  let response = await fetch("http://localhost:3000/api/jobs");
  let jobData = await response.json();

  const userType = await checkUserType();

  for (let job of jobData) {
    if (userType === "employer") {
      document.getElementById("output-formatted").innerHTML += `
        <div class="job-item">
          <p>Company: ${job.companyName || "N/A"}</p>
          <p>Job Title: ${job.jobTitle || "N/A"}</p>
          <p>Email: ${job.companyEmail || "N/A"}</p>
          <p>State: ${job.jobState || "N/A"}</p>
          <p>Description: ${job.description || "N/A"}</p>
          <div class="ud-operations">
            <input type="button" id="deleteJobBtn" value="Delete Item" onclick="deleteJob(${job.jobID})">
            <input type="button" id="updateJobBtn" value="Update Item" onclick="utilizeUpdateJob(${job.jobID})">
          </div>
        </div>`;
    } else {
      document.getElementById("output-formatted").innerHTML += `
        <div class="job-item">
          <p>Company: ${job.companyName || "N/A"}</p>
          <p>Job Title: ${job.jobTitle || "N/A"}</p>
          <p>Email: ${job.companyEmail || "N/A"}</p>
          <p>State: ${job.jobState || "N/A"}</p>
          <p>Description: ${job.description || "N/A"}</p>
        </div>`;
    }
  }
}

async function checkUserType() {
  let response = await fetch("http://localhost:3000/api/users");
  let userData = await response.json();

  const currentUsername = localStorage.getItem("user");

  for (let user of userData) {
    if (user.username === currentUsername) {
      return user.userType;
    }
  }
  return null;
}

function clearInnerHTML() {
  document.getElementById("output-formatted").innerHTML = "";
}

// update job function
async function updateJob(jobID, updatedData) {
  try {
    let response = await fetch(`${apiJobString}/${jobID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update job");

    const updatedJob = await response.json();
    console.log("Job updated:", updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
  }
}

async function utilizeUpdateJob(jobID) {
  let newCompanyName = prompt("Please enter new company name: ");
  let newJobTitle = prompt("Please enter new job title: ");
  let newCompanyEmail = prompt("Please enter new company email: ");
  let newJobState = prompt("Please enter new job state: ");
  let newDescription = prompt("Please enter new job description: ");
  
  let updatedData = {
    companyName: newCompanyName,
    jobTitle: newJobTitle,
    companyEmail: newCompanyEmail,
    jobState: newJobState,
    description: newDescription,
  };

  await updateJob(jobID, updatedData);
  location.reload();
}

// delete job function
async function deleteJob(jobID) {
  try {
    let response = await fetch(`${apiJobString}/${jobID}`, {
      method: "DELETE",
    });
    location.reload();
    if (!response.ok) throw new Error("Failed to delete job");
  } catch (error) {
    console.error("Error deleting job:", error);
  }
}

// create user function
async function createUser(userData) {
  try {
    let response = await fetch(apiUserString, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Failed to create user");

    const newUser = await response.json();
    console.log("User created:", newUser);
    // window.location.replace("/html/jobs.html");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function utilizeCreateUser() {
  let usernameInput = document.getElementById("username").value.toUpperCase();
  let passwordInput = document.getElementById("password").value;

  await createUser({
    userType: document.getElementById("userType").value,
    username: document.getElementById("username").value.toUpperCase(),
    password: document.getElementById("password").value,
  });

  let response = await fetch(apiUserString);
  let jsonData = await response.json();

  for (let user of jsonData) {
    if (usernameInput == user.username) {
      if (passwordInput == user.password) {
        window.localStorage.setItem("user", usernameInput); // makes user active throughout session
        window.location.replace("/html/jobs.html");
        console.log("Successful login!");
        return;
      } else {
        console.log("Incorrect Password!");
      }
    }
  }

  window.location.replace("/html/jobs.html");
}

// login user function
async function login() {
  let response = await fetch(apiUserString);
  let jsonData = await response.json();

  let usernameInput = document.getElementById("username").value.toUpperCase();
  let passwordInput = document.getElementById("password").value;

  for (let user of jsonData) {
    if (usernameInput == user.username) {
      if (passwordInput == user.password) {
        window.localStorage.setItem("user", usernameInput); // makes user active throughout session
        window.location.replace("/html/jobs.html");
        console.log("Successful login!");
        return;
      } else {
        console.log("Incorrect Password!");
      }
    }
  }
}
