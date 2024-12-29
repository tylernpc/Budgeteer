let apiUserString = `http://localhost:3000/api/users`;

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
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function signUp() {
  let usernameInput = document.getElementById("username").value.toUpperCase();

  let response = await fetch(apiUserString);
  let jsonData = await response.json();

  let userExists = jsonData.some((user) => user.username === usernameInput);

  if (userExists) {
    throw new Error("Sorry, this username already exists!");
  }

  await createUser({
    username: usernameInput.toUpperCase(),
    password: document.getElementById("password").value,
  });

  notLoginBecauseComputerWontLetMe();
}

async function notLoginBecauseComputerWontLetMe() {
  let response = await fetch(apiUserString);
  let jsonData = await response.json();

  let usernameInput = document.getElementById("username").value.toUpperCase();
  let passwordInput = document.getElementById("password").value;

  for (let user of jsonData) {
    if (usernameInput == user.username) {
      if (passwordInput == user.password) {
        window.localStorage.setItem("user", usernameInput);
        window.location.replace("/frontend/pages/home.html");
        return;
      } else {
        console.log("Incorrect Password!");
      }
    }
  }
}
