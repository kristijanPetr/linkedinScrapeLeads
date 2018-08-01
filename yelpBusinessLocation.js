const apiKey =
  "sI15QDKaKqpfL76It0_N16fGOqG-vPYhHZxV3T-6jAoMs17W7dUPo3lCmA2QLTrLLJAxjXy71ajhRlPoKMgSXgRShnFgIG5qSedmOfrM7G20GHxA0mpDs79bhlJMW3Yx";
const yelp = require("yelp-fusion");
let {
  getBusinessDomain,
  getFirstLastBusinessName
} = require("./scrapeBusinessDomain");
let { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const client = yelp.client(apiKey);
let { postDataToAppsScript, writeEmailsToFile } = require("./utils");
const { fbYelp } = require("./firebase");
const { bulkEmailChecker } = require("./bulkEmailChecker");
const { getEmailsFromToofr } = require("./getEmailsFromToofr");

async function getBusinessData(vertical, location, scriptUrl) {
  let offset = 0;
  let flag = true;
  let bussArray = [];
  let locationsArray = [];

  while (flag) {
    // console.log("TERM", vertical, "LOCATION", location);
    await client
      .search({
        term: vertical,
        location,
        limit: 50,
        offset,
        scriptUrl
      })
      .then(async res => {
        let totalRes = res.jsonBody.total;
        // console.log("TOTAL RES: ", totalRes);

        bussArray = [...bussArray, ...res.jsonBody.businesses];

        let filtered = bussArray.map(el => el.url);
        for (let i = 0; i < filtered.length; i++) {
          const element = filtered[i];
          // console.log("ELEMENT: ", element);

          let bussinesDomain = (await getBusinessDomain(element)) || "";

          let nameBussinesYelp =
            (await getFirstLastBusinessName(element)) || "";

          let firstName = nameBussinesYelp.split(" ")[0];
          let lastName = (nameBussinesYelp.split(" ")[1] || "").replace(
            /[.,\s]/g,
            ""
          );

          // console.log("BUSSINESS NAME FROM YELP", firstName, lastName);

          let emailBussines =
            (await scrapeEmailFromDomain(bussinesDomain)) || "";
          if (emailBussines) {
            // console.log("EMail bussines", emailBussines.split(","));
            let crawLedEmails = await writeEmailsToFile(
              emailBussines.split(",")
            );
          }

          let toofrEmailBussines =
            (await getEmailsFromToofr(firstName, lastName, bussinesDomain)) ||
            "";

          console.log("BUSSINES DOMAIN: ", bussinesDomain);

          console.log("EMAILBUSSINESS ", emailBussines);

          let locations = [
            vertical,
            location,
            bussinesDomain,
            emailBussines,
            element
            //await bulkEmailChecker(emailBussines)
          ];
          //fbYelp.push({ ...locations });
          locationsArray.push(locations);
        }

        if (totalRes > offset) {
          offset += 50;
        } else {
          flag = false;
        }
        console.log("YELP LOCATIONS", locationsArray);
        await postDataToAppsScript(scriptUrl, locationsArray, "locations");
      })
      .catch(e => {
        console.log(e);
        flag = false;
      });
  }
  console.log("Total buss", bussArray.length);
}

module.exports = { getBusinessData };
