const apiKey =
  "X1TlK9Zg3BYjY3ZqC4xRjRPgEuGYcmsSKNqS58IU94cLQOaAG_5xFyjnMwGjjN3rVr0UjYVPxX6MZfv1jWNAcvzAK3j-zBRxS9j2Xoc0FBz4Lh5WC0A5aiCOUUtsW3Yx";
const yelp = require("yelp-fusion");
const client = yelp.client(apiKey);
const { regexSnippet } = require("./utils");

async function regexSnippetYelpData(snippet, location) {
  let filteredSnippet = regexSnippet(snippet);
  let results = await getYelpData(filteredSnippet, location);
  if (results != undefined) {
    //console.log("RESULTS", results);
    return results;
  }
}

async function getYelpData(term, location) {
  return await client
    .search({
      term: term,
      location: location
    })
    .then(async response => {
      if (response.jsonBody.businesses.length > 0) {
        let company = response.jsonBody.businesses[0].url;

       // console.log(response.jsonBody.businesses);
        return company;
      }
    })
    .catch(e => {
      console.log(e);
      return null;
    });
}

//regexSnippetYelpData("Flynn Construction","Austin");

module.exports = { regexSnippetYelpData };
