const zipcodes = require("zipcodes");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { postDataToAppsScript } = require("./index");
const { bulkEmailChecker } = require("./bulkEmailChecker");

async function getBusinessByZipCode(country, vertical, scriptUrl) {
  let dataArr = [];
  let zipCode = zipcodes.lookupByState(country);
  let zipCodes = zipCode.map(el => el.zip);

  for (let i = 0; i < zipCodes.length; i++) {
    let elementZipCode = zipCodes[i];
    let searchData = await searchPlaces(vertical + "," + elementZipCode);
    try {
      for (let j = 0; j < searchData.length; j++) {
        let placeAddress = searchData[j].formatted_address;
        let placeID = searchData[j].place_id;
        let placeDataInfo = await placeInfo(placeID);
        let placeWebsite = placeDataInfo.website || [];

        console.log("PLACE WEBSITE ", placeWebsite);

        let email = await scrapeEmailFromDomain(placeWebsite);
        //let firstEmail = email.split(",")[0];
        //let emailVerif = await bulkEmailChecker(firstEmail); BULK EMAIL CHECKER
        let data = [placeAddress, placeWebsite, email]; //emailVerif];
        dataArr.push(data);

        console.log("EMAILS", email);
      }
    } catch (error) {
      console.log(error);
    }
  }
  await postDataToAppsScript(scriptUrl, dataArr, "zipCodesBusiness");
}

module.exports.getBusinessByZipCode = getBusinessByZipCode;
