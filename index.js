const axios = require("axios");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { emailPermutator } = require("./permutate");
const { getLocationYelp } = require("./yelpLocation");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const { bulkEmailChecker, validateRawEmails } = require("./bulkEmailChecker");
const { getBusinessData } = require("./yelpBusinessLocation");
// const { fbEmails, fbPlaces } = require("./firebase");
const {
  postDataToAppsScript,
  removeElem,
  textDataToArray,
  emptyTextDataFile
} = require("./utils");
const { getEmailsFromToofr } = require("./getEmailsFromToofr");

const getMapsPlacesLocation = async (
  linkedinData,
  inputLocation,
  vertical,
  scriptUrl,
  userStartTime
) => {
  let placesArr = [];
  let emailLeads = [];
  for (let i = 0; i < linkedinData.length; i++) {
    let link = linkedinData[i];
    //  fbLinkedinUsers.push(link)
    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filteredName = (splitted[0] + " " + splitted[1]).replace(
      /[^\w\s]/gi,
      ""
    );
    let location = link.location || `Location ${inputLocation}`;
    let placeData = await searchPlaces(
      "" + filteredName + ", " + vertical + ", " + location + ""
    );
    placeData = placeData[0];
    // await getGooglePlaceInfo(
    //   "" + filteredName + ", " + vertical + ", " + location + "",
    //   "query",
    //   getGooglePlacesApiKeys()
    // );

    if (!placeData) {
      let yelpAddress = await getLocationYelp(filteredName, location);

      if (!yelpAddress) continue;
      placeData = await searchPlaces(
        "" + filteredName + ", " + vertical + ", " + yelpAddress + ""
      );
      placeData = placeData[0];
      // placeData = await getGooglePlaceInfo(
      //   "" + filteredName + ", " + vertical + ", " + yelpAddress + "",
      //   "query",
      //   getGooglePlacesApiKeys()
      // );
      if (!placeData) continue;
      continue;
    }

    let placeIdInfo = await placeInfo(placeData.place_id);

    // await getGooglePlaceInfo(
    //   placeData.placeId,
    //   "placeid",
    //   getGooglePlacesApiKeys()
    // );
    let { vicinity, name, website = "", rating = "" } = placeIdInfo;

    //console.log("ADDRESS PLACEINFO", placeIdInfo.vicinity);
    // fbPlaces.push({
    //   name,
    //   firstName: splitted[0],
    //   lastName: splitted[1],
    //   link: link.link,
    //   vicinity,
    //   website,
    //   rating
    // });
    placesArr.push([
      name,
      splitted[0],
      splitted[1],
      link.link,
      vicinity,
      website,
      rating
    ]);

    let domain = website.match(".*://?([^/]+)")
      ? website.match(".*://?([^/]+)")[1]
      : `${filteredName.replace(" ", "")}.com`;

    let crawlEmail = await scrapeEmailFromDomain(website || domain);

    let emailFromToof = await getEmailsFromToofr(
      splitted[0],
      splitted[1],
      website || domain
    );

    //let firstEmail = crawlEmail.split(",")[0];

    // fbEmails.push({
    //   crawlEmail
    // });
    // let passedEmails = [];
    // let pasEmail = [];
    // let permutateEmails =
    //   (await emailPermutator(splitted[0], splitted[1], domain)) || [];

    // permutateEmails.forEach(async element => {
    //   let verifyEmails = (await bulkEmailChecker(element)) || "";

    //   //   passedEmails.push(verifyEmails);
    //   //   let passEmail = passedEmails.map(el => el === "passed");
    //   //   pasEmail.push(passEmail);

    //   //   console.log("EMAILS FROM PERMUTATIONS VERIFIED", passEmail);
    //   //   //await postDataToAppsScript(scriptUrl, passEmail, "verifiedEmails");
    // });

    let emails = [
      ...[
        name,
        splitted[0],
        splitted[1],
        link.link,
        website,
        filteredName
        //crawlEmail
      ]
      //...permutateEmails
    ];
    emailLeads.push(emails);
  }
  await postDataToAppsScript(scriptUrl, placesArr, "places");

  await postDataToAppsScript(scriptUrl, emailLeads, "emails");
  //startTime;
  await getBusinessData(vertical, inputLocation, scriptUrl);
  let queueRequests = removeElem(userStartTime);
  let isItLastReq = queueRequests.length === 0;
  console.log("Is it last request? ", isItLastReq, queueRequests);
  if (isItLastReq) {
    let rawEmails = textDataToArray();
    //console.log(rawEmails);
    console.log("PROCESS FINISHED");
    // Remove File data before Validation
    //emptyTextDataFile();
    //validateRawEmails(scriptUrl, rawEmails);

    await postDataToAppsScript(
      "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
      textDataToArray().map(item => [item]),
      "verifiedEmails"
    );
  }
};

function stripSpecalChar(str) {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
}

module.exports = {
  //postDataToAppsScript,
  getMapsPlacesLocation
};
