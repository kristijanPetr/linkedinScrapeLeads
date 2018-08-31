const axioshttps = require("axios-https-proxy-fix");
const axios = require("axios");
const fs = require("fs");
const countryMapper = require("./companyData/countriesMap.json");

const inputStr = inputStr => {
  return inputStr
    .replace(/[\s_-]+/g, " ")
    .trim()
    .split(" ")
    .map(function(str) {
      return str.replace(/\W/g, "");
    })
    .map(function(str, i) {
      return str
        .split("")
        .map(function(l, j) {
          return i !== 0 && j == 0 ? l.toUpperCase() : l.toLowerCase();
        })
        .join("");
    })
    .join("");
};

const axiosProxyRequest = url => {
  return axioshttps.get(url, {
    proxy: {
      host: "us-wa.proxymesh.com",
      port: 31280,
      auth: {
        username: "tealeaf",
        password: "eTjiELVQeA8HNPXBweWGdpdD"
      }
    }
  });
};

const axiosProxyRequest1 = (proxyIp, url) => {
  return axios.get(url, {
    proxy: {
      host: proxyIp.split(":")[0],
      port: proxyIp.split(":")[1]
      // auth: {
      //   username: "lum-customer-hl_030a86e4-zone-static",
      //   password: "ueyv97j2vmup"
      // }
    }
  });
};

// axiosProxyRequest1(
//   "http://www.bing.com/search?q=site%3Alinkedin.com+intitle%3ACOO+AND+inbody%3Achiropractor+Texas&qs=n&form=QBLH&sp=-1&pq=site%3Alinkedin.com+intitle%3Acoo+and+inbody%3Achiropractor+texas&sc=0-59&sk=&cvid=E9A3AD83A3724162B1F38CA156D1A81A"
// ).then(res => console.log(res));

const postDataToAppsScript = async (
  scriptUrl = "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
  data,
  name
) => {
  //console.log("POST DATA TO APP SCRIPT", data);
  let objData = { [name]: data };
  return axios
    .post(scriptUrl, objData)
    .then(resp => {
      //console.log("DATA TO APP SCRIPT", resp);
      return resp.data;
    })
    .catch(err => {});
};

let queueRequests = [];

const removeElem = el => {
  let indexT = queueRequests.indexOf(el);
  console.log("removing element", queueRequests, queueRequests.indexOf(el), el);
  if (indexT > -1) {
    queueRequests.splice(indexT, 1);
  }
  return queueRequests;
};

const writeEmailsToFile = (emails = []) => {
  return fs.appendFileSync("rawEmails.txt", emails.join("\n") + "\n");
};

const textDataToArray = () => {
  return fs
    .readFileSync("rawEmails.txt")
    .toString()
    .split("\n")
    .filter(onlyUnique);
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const emptyTextDataFile = () => {
  try {
    return fs.unlinkSync("rawEmails.txt");
  } catch (err) {}
};

const regexSnippet = async snippet => {
  console.log("enter");
  if (snippet) {
    let matchedSnippet = snippet.match(/(CEO|Owner|COO|Founder)(.*\n?)(\,)/g);
    console.log("match", matchedSnippet);
    if (matchedSnippet !== null) {
      if (
        matchedSnippet[0].indexOf("CEO") > -1 ||
        matchedSnippet[0].indexOf("Owner") > -1 ||
        matchedSnippet[0].indexOf("COO") > -1 ||
        matchedSnippet[0].indexOf("Founder") > -1
      ) {
        let newSnippet = matchedSnippet[0]
          .split(".")[0]
          .replace(/and|et|at|of|CEO|COO|Owner|Founder|founder,/g, "");
        console.log("SNIPPET REGEX", newSnippet);
        let filteredSnippet = newSnippet.replace(/[^a-zA-Z ]/g, ""); //.replace(/\s/g, ' ');
        console.log("Filtered Snippet", filteredSnippet);

        return filteredSnippet;
      }
    }
  }
};

//regexSnippet("Mohamed Punjani - Founder and CEO - Bond Animal Health ...");

const getCityCountry = locationString => {
  if (locationString) {
    let arr = locationString.split(",").map(item => item.trim());
    let foundCountry = arr.filter(item => countryMapper[item]);
    //console.log(foundCountry);
    let indexCountry = arr.indexOf(foundCountry[0]);
    let city =
      (indexCountry > -1 ? (indexCountry === 1 ? arr[0] : arr[1]) : "") || "";
    console.log({
      country: foundCountry[0],
      city
    });

    return {
      country: foundCountry[0] || "",
      city,
      shortCode: countryMapper[foundCountry[0]] || ""
    };
  }
};

const extractDomainFromUrl = url => {
  let matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  let domain = matches && matches[1];
  return domain;
};

module.exports = {
  toLowerCamel: inputStr,
  axiosProxyRequest,
  postDataToAppsScript,
  queueRequests,
  writeEmailsToFile,
  textDataToArray,
  removeElem,
  emptyTextDataFile,
  regexSnippet,
  getCityCountry,
  extractDomainFromUrl,
  axiosProxyRequest1
};

//console.log(textDataToArray())
