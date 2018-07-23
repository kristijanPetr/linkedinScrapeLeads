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

      let results = "http://" + data.articles[0].name;
      if (results.indexOf("…") > -1) {
        if (results.indexOf(".…") > -1) {
          let replacedResultsFourth = results.replace(/.…$/, ".com");
          console.log("REPLACED RESULTS ", replacedResultsFourth);
          return replacedResultsFourth;
        }
        let replacedResultsThree = results.replace(/…$/, ".com");
        console.log("REPLACED RESULTS ", replacedResultsThree);
        return replacedResultsThree;
      }

      console.log("RESULTS URL", results);
      return results;
    })
    .catch(err => console.log(err.message));
}

module.exports = { getBusinessDomain };
