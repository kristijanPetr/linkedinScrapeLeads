var googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyAYs45c3mO9TtLZnKtVE4iXgSfwBQB42to",
  Promise: Promise
});

const searchPlaces = query => {
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
        return resp.json.result;
      }
      return false;
    })
    .catch(err => false);
};

// (async () => {
//   let searchData = await searchPlaces("78258,Chiropractor");
//   console.log(searchData[0].place_id);
//   let placeInfoData = await placeInfo(searchData[0].place_id);
//   console.log(placeInfoData);
// })();

module.exports = {
  searchPlaces,
  placeInfo
};
