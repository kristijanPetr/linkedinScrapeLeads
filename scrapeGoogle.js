const scrapeIt = require("scrape-it");

const findCompany = companyName => {
  return scrapeIt(`https://www.google.com/search?q=${companyName}`, {
    data: {
      selector: ".s",
      listItem: "cite"
    }
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`);
    // console.log(data.data[0]);
    let slicedData = data.data.slice(0, 5);
    console.log(slicedData);
    return slicedData;
  });
};

module.exports.findCompanyGoogle = findCompany;

// findCompany("grandex-inc");
