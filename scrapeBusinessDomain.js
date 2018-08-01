const scrapeIt = require("scrape-it");
const { axiosProxyRequest } = require("./utils");

function getBusinessDomain(link) {
  return axiosProxyRequest(link)
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

function getFirstLastBusinessName(link) {
  return axiosProxyRequest(link)
    .then(resp => {
      let html = resp.data;
      let data = scrapeIt.scrapeHTML(html, {
        articles: {
          listItem: ".biz-page-header-left",
          data: {
            name: "h1"
          }
        }
      });

      let results = (data.articles[0].name || "").split(" ");

      let firstName = results[0];
      let lastName = results[1];

      console.log(firstName + " " + lastName);

      return firstName + " " + lastName;
    })
    .catch(err => console.log(err.message));
}

// getFirstLastBusinessName(
//   "https://www.yelp.com/biz/daniel-p-bockmann-dc-austin-3?adjust_creative=Fu-Oesopz-4qQg2W4LNiXQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=Fu-Oesopz-4qQg2W4LNiXQ"
// );

module.exports = { getBusinessDomain, getFirstLastBusinessName };
