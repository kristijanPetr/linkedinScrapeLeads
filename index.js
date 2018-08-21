const axios = require("axios");
const fs = require("fs");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { emailPermutator } = require("./permutate");
const { getLocationYelp, getYelpData } = require("./yelpLocation");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const Company = require("./mongooseDB/mongoDBController");
const { scraPeYellowPages } = require("./scrapeYellowPages");
const { regexSnippetYelpData } = require("./yelpDataFromSnippet");
const { getYelpInfo } = require("./scrapeBusinessDomain");
const {
  regexSnippet,
  getCityCountry,
  extractDomainFromUrl
} = require("./utils");
const { findPersonFromDb } = require("./mongooseDB/mongoDB");
// const { fbEmails, fbPlaces } = require("./firebase");
const { findCompanyGoogle } = require("./scrapeGoogle");
const countryMapper = require("./companyData/countriesMap.json");

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
  let uncheckedData = [];

  for (let i = 0; i < linkedinData.length; i++) {
    let link = linkedinData[i];
    //console.log("LINK LOCATION", link.location);

    let locationData = await getCityCountry(inputLocation);

    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filterName = (splitted[0] + " " + splitted[1]).replace(/[^\w\s]/gi, "");
    //  fbLinkedinUsers.push(link)

    let location = link.location || `Location ${inputLocation}`;

    // console.log("LINKEDIN SNIPPET ", link.snippet);
    let snippetFromReg = await regexSnippet(link.snippet);
    //console.log("LOCATION", inputLocation);
    //console.log("FIRST NAME ", splitted[0]);
    console.log("SNIPPET FROM REG", snippetFromReg);
    let companyFromDb;
    if (
      snippetFromReg &&
      snippetFromReg != null &&
      snippetFromReg != undefined
    ) {
      companyFromDb = await Company.findByCompanyName(snippetFromReg);
    }

    // let companyFromDb = await findPersonFromDb(splitted[0]);

    //console.log("COMPANY FROM DB", companyFromDb);

    if (companyFromDb) {
      console.log("COMPANY FROM DB", companyFromDb);
      let dbCompanyArr = [];
      dbCompanyArr.push([
        companyFromDb.state || "",
        companyFromDb.country || "",
        companyFromDb.website || "",
        companyFromDb.firstName || "",
        companyFromDb.lastName || "",
        companyFromDb.email || "",
        companyFromDb.companyName || "",
        companyFromDb.description || "",
        companyFromDb.address || ""
      ]);
      if (companyFromDb.email === null || companyFromDb.email === "") {
        // console.log("GET EMAIL FROM TOOFR DB");
        let emailCrawledDb = await scrapeEmailFromDomain(companyFromDb.website);
        console.log("EMAIL CRAWLED FROM DB RES", emailCrawledDb);
        if (emailCrawledDb) {
          dbCompanyArr.push(emailCrawledDb[0]);
        } else {
          if (!emailCrawledDb) {
            let emailFromToofDB = await getEmailsFromToofr(
              companyFromDb.firstName,
              companyFromDb.lastName,
              companyFromDb.website
            );
            if (emailFromToofDB) {
              //console.log("GET EMAIL FROM TOOFR DB", emailFromToofDB);
              emailFromToofDB.forEach(el => {
                dbCompanyArr.push(el.email + " , " + " | " + el.confidence);
              });
            }
          }
        }
      }
      console.log("dbCompanyarr", dbCompanyArr);
      postDataToAppsScript(scriptUrl, dbCompanyArr, "databaseRes");
    } else {
      let dataGoogle = [];
      console.log("DATA GOOGLE", snippetFromReg);

      // let snippetFromRegGoogle = await regexSnippet(link.snippet);
      if (snippetFromReg) {
        let queryGoogle = snippetFromReg + " " + inputLocation;
        console.log("Query google", queryGoogle);
        let dataFromGoogle = await findCompanyGoogle(queryGoogle);
        console.log("DATA FROM GOOGLE", dataFromGoogle);
        let domain = await extractDomainFromUrl(dataFromGoogle[1]);

        let emailCrawled = await scrapeEmailFromDomain(domain);
        console.log("EMAILS FROM GOOGLE DOMAIN", emailCrawled);
        if (dataFromGoogle) {
          fs.appendFile("googleResults.txt", dataFromGoogle.join("\n") + "\n");
          dataGoogle.push([
            splitted[0],
            splitted[1],
            location,
            vertical,
            ...dataFromGoogle,
            emailCrawled
          ]);
          Company.updateOrInsertCompany(
            splitted[0],
            splitted[1],
            dataFromGoogle[0], //address
            dataFromGoogle[1], // website
            locationData.city,
            locationData.country,
            locationData.shortCode,
            snippetFromReg,
            emailCrawled
          );
          console.log("DATA GOOGLE", dataGoogle);
          await postDataToAppsScript(scriptUrl, dataGoogle, "dataFromGoogle");
        }
      } else {
        let yelloPagesFromSnippet = await scraPeYellowPages(
          link.snippet,
          location,
          vertical
        );
        console.log("yelloPagesFromSnippet", yelloPagesFromSnippet);

        let yellowPaArr = [];
        if (yelloPagesFromSnippet !== undefined) {
          yellowPaArr = [
            [
              yelloPagesFromSnippet.email,
              yelloPagesFromSnippet.companyInfo.title,
              yelloPagesFromSnippet.companyInfo.website,
              yelloPagesFromSnippet.companyInfo.link,
              vertical,
              location,
              yelloPagesFromSnippet.companyInfo.address
              //JSON.stringify(yelloPagesFromSnippet.companyInfo)
            ]
          ];

          Company.updateOrInsertCompany(
            splitted[0],
            splitted[1],
            yelloPagesFromSnippet.companyInfo.address,
            yelloPagesFromSnippet.companyInfo.website,
            locationData.city,
            locationData.country,
            locationData.shortCode,
            yelloPagesFromSnippet.companyInfo.title,
            yelloPagesFromSnippet.email
          );

          console.log("YELLOW PAGES", yellowPaArr);
          fs.appendFile("yellowData.txt", yellowPaArr.join("\n") + "\n");
          await postDataToAppsScript(scriptUrl, yellowPaArr, "yellopagedata");
        } else {
          let yelpDataFromSnippet;
          let snippetFromRegYelp = await regexSnippet(link.snippet);
          if (snippetFromRegYelp) {
            yelpDataFromSnippet = await regexSnippetYelpData(
              snippetFromRegYelp,
              location
            );
          }
          console.log("YELP DATA FROM SNIPPET", yelpDataFromSnippet);
          let yelpMail;
          let emailsToofrYelp;
          if (yelpDataFromSnippet != undefined) {
            //console.log("YELP RESULTS FROM SNIPPET", yelpDataFromSnippet);
            let yelpArr = [];
            let results = await getYelpInfo(yelpDataFromSnippet);
            console.logconsole.log("RESULTS FROM YELP", results);
            let addressFromYelp = await getLocationYelp(filterName, location);
            //console.log("Yelp Address", addressFromYelp);
            fs.appendFile("yelpData.txt", JSON.stringify(results) + "\n");
            if (results) {
              if (results.website) {
                yelpMail = (await scrapeEmailFromDomain(results.website)) || [];
                console.log("YELP EMAIL", yelpMail);

                if (!yelpMail) {
                  if (results) {
                    let emailFromToofYelp =
                      (await getEmailsFromToofr(
                        results.firstName,
                        results.lastName,
                        results.website
                      )) || [];
                    // console.log("EMAIL FROM TOOFR YELP", emailFromToofYelp);
                    emailsToofrYelp = [];
                    emailFromToofYelp.forEach(el => {
                      emailsToofrYelp.push(
                        el.email + " , " + " | " + el.confidence
                      );
                    });
                  }
                }
              }
              if (results != undefined) {
                yelpArr = [
                  [
                    results.firstName,
                    results.lastName,
                    results.website,
                    vertical,
                    location,
                    yelpMail,
                    emailsToofrYelp
                  ]
                ];
                console.log("YELP ARR", yelpArr);
                Company.updateOrInsertCompany(
                  results.firstName,
                  results.lastName,
                  addressFromYelp,
                  results.website,
                  locationData.city,
                  locationData.country,
                  locationData.shortCode,
                  results.companyName,
                  yelpMail[0] || emailsToofrYelp[0]
                );
              }
            }
            await postDataToAppsScript(scriptUrl, yelpArr, "yelpdata");
          } else {
            uncheckedData.push(linkedinData[i]);
          }
        }
      }
    }
  }

  // return;
  for (let i = 0; i < uncheckedData.length; i++) {
    console.log("SECOND FOR .....");
    let link = uncheckedData[i];

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
