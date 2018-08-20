const mongoose = require("mongoose");
const company = require("./mongoDBController");
// mongoose.Promise = global.Promise;
// mongoose.connect(
//   "mongodb://root:root@mongo-companies.server.pkristijan.xyz:27017/",

//   err => {
//     if(err){
//       console.log("ERR DB CONNECT",err)
//       return;

//     }
//   }
// );
const { postDataToAppsScript } = require("../utils");
var companiesModel = require("./mongoDBModel");

async function searchFromDB(firstName) {
  // console.log("firstName", firstName);
  return companiesModel.findOne(
    { firstName },
    "name occupation",
    async function(err, id) {
      if (err) return err;
      // console.log("id", id);
      if (id !== null) {
        // console.log("in if");
        return id;
      }
    }
  );
}

async function findPersonFromDb(firstName) {
  let id = await searchFromDB(firstName);

  return companiesModel.findById(id, function(err, person) {
    if (err) console.log(err);
    // console.log("person", person);
    return [person];
  });
}

module.exports.findPersonFromDb = findPersonFromDb;

// async function getFromDb() {
//   let personFromDb = await findPerson("Franklin");
//   console.log("PERSON FROM DB", personFromDb);
// }
// getFromDb();

//"Damon Gross - COO - Hyde Park Jewelers and"
// company.findSimilar("Damon", "Gross").then(resp => console.log(resp));

// company
//   .findByUserName("/Franklin/", "/Barbecue/", "Location: Austin, Texas")
//   .then(resp => console.log("resp from db", resp));

// company.show();

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
