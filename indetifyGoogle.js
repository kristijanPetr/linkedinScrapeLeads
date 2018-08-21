const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
// const { emailPermutator } = require("./permutate");
const { getLocationYelp, getYelpData } = require("./yelpLocation");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const {
  regexSnippet,
  getCityCountry,
  extractDomainFromUrl
} = require("./utils");

const {
  postDataToAppsScript,
  removeElem,
  textDataToArray
} = require("./utils");
const { getEmailsFromToofr } = require("./getEmailsFromToofr");

const getMapsPlacesLocation = async (
  googleData,
  inputLocation,
  vertical,
  scriptUrl,
  userStartTime
) => {
  let placesArr = [];
  let emailLeads = [];

  for (let i = 0; i < googleData.length; i++) {
    console.log("SECOND FOR .....");
    let link = googleData[i];

    //  fbLinkedinUsers.push(link)
    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filteredName = (splitted[0] + " " + splitted[1]).replace(
      /[^\w\s]/gi,
      ""
    );

    let location = link.location || `Location ${inputLocation}`;

    let yelpAddress = await getLocationYelp(filteredName, location);
    console.log("Yelp Address", yelpAddress);

    let placeData;
    if (!yelpAddress) {
      placeData = await searchPlaces(
        "" + filteredName + ", " + vertical + ", " + location + ""
      );
      // console.log("Search Place ", placeData)
      placeData = placeData[0];
      // await getGooglePlaceInfo(
      //   "" + filteredName + ", " + vertical + ", " + location + "",
      //   "query",
      //   getGooglePlacesApiKeys()
      // );
    }

    if (!placeData) {
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
    // console.log("place ID", placeIdInfo);
    // await getGooglePlaceInfo(
    //   placeData.placeId,
    //   "placeid",
    //   getGooglePlacesApiKeys()
    // );
    let { vicinity, name, website = "", rating = "" } = placeIdInfo;

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

    // console.log(
    //   "Firstname",
    //   splitted[0],
    //   "LastName",
    //   splitted[1],
    //   "Website",
    //   website,
    //   "Domain",
    //   domain
    // );

    let emailFromToof = await getEmailsFromToofr(
      splitted[0],
      splitted[1],
      website || domain
    );

    // console.log("EMAILS FROM TOOFR", emailFromToof);
    if (emailFromToof != []) {
      let emailsToofr = [];
      emailFromToof.forEach(el => {
        emailsToofr.push(el.email + " , " + " | " + el.confidence);
      });
    }

    //let firstEmail = crawlEmail.split(",")[0];

    console.log("EMAILS FROM TOOFR", emailsToofr);

    let emails = [
      ...[
        name,
        splitted[0],
        splitted[1],
        link.link,
        website,
        filteredName,
        emailsToofr.join(" ")
        //crawlEmail
      ]
      //...permutateEmails
    ];
    emailLeads.push(emails);
  }
  await postDataToAppsScript(scriptUrl, placesArr, "places");

  await postDataToAppsScript(scriptUrl, emailLeads, "emails");
  //startTime;
  // await getBusinessData(vertical, inputLocation, scriptUrl);
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
