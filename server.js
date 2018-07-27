const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { scraper } = require("./scraper");
const { getBusinessByZipCode } = require("./searchByZipCodes");
const { getBusinessData } = require("./yelpBusinessLocation");
let RateLimit = require("express-rate-limit");


const PORT = 4000;
/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || PORT);
// let limiter = new RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 1, // limit each IP to 1 requests per windowMs
//   delayMs: 0 // disable delaying - full speed until the max limit is reached
// });

app.use(bodyParser.json());
//  apply to all requests
//app.use("/scrape", limiter);

let proxyIp = require("./myDataBase.json");

app.post("/scrape", async (req, res) => {
  const { query, vertical, location, scriptUrl, count } = req.body;

  if (!query || !vertical || !location || !scriptUrl) {
    return res.status(401).send({ msg: "Not enough parametars." });
  }
  let link = `http://www.bing.com/search?q=${query}&qs=n&first=0`;

  let results = await scraper(
    link,
    [],
    location,
    vertical,
    count,
    scriptUrl,
    proxyIp.ip
  );

  res.send({ msg: "success", link });
});

app.post("/bussines", async (req, res) => {
  const { location, scriptUrl, term } = req.body;

  if (!location || !scriptUrl || !term) {
    return res.status(401).send({ msg: "Not enough parametars." });
  }

  let locationResults = await getBusinessData(term, location, scriptUrl);

  res.send({ msg: "success", location, term });
});

app.post("/zipCodeSearch", async (req, res) => {
  const { country, scriptUrl, vertical } = req.body; // zipcode

  if (!country || !vertical || !scriptUrl) {
    return res.status(401).send({ msg: "Not enough parametars." });
  }

  let zipCodesBussines = await getBusinessByZipCode(
    country,
    vertical,
    scriptUrl
  );

  res.send({ msg: "success", country, vertical });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
