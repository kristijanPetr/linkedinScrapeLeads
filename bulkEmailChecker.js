const axios = require("axios");
const { postDataToAppsScript, textDataToArray } = require("./utils");

let email = "larry@larrylaurent.com";
let apikey = "6UQY9TAW2SBJZEIHgm0rnXRxeVCk8duN";
let serviceUri = "https://bulk-api.bulkemailchecker.com/";

// let url = `${serviceUri}?key=${apikey}&email=${email}`;

async function bulkEmailChecker(email) {
  let url = `${serviceUri}?key=${apikey}&email=${email}`;
  return axios
    .post(url)
    .then(resp => {
      const { status, event } = resp.data;
      console.log("RESP", status, event, email);
      return resp.data.status;
    })
    .catch(err => console.log(err));
}

async function validateRawEmails(
  scriptUrl = "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
  emails
) {
  emails = textDataToArray();
  let verifiedEmails = [];

  for (let i = 0; i < emails.length; i++) {
    //console.log(arrEmails);
    let resp = await bulkEmailChecker(emails[i]);

    if (resp === "passed") {
      verifiedEmails.push([emails[i]]);
      console.log("Verified len:", verifiedEmails.length);
    }
    if (verifiedEmails.length % 10 === 0 && verifiedEmails.length > 0) {
      postDataToAppsScript(scriptUrl, verifiedEmails, "verifiedEmails");
      verifiedEmails = [];
    }
    //console.log(resp);
  }
  // if (verifiedEmails.length > 0) {
  //   postDataToAppsScript(scriptUrl, verifiedEmails, "verifiedEmails");
  // }
}
// validateRawEmails();

module.exports = {
  bulkEmailChecker,
  validateRawEmails
};
