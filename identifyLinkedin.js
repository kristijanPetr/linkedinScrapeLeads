const axios = require("axios");
const fs = require("fs");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
// const { emailPermutator } = require("./permutate");
const { getLocationYelp } = require("./yelpLocation");
const Company = require("./mongooseDB/mongoDBController");
const { scraPeYellowPages } = require("./scrapeYellowPages");
const { regexSnippetYelpData } = require("./yelpDataFromSnippet");
const { getYelpInfo } = require("./scrapeBusinessDomain");
const {
  regexSnippet,
  getCityCountry,
  extractDomainFromUrl
} = require("./utils");
const { findCompanyGoogle } = require("./scrapeGoogle");

const {
  postDataToAppsScript,
  removeElem,
  textDataToArray
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
    let dataGoogle = [];
    // console.log("LINK LOCATION", inputLocation);

    let locationData = getCityCountry(inputLocation);
    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filterName = (splitted[0] + " " + splitted[1]).replace(/[^\w\s]/gi, "");
    //  fbLinkedinUsers.push(link)

    let location = link.location || `Location ${inputLocation}`;

    console.log("LINKEDIN SNIPPET ", link.snippet);
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
      //let dbCompanyArr = [];
      dataGoogle.push([
        companyFromDb.firstName || splitted[0],
        companyFromDb.lastName || splitted[1],
        companyFromDb.companyName || "",
        vertical,
        companyFromDb.website || "",
        location,
        locationData.country,
        companyFromDb.description || "",
        companyFromDb.address || "",
        companyFromDb.email || ""
      ]);
      if (companyFromDb.email === null || companyFromDb.email === "") {
        // console.log("GET EMAIL FROM TOOFR DB");
        let emailCrawledDb = await scrapeEmailFromDomain(companyFromDb.website);
        console.log("EMAIL CRAWLED FROM DB RES", emailCrawledDb);
        if (emailCrawledDb) {
          dataGoogle.push(emailCrawledDb[0]);
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
                dataGoogle.push(el.email + " , " + " | " + el.confidence);
              });
            }
          }
        }
      }
      console.log("dbCompanyarr", dataGoogle);
      postDataToAppsScript(scriptUrl, dataGoogle, "dataFromGoogle");
    } else {
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
          // fs.appendFile("googleResults.txt", dataFromGoogle.join("\n") + "\n");
          dataGoogle.push([
            splitted[0],
            splitted[1],
            vertical,
            dataFromGoogle[1],
            location,
            locationData.country,
            emailCrawled,
            "",
            ""
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
        }
        console.log("DATA GOOGLE", dataGoogle);
        await postDataToAppsScript(scriptUrl, dataGoogle, "dataFromGoogle");
      } else {
        let yelloPagesFromSnippet = await scraPeYellowPages(
          link.snippet,
          location,
          vertical
        );
        console.log("yelloPagesFromSnippet", yelloPagesFromSnippet);

        //let yellowPaArr = [];
        if (yelloPagesFromSnippet !== undefined) {
          dataGoogle = [
            [
              splitted[0],
              splitted[1],
              vertical,
              yelloPagesFromSnippet.companyInfo.title,
              yelloPagesFromSnippet.companyInfo.website,
              location,
              locationData.country,
              yelloPagesFromSnippet.companyInfo.link,
              yelloPagesFromSnippet.companyInfo.address,
              yelloPagesFromSnippet.email

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

          //console.log("YELLOW PAGES", yellowPaArr);
          //fs.appendFile("yellowData.txt", yellowPaArr.join("\n") + "\n");
          await postDataToAppsScript(scriptUrl, dataGoogle, "dataFromGoogle");
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
                dataFromGoogle = [
                  [
                    results.firstName,
                    results.lastName,
                    "",
                    results.website,
                    locationData.city,
                    locationData.country,
                    location,
                    yelpMail || emailsToofrYelp
                  ]
                ];
                console.log("YELP ARR", dataFromGoogle);
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
            await postDataToAppsScript(
              scriptUrl,
              dataFromGoogle,
              "dataFromGoogle"
            );
          } //else {
          //uncheckedData.push(linkedinData[i]);
          //}
        }
      }
    }
  }

  // return;
};

function stripSpecalChar(str) {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
}

module.exports = {
  //postDataToAppsScript,
  getMapsPlacesLocation
};
