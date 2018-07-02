const scrapeIt = require("scrape-it");

scrapeIt("https://www.zakrose.com/contact/", {
  // Fetch the articles
 
    email: {
      selector: ".text-align-right",
      how: "text"
    }
 
}).then(resp => console.log(resp.data ))
