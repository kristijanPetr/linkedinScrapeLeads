const axios = require("axios");

let email = "larry@larrylaurent.com";
let apikey = "6UQY9TAW2SBJZEIHgm0rnXRxeVCk8duN";
let serviceUri = "https://bulk-api.bulkemailchecker.com/";

let url = `${serviceUri}?key=${apikey}&email=${email}`;

async function bulkEmailChecker(email) {
  url = `${serviceUri}?key=${apikey}&email=${email}`;
  return await axios
    .post(url)
    .then(resp => {
      console.log("RESP", resp.data.status);
      return resp.data.status;
    })
    .catch(err => console.log(err));
}

module.exports.bulkEmailChecker = bulkEmailChecker;
