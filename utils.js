const axioshttps = require("axios-https-proxy-fix");

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

module.exports = {
  toLowerCamel: inputStr,
  axiosProxyRequest
};
