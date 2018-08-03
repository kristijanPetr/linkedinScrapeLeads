const axios = require("axios");
const { writeEmailsToFile } = require("./utils");

let url = "https://www.toofr.com/api/v1/guess_email.json";
let key = "2491d6a5b8daba96163db50457f6e1bc";

const getEmails = async (first_name, last_name, company_name) => {
  if (!first_name || !last_name || !company_name) {
    return "";
  }
  return axios
    .post(url, {
      first_name,
      last_name,
      company_name,
      key
    })
    .then(function(response) {
      let emails = Object.keys(response.data).slice(0, 3);
      console.log(emails);

      writeEmailsToFile(emails);
      return emails;
    })
    .catch(function(error) {
      console.log(error.message);
    });
};

//getEmails("Travis","Benton","http://www.gspawn.com/")

module.exports.getEmailsFromToofr = getEmails;
