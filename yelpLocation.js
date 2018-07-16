const apiKey =
  "sI15QDKaKqpfL76It0_N16fGOqG-vPYhHZxV3T-6jAoMs17W7dUPo3lCmA2QLTrLLJAxjXy71ajhRlPoKMgSXgRShnFgIG5qSedmOfrM7G20GHxA0mpDs79bhlJMW3Yx";
const yelp = require("yelp-fusion");

const client = yelp.client(apiKey);

function getPlacesYelp(name, location) {
  return client
    .search({
      term: name, // first name , last name
      location: location // location
    })
    .then(res => {
      if (res.jsonBody.businesses.length > 0) {
        let results = res.jsonBody.businesses[0].location.display_address;
        console.log(results);
        return results;
      } else {
        return false;
      }
    })
    .catch(e => {
      return false;
    });
}

module.exports.getLocationYelp = getPlacesYelp;
