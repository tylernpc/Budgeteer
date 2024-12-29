let apiUserString = `http://localhost:3000/api/users`;

async function createUser(){

}

async function getUser(){
    let response = await fetch(apiUserString);
    let jsonData = await response.json();

    console.log(findNames(jsonData));
}

function findNames(jsonData){
    for (let user of jsonData){
        console.log(user.password);
    }
}





// new logic
function generateUserId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};