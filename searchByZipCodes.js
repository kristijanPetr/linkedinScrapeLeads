const zipcodes = require("zipcodes");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { postDataToAppsScript } = require("./index");
const { bulkEmailChecker } = require("./bulkEmailChecker");
const { fbZip } = require("./firebase");
const { writeEmailsToFile } = require("./utils");

async function getBusinessByZipCode(city, country, vertical, scriptUrl) {
  let dataArr = [];
  let zipCode = zipcodes.lookupByName(city, country);
  let zipCodes = zipCode.map(el => el.zip);

  //console.log("ZIP CODES", zipCodes);

  for (let i = 0; i < zipCodes.length; i++) {
    let elementZipCode = zipCodes[i];
    let searchData = await searchPlaces(vertical + "," + elementZipCode);
    try {
      for (let j = 0; j < searchData.length; j++) {
        let placeAddress = searchData[j].formatted_address;
        let placeID = searchData[j].place_id;
        let placeDataInfo = await placeInfo(placeID);
        let placeWebsite = placeDataInfo.website || [];

        //console.log("PLACE WEBSITE ", placeWebsite);

        let email = await scrapeEmailFromDomain(placeWebsite);

        writeEmailsToFile(email.split(","));

        console.log(email);

        //let firstEmail = email.split(",")[0];
        //let emailVerif = await bulkEmailChecker(firstEmail); BULK EMAIL CHECKER
        let data = [placeAddress, placeWebsite, email]; //emailVerif];
        dataArr.push(data);
        // if (placeWebsite && typeof placeWebsite === "string") {

        //   fbZip.push({ vertical, country, ...data });
        // }
        // console.log("DATA", dataArr);
        // console.log("EMAILS", email);

        // validateRawEmails(scriptUrl, rawEmails); // validating emails searched from zip-code
      }
    } catch (error) {
      console.log(error);
    }
  }
  await postDataToAppsScript(scriptUrl, dataArr, "zipCodesBusiness");
}

//getBusinessByZipCode("Austin", "Texas", "Developer");

module.exports.getBusinessByZipCode = getBusinessByZipCode;
