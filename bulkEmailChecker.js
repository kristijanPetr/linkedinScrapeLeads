const axios = require("axios");
const { postDataToAppsScript } = require("./utils");

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

async function validateRawEmails(
  scriptUrl = "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
  emails
) {
  let verifiedEmails = [];

  for (let i = 0; i < emails.length; i++) {
    let resp = await bulkEmailChecker(emails[i]);
    if (resp === "passed") {
      verifiedEmails.push([emails[i]]);
    }
    console.log(resp);
  }
  if (verifiedEmails.length > 0) {
    postDataToAppsScript(scriptUrl, verifiedEmails, "verifiedEmails");
  }
}

module.exports = {
  bulkEmailChecker,
  validateRawEmails
};
//bulkEmailChecker = bulkEmailChecker;
