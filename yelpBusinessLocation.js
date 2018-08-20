const apiKey =
  "VOFrlTItWh9XawE_uJ12b0moG-009HKnslg6ceXkkvcRXBi-613Ui6eTqMbuqXBvay4plE4ijOJK2ABa27x1ANnXoaepMEo1OVFD7nrcuYwtSFPdkiHq4EUd6FdkW3Yx";
const yelp = require("yelp-fusion");
let { getYelpInfo } = require("./scrapeBusinessDomain");
let { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const client = yelp.client(apiKey);
let { postDataToAppsScript, writeEmailsToFile } = require("./utils");
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

          let bussinesDomain = (await getYelpInfo(element)) || "";

          // let nameBussinesYelp =
          //   (await getFirstLastBusinessName(element)) || "";

          let firstName = bussinesDomain.firstName;
          let lastName = bussinesDomain.lastName
            ? bussinesDomain.lastName.replace(/[.,\s]/g, "")
            : bussinesDomain.lastName;

          // console.log("BUSSINESS NAME FROM YELP", firstName, lastName);

          let emailBussines =
            (await scrapeEmailFromDomain(bussinesDomain.website)) || "";
          if (emailBussines) {
            // console.log("EMail bussines", emailBussines.split(","));
            let crawLedEmails = await writeEmailsToFile(
              emailBussines.split(",")
            );
          }

          let toofrEmailBussines =
            (await getEmailsFromToofr(
              firstName,
              lastName,
              bussinesDomain.website
            )) || "";

          console.log("BUSSINES DOMAIN: ", bussinesDomain.website);

          console.log("EMAILBUSSINESS ", emailBussines);

          let locations = [
            vertical,
            location,
            bussinesDomain.website,
            emailBussines,
            element
          ];
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
