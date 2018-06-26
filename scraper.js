const scrapeIt = require("scrape-it");

// Promise interface

function scrapeData(
  link = `https://www.bing.com/search?q=site%3alinkedin.com+intitle%3achiropractor+AND+owner+AND+texas&qs=n`,
  results = []
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
  }).then(({ data, response }) => {
    // console.log(`Status Code: ${response.statusCode}`);

    let newData = [...results, ...data.articles];
    console.log(data.articles);
    if (data.nextPage !== "") {
      scrapeData("https://www.bing.com" + data.nextPage, newData);
    }
  });
}

scrapeData();
