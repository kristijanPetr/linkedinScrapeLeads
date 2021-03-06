const axios = require("axios");
const { writeEmailsToFile } = require("./utils");
const { postDataToAppsScript } = require("./utils");

let url = "https://www.findemails.com/api/v1/guess_email.json";
let key = "2491d6a5b8daba96163db50457f6e1bc";

const getEmails = async (googleData, scriptUrl) => {
  //console.log(first_name,last_name,company_name);
  // if (!first_name || !last_name || !company_name) {
  //   return "";
  // }

  for (let index = 0; index < googleData.length; index++) {
    let dataGoogle = [];
    const el = googleData[index];
    //console.log("INDEX", index, el);

    dataGoogle.push(
      el.firstName,
      el.lastName,
      el.vertical,
      el.companyName,
      el.website,
      el.location,
      el.country,
      el.url,
      el.address
    );

    await axios
      .post(url, {
        first_name: el.firstName,
        last_name: el.lastName,
        company_name: el.website,
        key
      })
      .then(function(response) {
        //console.log("enter");
        let data = Object.values(response.data).slice(0, 3);
        //console.log(data);

        data.forEach(element => {
          dataGoogle.push(element.confidence, element.email);
        });
        console.log("DATA GOOGLE", [dataGoogle]);
        postDataToAppsScript(scriptUrl, [dataGoogle], "emailsToofr");
        return dataGoogle;

        //writeEmailsToFile(emails);
      })
      .catch(function(error) {
        console.log(error.message);
        return null;
      });
  }
};

//getEmails("Travis", "Benton", "mydomain");

module.exports.getEmailsFromToofr = getEmails;
