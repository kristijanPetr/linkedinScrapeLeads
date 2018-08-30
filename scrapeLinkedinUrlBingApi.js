const scrapeIt = require("scrape-it");
const { postDataToAppsScript } = require("./utils");
const { axiosProxyRequest, axiosProxyRequest1 } = require("./utils");

// Promise interface
async function scrapeData(
  links = [], // whole query from
  results = [],
  scriptUrl,
  proxyIp
) {
  let linkedinFetchedResults = [];
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    console.log(link);
    let html = await axiosProxyRequest1(proxyIp, link)
      .then(async resp => {
        // console.log(resp.data);
        return resp.data;
      })
      .catch(err => null);
    if (html) {
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
        }
      });

      // console.log(data);
      if (data.articles) {
        linkedinFetchedResults.push(data.articles[0]);
      }
    }
    //   console.)
  }

  console.log("finished", linkedinFetchedResults);
  await postDataToAppsScript(
    scriptUrl,
    linkedinFetchedResults,
    "linkedinBingApiData"
  );
  return;
  await axiosProxyRequest1(proxyIp, link)
    .then(async resp => {
      let html = resp.data;
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
      //   console.log("DATA FROM LINKEDIN", Object.values(data.articles[0]));
      let objectValues = Object.values(data.articles[0]);
      console.log("OBJECT VALUES DATA LINKEDIN", [objectValues]);

      await postDataToAppsScript(
        scriptUrl,
        [objectValues],
        "linkedinBingApiData"
      );
      //let newData = [...results, ...data.articles];

      //   console.log("NEXT PAGE DATA ", data.nextPage, link);

      //   let countNextPage = data.nextPage
      //     ? data.nextPage
      //         .toString()
      //         .split("&first=")[1]
      //         .split("&FORM=")[0]
      //     : null;
      //   let oldCountNextPage = link
      //     .toString()
      //     .split("&first=")[1]
      //     .split("&FORM=")[0];
      //   console.log(
      //     "count next page",
      //     countNextPage,
      //     "old count next page",
      //     oldCountNextPage
      //   );
      //   if (
      //     data.nextPage !== "" &&
      //     parseInt(countNextPage) > parseInt(oldCountNextPage) &&
      //     count > 0
      //   ) {
      //     setTimeout(
      //       scrapeData(
      //         "http://www.bing.com" + data.nextPage,
      //         newData,
      //         location,
      //         vertical,
      //         count - 1,
      //         scriptUrl,
      //         proxyIp,
      //         userStartTime
      //       ),
      //       2000
      //     );
      //   } else {
      //     console.log("RESULTS", [objectValues]);
      //   }
      return html;
    })
    .catch(err => "");
}

function stripSpecalChar(str) {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
}

module.exports = {
  scrapeLinkedinUrl: scrapeData
};
