const axios = require("axios");
const { toLowerCamel } = require("./utils");
const { scrapeEmailFromDomain } = require("./scrapeContactInfo");
const { emailPermutator } = require("./permutate");
const emailCheck = require("email-check");
const { getLocationYelp } = require("./yelpLocation");

function getGooglePlaceInfo(query, param, keys) {
  const key = keys[0];
  if (key && query.trim() !== "") {
    // Build request URL
    const callType = param.toLowerCase() === "query" ? "textsearch" : "details";
    const googlePlacesUrl =
      "https://maps.googleapis.com/maps/api/place/" + callType + "/json";
    const queryString =
      "?" + param + "=" + encodeURIComponent(query) + "&key=" + key;
    const url = googlePlacesUrl + queryString;
    //Make API call
    return axios.get(url).then(response => {
      if (response.status === 200) {
        const data = response.data;
        if (data.status === "OK") {
          //If success, return location info for first match
          let place =
            param.toLowerCase() === "query" ? data.results[0] : data.result;
          return {
            placeId: place.place_id || "",
            name: place.name || "",
            address: buildAddressFromComponents(place) || "",
            lat: place.geometry.location.lat || "",
            lng: place.geometry.location.lng || "",
            rating: place.rating,
            website: place.website
          };
        } else if (data.status == "OVER_QUERY_LIMIT") {
          if (keys.length === 1) {
            throw "All API keys currently over query limit. Add a new key or try again tomorrow.";
          } else {
            return getGooglePlaceInfo(query, param, keys.slice(1));
          }
        }
      }
    });
  }
  return null;
}

function buildAddressFromComponents(place) {
  const components = getAddressComponents(place);
  if (components) {
    const address = [[], [], [], []];
    if (components.streetNumber) {
      address[0].push(components.streetNumber);
    }
    if (components.route) {
      address[0].push(components.route);
    }
    if (address[0].length === 0 && components.neighborhood) {
      address[0].push(components.neighborhood);
    }
    if (components.sublocality) {
      address[1].push(components.sublocality);
    }
    if (address[1].length === 0 && components.locality) {
      address[1].push(components.locality);
    }
    if (components.administrativeAreaLevel1) {
      address[2].push(components.administrativeAreaLevel1);
    }
    if (components.postalCode) {
      address[2].push(components.postalCode);
    }
    if (components.country && components.country !== "US") {
      address[3].push(components.country);
    }
    return address
      .filter(function(part) {
        return part.length !== 0;
      })
      .map(function(part) {
        return part.join(" ");
      })
      .join(", ");
  } else if (place.formatted_address) {
    return place.formatted_address.replace(", United States", "");
  } else {
    return null;
  }
}

function getAddressComponents(place) {
  const types = [
    "street_number",
    "route",
    "neighborhood",
    "sublocality",
    "locality",
    "administrative_area_level_1",
    "postal_code",
    "country"
  ];
  const components = place.address_components;
  if (components) {
    const result = types.reduce(function(compTypes, type) {
      let component = getComponent(components, type);
      if (component) {
        compTypes[toLowerCamel(type)] = component.short_name;
      }
      return compTypes;
    }, {});
    return result;
  } else {
    return null;
  }
}

function getComponent(components, type) {
  return (
    components.filter(function(component) {
      return component.types.indexOf(type) !== -1;
    })[0] || null
  );
}

