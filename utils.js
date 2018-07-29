const axioshttps = require("axios-https-proxy-fix");
const axios = require("axios");

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
  console.log("POST DATA TO APP SCRIPT", data);
  let objData = { [name]: data };
  return axios
    .post(scriptUrl, objData)
    .then(resp => {
      return resp.data;
    })
    .catch(err => console.log(err));
};

module.exports = {
  toLowerCamel: inputStr,
  axiosProxyRequest,
  postDataToAppsScript
};
