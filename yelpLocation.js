const apiKey =
  "VOFrlTItWh9XawE_uJ12b0moG-009HKnslg6ceXkkvcRXBi-613Ui6eTqMbuqXBvay4plE4ijOJK2ABa27x1ANnXoaepMEo1OVFD7nrcuYwtSFPdkiHq4EUd6FdkW3Yx";
const yelp = require("yelp-fusion");

const client = yelp.client(apiKey);

function getPlacesYelp(name, location) {
  return client
    .search({
      term: name, // first name , last name
      location: location // location
    })
    .then(res => {
      // console.log(res);
      if (res.jsonBody.businesses.length > 0) {
        let results = res.jsonBody.businesses[0].location.display_address;
        console.log(results);
        return results;
      } else {
        return false;
      }
    })
    .catch(e => {
      console.log(e.message);
      return false;
    });
}

// getPlacesYelp("Flynn Construction Austin Texas").then(res => {
//   console.log(res);
// });

async function getYelpData(data) {
  return client
    .business(data)
    .then(response => {
      let url = response.jsonBody.url;
      console.log(url);
      //console.log(response.jsonBody);
      return url;
    })
    .catch(e => {
      console.log(e);
    });
}

 //getYelpData("Flynn Construction Austin Texas");

module.exports = { getLocationYelp: getPlacesYelp, getYelpData };