function getGooglePlacesApiKeys() {
  const googlePlacesApiKeys = "AIzaSyAYs45c3mO9TtLZnKtVE4iXgSfwBQB42to";
  if (!googlePlacesApiKeys) {
    throw "No API keys provided." +
      "Go to File -> Project Properties -> Script Properties, then under ther property 'googlePlacesApiKeys'," +
      "enter a comma separated list of valid API keys ";
  } else {
    return googlePlacesApiKeys.trim().split(/\s*,\s*/);
  }
}

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
    let splitted = stripSpecalChar(link.name)
      .split(" ")
      .filter(item => item.length > 2);
    let filteredName = (splitted[0] + " " + splitted[1]).replace(
      /[^\w\s]/gi,
      ""
    );
    let location = link.location || `Location ${inputLocation}`;
    let placeData = await getGooglePlaceInfo(
      "" + filteredName + ", " + vertical + ", " + location + "",
      "query",
      getGooglePlacesApiKeys()
    );

    if (!placeData) {
      let yelpAddress = await getLocationYelp(filteredName, location);
      if (!yelpAddress) continue;
      placeData = await getGooglePlaceInfo(
        "" + filteredName + ", " + vertical + ", " + yelpAddress + "",
        "query",
        getGooglePlacesApiKeys()
      );
      if (!placeData) continue;
      continue;
    }

    let placeIdInfo = await getGooglePlaceInfo(
      placeData.placeId,
      "placeid",
      getGooglePlacesApiKeys()
    );
    let { address, name, website = "", rating = "" } = placeIdInfo;

    placesArr.push([
      name,
      splitted[0],
      splitted[1],
      link.link,
      address,
      website,
      rating
    ]);

    let domain = website.match(".*://?([^/]+)")
      ? website.match(".*://?([^/]+)")[1]
      : `${filteredName.replace(" ", "")}.com`;
    if (domain) {
      let emailResp = await getEmailsFromDomain({
        fullName: name,
        domain
      });
      if (emailResp && !emailResp.email) {
        emailResp = await getEmailsFromDomain({
          fullName: filteredName,
          domain
        });
      } else {
        emailResp = {
          email: ""
        };
      }
      let crawlEmail = await scrapeEmailFromDomain(website || domain);
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
          emailResp ? emailResp.email : "",
          await asyncEmailSecondChecker(emailResp),
          await checkEmailIfExist(emailResp),
          crawlEmail
        ],
        ...permutateEmails
      ];
      emailLeads.push(emails);
    }
  }
  await postDataToAppsScript(scriptUrl, placesArr, "places");
  await postDataToAppsScript(scriptUrl, emailLeads, "emails");
};

function verifierEmailsFromKickBox(email) {
  let urlVerifierKickBox = `https://api.kickbox.io/v2/verify?email=${email}&apikey=live_ad17a91b2ac8bd529142889dbf713551a167358e7b290dda147119dee789ca1e`;
  return axios
    .get(urlVerifierKickBox)
    .then(response => {
      if (response.status === 200 && response.data.result === "deliverable") {
        return {
          email,
          deliver: true,
          score: response.data.sendex
        };
      }
      if (
        (response.status === 200 && response.data.result === "risky") ||
        response.data.result === "undeliverable"
      ) {
        return {
          email,
          deliver: false
        };
      }
    })
    .catch(err => ({
      email,
      deliver: false,
      score: 0
    }));
}

function verifierEmailsFromHunter(email) {
  let urlVerifierHunter = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=4847b3fd2f53da802f5346ac0268428dfcd19355`;
  return axios
    .get(urlVerifierHunter)
    .then(response => {
      if (response.status === 200) {
        if (response.data.data.score > 80) {
          return {
            email,
            deliver: true,
            score: response.data.data.score
          };
        } else {
          return {
            email,
            deliver: false,
            score: response.data.data.score
          };
        }
      }
      return {
        email,
        deliver: false,
        score: 0
      };
    })
    .catch(err => ({
      email,
      deliver: false,
      score: 0
    }));
}

function getEmailsFromDomain(personData, count = 0) {
  let { fullName = " ", domain } = personData;

  let queryParam = `domain=${domain}&full_name=${stripSpecalChar(fullName)
    .split(" ")
    .join("+")}`;
  let url = `https://api.hunter.io/v2/email-finder?api_key=4847b3fd2f53da802f5346ac0268428dfcd19355&${queryParam}`;

  return axios
    .get(url)
    .then(response => {
      let { data } = response.data;
      if (!data.email) {
        let newName = stripSpecalChar(fullName)
          .split(" ")
          .filter(item => item.length > 3);
        if (newName.length > 2) {
          newName.pop();
          return getEmailsFromDomain(
            {
              domain,
              fullName: newName.join(" ")
            },
            count
          );
        }
      }
      return data;
    })
    .catch(err => {
      console.log("LINE 328", domain);
      console.log(err.message);
      count = count + 1;
      let newName = stripSpecalChar(fullName)
        .split(" ")
        .filter(item => item.length > 2);
      if (newName.length > 2) {
        newName.pop();
        return getEmailsFromDomain({
          domain,
          fullName: newName.join(" ")
        });
      }
    });
}

async function asyncEmailSecondChecker(email) {
  let deliver = false;
  let checkerHunter = await verifierEmailsFromHunter(email);
  if (!checkerHunter.deliver) {
    let checkerKickBox = await verifierEmailsFromKickBox(email);
    if (checkerKickBox.deliver) {
      deliver = true;
      return deliver;
    } else {
      return deliver;
    }
  } else {
    deliver = true;
    return deliver;
  }
}

async function checkEmailIfExist(email) {
  return emailCheck(email)
    .then(function(res) {
      return res;
    })
    .catch(function(err) {
      return false;
    });
}

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
    .catch(err => console.log(resp));
};

function stripSpecalChar(str) {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
}

module.exports = {
  postDataToAppsScript,
  getMapsPlacesLocation
};
