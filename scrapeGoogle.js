const scrapeIt = require("scrape-it");
const { axiosProxyRequest } = require("./utils");

const findCompany = companyNameQuery => {
  let url = `https://www.google.com/search?q=${encodeURIComponent(
    companyNameQuery
  )}`;
  console.log(url);
  return axiosProxyRequest(url)
    .then(resp => {
      let html = resp.data;
      // console.log(html)
      let data = scrapeIt.scrapeHTML(html, {
        address: ".A1t5ne",
        website: {
          selector: ".s",
          listItem: "cite"
        }
      });
      //console.log(data);
      return [data.address || "", data.website[0] || ""];
    })
    .catch(err => ["", ""]);
};

module.exports.findCompanyGoogle = findCompany;

//findCompany("ExchangeReactions  Stware Developer  GM Location: Austin, Texas");
