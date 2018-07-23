const apiKey =
  "sI15QDKaKqpfL76It0_N16fGOqG-vPYhHZxV3T-6jAoMs17W7dUPo3lCmA2QLTrLLJAxjXy71ajhRlPoKMgSXgRShnFgIG5qSedmOfrM7G20GHxA0mpDs79bhlJMW3Yx";
const yelp = require("yelp-fusion");
let { getBusinessDomain } = require("./scrapeBusinessDomain");
let { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const client = yelp.client(apiKey);
let { postDataToAppsScript } = require("./index");

async function getBusinessData(term, location, scriptUrl) {
  let offset = 0;
  let flag = true;
  let bussArray = [];
  let locationsArray = [];

  while (flag) {
    console.log("TERM", term, "LOCATION", location);
    await client
      .search({
        term,
        location,
        limit: 50,
        offset,
        scriptUrl
      })
      .then(async res => {
        let totalRes = res.jsonBody.total;
        console.log("TOTAL RES: ", totalRes);

        bussArray = [...bussArray, ...res.jsonBody.businesses];

        let filtered = bussArray.map(el => el.url);
        for (let i = 0; i < filtered.length; i++) {
          const element = filtered[i];
          console.log("ELEMENT: ", element);

          let bussinesDomain = await getBusinessDomain(element);

          let emailBussines = await scrapeEmailFromDomain(bussinesDomain);

          console.log("BUSSINES DOMAIN: ", bussinesDomain);

          console.log("EMAILBUSSINESS ", emailBussines);

          let locations = [bussinesDomain, emailBussines, element];
          locationsArray.push(locations);
        }

        if (totalRes > offset) {
          offset += 50;
        } else {
          flag = false;
        }

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
