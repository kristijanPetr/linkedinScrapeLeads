const scrapeIt = require("scrape-it");
const { axiosProxyRequest } = require("./utils");

function getYelpInfo(link) {
  return axiosProxyRequest(link)
    .then(resp => {
      let html = resp.data;
      let data = scrapeIt.scrapeHTML(html, {
        articles: {
          listItem: ".biz-page-header-left",
          data: {
            name: "h1"
          }
        },
        website: ".biz-website a"
      });

      let resultWebsite = "http://" + data.website;
      if (resultWebsite.indexOf("…") > -1) {
        if (resultWebsite.indexOf(".…") > -1) {
          let replacedResultsFourth = resultWebsite.replace(/.…$/, ".com");
          return replacedResultsFourth;
        }
        let replacedResultsThree = resultWebsite.replace(/…$/, ".com");
        return replacedResultsThree;
      }

      let results = (data.articles[0].name || "").split(" ");

      let firstName = results[0];
      let lastName = results[1];
      //console.log(resp);
      return { firstName, lastName, website: resultWebsite };
    })
    .catch(err => {});
}
// getYelpInfo("https://www.yelp.com/biz/flynn-construction-austin");
module.exports = { getYelpInfo };
