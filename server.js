const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { scraper } = require("./scraper");

const PORT = 4000;
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || PORT);

app.use(bodyParser.json());

app.post("/scrape", async (req, res) => {
  const { query, vertical, location, scriptUrl } = req.body;
  let link = `https://www.bing.com/search?q=${query}&qs=n&first=0`;
  let results = await scraper(link, [], location, vertical, 10, scriptUrl);
  res.send({ msg: "success", link });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

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
