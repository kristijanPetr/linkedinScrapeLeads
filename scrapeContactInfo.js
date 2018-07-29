const Scraper = require("email-crawler");
const { postDataToAppsScript } = require("./utils");

async function emailCrawler(website) {
  let emailscraper = new Scraper(website);

  // A level is how far removed (in  terms of link clicks) a page is from the root page (only follows same domain routes)
  return await emailscraper
    .getLevels(2)
    .then(async emails => {
      console.log("EMAIL CRAWLER: ", emails);
      await postDataToAppsScript(
        "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
        emails
          .filter(el => {
            if (el.length < 50) {
              return true;
            }
          })
          .map(el => [el]),
        "rawEmails" //"rawEmails"
      );
      return emails.length > 0 ? emails.join(",") : "";
    })
    .catch(e => {
      console.log("error", e.message);
      return "";
    });
}

module.exports.scrapeEmailFromDomain = emailCrawler; //scrapeEmailFromDomain;
