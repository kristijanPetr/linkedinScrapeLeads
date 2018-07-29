const scrapeIt = require("scrape-it");
//const axios = require("axios");
const { getMapsPlacesLocation } = require("./index");
const { postDataToAppsScript } = require("./utils");
const { axiosProxyRequest } = require("./utils");
const { fbLinkedinUsers } = require("./firebase");

// Promise interface
async function scrapeData(
  link = `http://www.bing.com/search?q=site%3alinkedin.com+intitle%3aDevelopment+AND+owner+AND+Chicago&qs=n&first=0`, // whole query from
  results = [],
  location = "Chicago",
  vertical = "Development",
  count,
  scriptUrl,
  proxyIp
) {
  return await axiosProxyRequest(link)
    //.get(link, { proxy }) //axiosProxyRequest(link) //await axiosProxyRequest(link)
    .then(async resp => {
      let html = resp.data;
      //console.log("AXIOS HTML", html);
      let data = scrapeIt.scrapeHTML(html, {
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
      });
      console.log("DATA FROM LINKEDIN", data);
      //.then(async ({ data, response }) => {

      let newData = [...results, ...data.articles];

      //data.articles.map(article => fbLinkedinUsers.push({ ...article }));
      console.log("NEXT PAGE DATA ", data.nextPage, link);

      let countNextPage = data.nextPage
        ? data.nextPage
            .toString()
            .split("&first=")[1]
            .split("&FORM=PORE")[0]
        : null;
      let oldCountNextPage = link
        .toString()
        .split("&first=")[1]
        .split("&FORM=PORE")[0];
      console.log(countNextPage, oldCountNextPage);
      if (
        data.nextPage !== "" &&
        parseInt(countNextPage) > parseInt(oldCountNextPage) &&
        count > 0
      ) {
        setTimeout(
          scrapeData(
            "http://www.bing.com" + data.nextPage,
            newData,
            location,
            vertical,
            count - 1,
            scriptUrl,
            proxyIp
          ),
          2000
        );
      } else {
        await postDataToAppsScript(scriptUrl, results, "linkedin");
        getMapsPlacesLocation(results, location, vertical, scriptUrl);
        return results;
      }
      return html;
    })
    .catch(err => "");

  //  });
}
module.exports = {
  scraper: scrapeData
};
