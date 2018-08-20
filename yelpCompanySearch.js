const { getYelpData } = require("./yelpLocation");
const { getYelpInfo } = require("./scrapeBusinessDomain");

async function searchYelpData(business) {
  let yelpData = await getYelpData(business);

  let domain = await getYelpInfo(yelpData);

  console.log(domain);
}

 

module.exports.searchYelpData = searchYelpData;
