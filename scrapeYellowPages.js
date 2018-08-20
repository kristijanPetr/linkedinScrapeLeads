const scrapeIt = require("scrape-it");
const fs = require("fs");

async function scraPeYellowPages(name, location, vertical) {
  filteredName = name.replace(/\s/g, "+");
  filteredLocation = location.replace(/\s/g, "+");
  let query = `https://www.yellowpages.com/search?search_terms=${filteredName +
    "+" +
    vertical}&geo_location_terms=${filteredLocation}`;
  // console.log(query);

  return await scrapeIt(query, {
    articles: {
      listItem: ".result",
      data: {
        title: "a.business-name",
        website: {
          selector: ".links > a",
          attr: "href"
        },
        link: {
          selector: ".business-name",
          attr: "href",
          convert: item => `https://www.yellowpages.com${item}`
        },
        address: ".street-address"
      }
    }
  })
    .then(async res => {
      if (res) {
        let data = res.data;
        // console.log("DATA", data.articles);
        if (data.articles) {
          if (data.articles.length > 0) {
            // console.log("datalink", data.articles[0].link);
            if (data.articles[3].link) {
              let linkProfile = data.articles[3].link;
              // console.log("Company Info", data.articles[3]);
              let companyInfo = data.articles[3];
              let email = await scrapeEmailFromYellowP(linkProfile);
              // console.log(
              //   "YELLOW PAGES EMAIL",
              //   email,
              //   "COMPANY INFO",
              //   companyInfo
              // );
              return { email, companyInfo };
            }
          }
        }
      } else {
        return {};
      }
    })
    .catch(err => {});
}

async function scrapeEmailFromYellowP(link) {
  return await scrapeIt(link, {
    email: {
      selector: ".email-business",
      attr: "href"
    }
  })
    .then(resp => {
      if (resp != undefined) {
        let data = resp.data;
        let emailData = data.email.replace("mailto:", "");
        if (emailData) {
          // console.log("EMAIL :", emailData);
          return emailData;
        }
      } else {
        return [];
      }
    })
    .catch(err => []);
}

// (CEO || Owner) + (at || of )
// let snippet =
// "Taylor Pierce Apps LLC January 2009 – May 2012 (3 years 5 months) Austin, Texas Taylor Pierce Apps developed the Virtual Coach iPhone App series that had over 300,000 paid downloads in only two years.";

// console.log(snippet);

// scraPeYellowPages("Flynn Construction", "Texas", "Building");

module.exports.scraPeYellowPages = scraPeYellowPages;
