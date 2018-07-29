const axios = require("axios");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { emailPermutator } = require("./permutate");
const { getLocationYelp } = require("./yelpLocation");
const { searchPlaces, placeInfo } = require("./googlePlaceUtils");
const { bulkEmailChecker } = require("./bulkEmailChecker");
const { fbEmails, fbPlaces } = require("./firebase");

const getMapsPlacesLocation = async (
  linkedinData,
  inputLocation,
  vertical,
  scriptUrl
) => {
  let placesArr = [];
  let emailLeads = [];
  for (let i = 0; i < linkedinData.length; i++) {
    let link = linkedinData[i];
    //  fbLinkedinUsers.push(link)
    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filteredName = (splitted[0] + " " + splitted[1]).replace(
      /[^\w\s]/gi,
      ""
    );
    let location = link.location || `Location ${inputLocation}`;
    let placeData = await searchPlaces(
      "" + filteredName + ", " + vertical + ", " + location + ""
    );
    placeData = placeData[0];
    // await getGooglePlaceInfo(
    //   "" + filteredName + ", " + vertical + ", " + location + "",
    //   "query",
    //   getGooglePlacesApiKeys()
    // );

    if (!placeData) {
      let yelpAddress = await getLocationYelp(filteredName, location);

      if (!yelpAddress) continue;
      placeData = await searchPlaces(
        "" + filteredName + ", " + vertical + ", " + yelpAddress + ""
      );
      placeData = placeData[0];
      // placeData = await getGooglePlaceInfo(
      //   "" + filteredName + ", " + vertical + ", " + yelpAddress + "",
      //   "query",
      //   getGooglePlacesApiKeys()
      // );
      if (!placeData) continue;
      continue;
    }

    let placeIdInfo = await placeInfo(placeData.place_id);

    // await getGooglePlaceInfo(
    //   placeData.placeId,
    //   "placeid",
    //   getGooglePlacesApiKeys()
    // );
    let { vicinity, name, website = "", rating = "" } = placeIdInfo;

    //console.log("ADDRESS PLACEINFO", placeIdInfo.vicinity);
    // fbPlaces.push({
    //   name,
    //   firstName: splitted[0],
    //   lastName: splitted[1],
    //   link: link.link,
    //   vicinity,
    //   website,
    //   rating
    // });
    placesArr.push([
      name,
      splitted[0],
      splitted[1],
      link.link,
      vicinity,
      website,
      rating
    ]);

    let domain = website.match(".*://?([^/]+)")
      ? website.match(".*://?([^/]+)")[1]
      : `${filteredName.replace(" ", "")}.com`;

    let crawlEmail = await scrapeEmailFromDomain(website || domain);

    let firstEmail = crawlEmail.split(",")[0];

    // fbEmails.push({
    //   crawlEmail
    // });

    let permutateEmails =
      (await emailPermutator(splitted[0], splitted[1], domain)) || [];
    let emails = [
      ...[
        name,
        splitted[0],
        splitted[1],
        link.link,
        website,
        filteredName,
        crawlEmail,
        await bulkEmailChecker(firstEmail) // BULK EMAIL CHECKER
      ],
      ...permutateEmails
    ];
    emailLeads.push(emails);
  }
  await postDataToAppsScript(scriptUrl, placesArr, "places");

  await postDataToAppsScript(scriptUrl, emailLeads, "emails");
};

const postDataToAppsScript = async (
  scriptUrl = "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
  data,
  name
) => {
  let objData = { [name]: data };
  return axios
    .post(scriptUrl, objData)
    .then(resp => {
      return resp.data;
    })
    .catch(err => console.log(err));
};

function stripSpecalChar(str) {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
}

module.exports = {
  postDataToAppsScript,
  getMapsPlacesLocation
};

// function getGooglePlacesApiKeys() {
//   const googlePlacesApiKeys = "AIzaSyAYs45c3mO9TtLZnKtVE4iXgSfwBQB42to";
//   if (!googlePlacesApiKeys) {
//     throw "No API keys provided." +
//       "Go to File -> Project Properties -> Script Properties, then under ther property 'googlePlacesApiKeys'," +
//       "enter a comma separated list of valid API keys ";
//   } else {
//     return googlePlacesApiKeys.trim().split(/\s*,\s*/);
//   }
// }

// function verifierEmailsFromKickBox(email) {
//   let urlVerifierKickBox = `https://api.kickbox.io/v2/verify?email=${email}&apikey=live_ad17a91b2ac8bd529142889dbf713551a167358e7b290dda147119dee789ca1e`;
//   return axios
//     .get(urlVerifierKickBox)
//     .then(response => {
//       if (response.status === 200 && response.data.result === "deliverable") {
//         return {
//           email,
//           deliver: true,
//           score: response.data.sendex
//         };
//       }
//       if (
//         (response.status === 200 && response.data.result === "risky") ||
//         response.data.result === "undeliverable"
//       ) {
//         return {
//           email,
//           deliver: false
//         };
//       }
//     })
//     .catch(err => ({
//       email,
//       deliver: false,
//       score: 0
//     }));
// }

// async function asyncEmailSecondChecker(email) {
//   let deliver = false;
//   let checkerKickBox = await verifierEmailsFromKickBox(email);
//   if (checkerKickBox.deliver) {
//     deliver = true;
//     return deliver;
//   } else {
//     return deliver;
//   }
// }

// async function checkEmailIfExist(email) {
//   return emailCheck(email)
//     .then(function(res) {
//       return res;
//     })
//     .catch(function(err) {
//       return false;
//     });
// }

// function getGooglePlaceInfo(query, param, keys) {
//   const key = keys[0];
//   if (key && query.trim() !== "") {
//     // Build request URL
//     const callType = param.toLowerCase() === "query" ? "textsearch" : "details";
//     const googlePlacesUrl =
//       "https://maps.googleapis.com/maps/api/place/" + callType + "/json";
//     const queryString =
//       "?" + param + "=" + encodeURIComponent(query) + "&key=" + key;
//     const url = googlePlacesUrl + queryString;
//     //Make API call
//     return axios.get(url).then(response => {
//       if (response.status === 200) {
//         const data = response.data;
//         if (data.status === "OK") {
//           //If success, return location info for first match
//           let place =
//             param.toLowerCase() === "query" ? data.results[0] : data.result;
//           return {
//             placeId: place.place_id || "",
//             name: place.name || "",
//             address: buildAddressFromComponents(place) || "",
//             lat: place.geometry.location.lat || "",
//             lng: place.geometry.location.lng || "",
//             rating: place.rating,
//             website: place.website
//           };
//         } else if (data.status == "OVER_QUERY_LIMIT") {
//           if (keys.length === 1) {
//             throw "All API keys currently over query limit. Add a new key or try again tomorrow.";
//           } else {
//             return getGooglePlaceInfo(query, param, keys.slice(1));
//           }
//         }
//       }
//     });
//   }
//   return null;
// }
