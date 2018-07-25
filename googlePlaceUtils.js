let googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyAYs45c3mO9TtLZnKtVE4iXgSfwBQB42to",
  Promise: Promise
});

const searchPlaces = query => {
  //console.log("SEARCHING PLACE FOR", query);
  return googleMapsClient
    .places({
      query
    })
    .asPromise()
    .then(resp => {
      if (resp.status === 200 && resp.json.results) {
        return resp.json.results;
      }
      return [];
    })
    .catch(err => []);
};

const placeInfo = placeId => {
  return googleMapsClient
    .place({
      placeid: placeId
    })
    .asPromise()
    .then(resp => {
      if (resp.status === 200 && resp.json.result) {
        //console.log("PLACE ID ", resp.json.result);
        return resp.json.result;
      }
      return false;
    })
    .catch(err => false);
};

module.exports = {
  searchPlaces,
  placeInfo
};
