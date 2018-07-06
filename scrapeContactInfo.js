const Scraper = require("email-crawler");
const fs = require("fs");

async function emailCrawler(website) {
  let emailscraper = new Scraper(website);

  console.log("CRAWLER WEBSITE", website);
  // A level is how far removed (in  terms of link clicks) a page is from the root page (only follows same domain routes)
  return await emailscraper
    .getLevels(3)
    .then(async emails => {
      console.log("CRAWLER", emails); // Here are the emails crawled from traveling two levels down this domain
      // await fs.appendFileSync(
      //   "emailCrawlData.txt",
      //   `${website} email: ${emails[0]} \n`
      // );
      return emails.length > 0 ? emails[0] : "";
    })
    .catch(e => {
      console.log("error");
      return "";
    });
}

module.exports.scrapeEmailFromDomain = emailCrawler; //scrapeEmailFromDomain;
