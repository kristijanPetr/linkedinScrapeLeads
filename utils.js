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

const axios = require("axios");

const axiosProxyRequest = url => {
  return axios.get(url, {
    proxy: {
      host: "fr.proxymesh.com",
      port: 31280,
      auth: {
        username: "tealeaf",
        password: "eTjiELVQeA8HNPXBweWGdpdD"
      }
    }
  });
};

module.exports = {
  toLowerCamel: inputStr,
  axiosProxyRequest
};
