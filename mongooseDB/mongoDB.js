const mongoose = require("mongoose");
const company = require("./mongoDBController");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://root:root@mongo-companies.server.pkristijan.xyz:27017/",

  err => {
    if (err) {
      console.log("ERR DB CONNECT", err);
      return;
    }
  }
);
const { postDataToAppsScript } = require("../utils");
var companiesModel = require("./mongoDBModel");

async function searchFromDB(firstName) {
  // console.log("firstName", firstName);
  return companiesModel.findOne({ firstName }, async function(err, res) {
    if (err) return err;
    // console.log("id", id);
    if (res !== null) {
      console.log("in if", res);
      return res;
    }
  });
}

async function findPersonFromDb(firstName) {
  let id = await searchFromDB(firstName);

  return companiesModel.findById(id, function(err, person) {
    if (err) console.log(err);
    // console.log("person", person);
    return [person];
  });
}

//"Damon Gross - COO - Hyde Park Jewelers and"
// company.findSimilar("Damon", "Gross").then(resp => console.log(resp));

// company
//   .findByUserName("/Franklin/", "/Barbecue/", "Location: Austin, Texas")
//   .then(resp => console.log("resp from db", resp));

  // company.getRandomUser()

company.findByCompanyName("spotlight business affairs inc").then(res => console.log(res));

async function filterDataFromDbAndPostToScript(
  firstname,
  lastname,
  companyInfoName,
  scriptUrl
) {
  let dbCompanyArr = [];
  company
    .findByUserAndCompany(firstname, lastname, companyInfoName)
    .then(resp => {
      resp.map(el => {
        dbCompanyArr.push([
          el.companyName,
          el.description,
          el.address,
          el.city,
          el.country,
          el.website,
          el.firstName,
          el.lastName,
          el.email
        ]);
      });
      console.log(dbCompanyArr);
      postDataToAppsScript(scriptUrl, dbCompanyArr, "databaseRes");
    })
    .catch(err => []);
}
// searchFromDB("Franklin");
module.exports.findPersonFromDb = findPersonFromDb;
