const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { scraper } = require("./scraper");
app.use(bodyParser.json());

app.post("/scrape", async (req, res) => {
  const { query, vertical, location, scriptUrl } = req.body;
  let link = `https://www.bing.com/search?q=${query}&qs=n&first=0`;
  let results = await scraper(link, [], location, vertical, 10, scriptUrl);
  res.send({ msg: "success", link});
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
