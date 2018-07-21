const scrapeIt = require("scrape-it");
const axioshttps = require("axios-https-proxy-fix");

const proxy = {
  host: "fr.proxymesh.com",
  port: 31280,
  auth: {
    username: "tealeaf",
    password: "eTjiELVQeA8HNPXBweWGdpdD"
  }
};

function getBusinessDomain(link) {
  return axioshttps
    .get(link, { proxy })
    .then(resp => {
      let html = resp.data;
      let data = scrapeIt.scrapeHTML(html, {
        articles: {
          listItem: ".biz-website",
          data: {
            name: "a"
          }
        }
      });

      let results = data.articles[0].name;
      console.log("RESULTS URL", results);
      return results;
    })
    .catch(err => console.log(err.message));
}

module.exports = { getBusinessDomain };
