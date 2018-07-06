const scrapeIt = require("scrape-it");
const { postDataToAppsScript, getMapsPlacesLocation } = require("./index");
// Promise interface

function scrapeData(
  link = `https://www.bing.com/search?q=site%3alinkedin.com+intitle%3aDevelopment+AND+owner+AND+Chicago&qs=n&first=0`, // whole query from
  results = [],
  location = "Chicago",
  vertical = "Development",
  count = 2,
  scriptUrl
) {
  scrapeIt(link, {
    // Fetch the articles
    articles: {
      listItem: ".b_algo",
      data: {
        // Get the title
        name: "a",

        // Nested list
        link: "cite",
        snippet: ".b_caption > p",
        // Get the content
        title: {
          selector: ".b_vlist2col > ul:first-child li:first-child",
          how: "text"
        },
        connections: {
          selector: ".b_vlist2col > ul:first-child li:nth-child(2)",
          how: "text"
        },
        industry: {
          selector: ".b_vlist2col > ul:nth-child(2) li:first-child",
          how: "text"
        },
        location: {
          selector: ".b_vlist2col > ul:nth-child(2) li:nth-child(2)",
          how: "text"
        }
        // Get attribute value of root listItem by omitting the selector
        // classes: {
        //   attr: "class"
        // }
      }
    },

    // Fetch some other data from the page
    nextPage: {
      selector: ".sb_pagN",
      attr: "href"
    },
    count: {
      selector: ".sb_count",
      convert: x => (x.includes("Of") ? x.split("Of")[1] : x)
    }
  }).then(async ({ data, response }) => {
    // console.log(`Status Code: ${response.statusCode}`);

    let newData = [...results, ...data.articles];
    console.log(data.nextPage, link);
    let countNextPage = data.nextPage
      .toString()
      .split("&first=")[1]
      .split("&FORM=PORE")[0];
    let oldCountNextPage = link
      .toString()
      .split("&first=")[1]
      .split("&FORM=PORE")[0];
    console.log(countNextPage, oldCountNextPage);
    if (
      data.nextPage !== "" &&
      parseInt(countNextPage) > parseInt(oldCountNextPage)
      //  &&
      // count > 0
    ) {
      scrapeData(
        "https://www.bing.com" + data.nextPage,
        newData,
        location,
        vertical,
        count - 1,
        scriptUrl
      );
    } else {
      await postDataToAppsScript(scriptUrl, results, "linkedin");
      getMapsPlacesLocation(results, location, vertical, scriptUrl);
      return results;
    }
  });
}

module.exports.scraper = scrapeData;
