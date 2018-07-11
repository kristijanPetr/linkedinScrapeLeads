const Scraper = require("email-crawler");

async function emailCrawler(website) {
  let emailscraper = new Scraper(website);

  // A level is how far removed (in  terms of link clicks) a page is from the root page (only follows same domain routes)
  return await emailscraper
    .getLevels(2)
    .then(async emails => {
      return emails.length > 0 ? emails.join(",") : "";
    })
    .catch(e => {
      console.log("error");
      return "";
    });
}

module.exports.scrapeEmailFromDomain = emailCrawler; //scrapeEmailFromDomain;
