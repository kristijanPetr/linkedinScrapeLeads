const axioshttps = require("axios-https-proxy-fix");
const axios = require("axios");
const fs = require("fs");
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
      return resp.data;
    })
    .catch(err => console.log(err));
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
  if (snippet != undefined) {
    let matchedSnippet = snippet.match(/(?<=CEO|Owner|COO)(.*\n?)(?=,)/g);

    if (matchedSnippet !== null) {
      let newSnippet = matchedSnippet[0]
        .split(".")[0]
        .replace(/at|of|CEO|COO|Owner,/g, "");

      let filteredSnippet = newSnippet.replace(/[^a-zA-Z ]/g, "")//.replace(/\s/g, ' ');
      console.log("Filtered Snippet", filteredSnippet);

      return filteredSnippet;
    }
  }
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
  regexSnippet
};

//console.log(textDataToArray())
