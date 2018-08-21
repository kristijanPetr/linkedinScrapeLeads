const Scraper = require("email-crawler");
const { postDataToAppsScript, writeEmailsToFile } = require("./utils");
const fs = require("fs");

async function emailCrawler(website) {
  if (!website) return "";
  website = website.indexOf("://") > 0 ? website : `https://${website}`;
  let emailscraper = new Scraper(website);
  console.log("Website", website);
  //await fs.appendFileSync("websites.txt", website + "\n");
  // A level is how far removed (in  terms of link clicks) a page is from the root page (only follows same domain routes)
  //return "";
  return emailscraper
    .getLevels(2, 5000)
    .then(async emails => {
      console.log("EMAIL CRAWLER: ", emails);
      // await postDataToAppsScript(
      //   "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
      //   emails
      //     .filter(el => {
      //       if (el.length < 50) {
      //         return true;
      //       }
      //     })
      //     .map(el => [el]),
      //   "rawEmails" //"rawEmails"
      // );
      //await writeEmailsToFile(emails);
      return emails.length > 0 ? emails.join(",") : "";
    })
    .catch(e => {
      console.log("error", e.message);
      return "";
    });
}

// emailCrawler("https://polygraphmedia.com/");

module.exports.scrapeEmailFromDomain = emailCrawler; //scrapeEmailFromDomain;
