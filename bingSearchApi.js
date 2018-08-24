let https = require("https");
const { postDataToAppsScript } = require("./utils");

const bingSearchApi = (query, scriptUrl) => {
  let subscriptionKey = "50d3223d866f4be989242c594398776c";

  let host = "api.cognitive.microsoft.com";
  let path = "/bing/v7.0/search";

  let term = query;

  let response_handler = function(response) {
    let body = "";
    response.on("data", function(d) {
      body += d;
    });
    response.on("end", async function() {
      console.log("\nRelevant Headers:\n");
      // header keys are lower-cased by Node.js
      for (var header in response.headers)
        if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
          //console.log(header + ": " + response.headers[header]);
          body = JSON.stringify(JSON.parse(body), null, "  ");
      console.log("\nJSON Response:\n");
      let data = JSON.parse(body).webPages.value;
      //console.log("DATA", data);
      let dataArr = [];
      data.map(el => {
        dataArr.push([el.name, el.url, el.snippet]);
      });
      console.log("data", dataArr);
      await postDataToAppsScript(scriptUrl, dataArr, "linkedinBingApi");
    });
    response.on("error", function(e) {
      console.log("Error: " + e.message);
    });
  };

  let bing_web_search = function(search) {
    console.log("Searching the Web for: " + term);

    let request_params = {
      method: "GET",
      hostname: host,
      path: path + "?q=" + encodeURIComponent(search),
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    };

    let req = https.request(request_params, response_handler);
    req.end();
  };

  if (subscriptionKey.length === 32) {
    bing_web_search(term);
  } else {
    console.log("Invalid Bing Search API subscription key!");
    console.log("Please paste yours into the source code.");
  }
};

module.exports.bingSearchApi = bingSearchApi;

// bingSearchApi(
//   `site:linkedin.com intitle:founder AND inbody:ivey business school`,
//   "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec"
// );
