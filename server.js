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
  // let obj = {
  //   location: "London",
  //   query: " site:www.linkedin.com/in/ Owner AND London AND Development",
  //   scriptUrl:
  //     "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
  //   vertical: "Development"
  // };
  // const { query, vertical, location, scriptUrl } = obj;
  
  
  if (!query || !vertical || !location || !scriptUrl) {
    return res.status(401).send({ msg: "Not enough parametars." });
  }
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
