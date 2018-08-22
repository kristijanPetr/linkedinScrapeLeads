const axios = require("axios");
const { writeEmailsToFile } = require("./utils");

let url = "https://www.findemails.com";
let key = "2491d6a5b8daba96163db50457f6e1bc";

const getEmails = async (first_name, last_name, company_name) => {
  //console.log(first_name,last_name,company_name);
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
      console.log("enter");
      let data = Object.values(response.data).slice(0, 3);

      // data.forEach(el => {
      //   let emailData = el.email + " , " + el.confidence;
      //   console.log(emailData);
      //   return emailData;
      // });
      console.log("data", data);
      return data;

      //writeEmailsToFile(emails);
    })
    .catch(function(error) {
      console.log(error.message);
    });
};

//getEmails("Travis", "Benton", "http://www.gspawn.com/");

module.exports.getEmailsFromToofr = getEmails;
