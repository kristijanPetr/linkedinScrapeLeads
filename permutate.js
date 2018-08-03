const _ = require("lodash");
const { bulkEmailChecker } = require("./bulkEmailChecker");
const { postDataToAppsScript, writeEmailsToFile } = require("./utils");
const axios = require("axios");
// const postDataToAppsScript1 = async (
//   scriptUrl = "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
//   data,
//   name
// ) => {
//   console.log("POST DATA TO APP SCRIPT", data);
//   let objData = { [name]: data };
//   return axios
//     .post(scriptUrl, objData)
//     .then(resp => {
//       return resp.data;
//     })
//     .catch(err => console.log(err));
// };

let firstName;
let firstInitial;
let lastName;
let lastInitial;
let middleName;
let middleInitial;
let nickName;
let nickInitial;
let domain1;

let emailOutput = new Array();

function checkNN(formula) {
  if (nickName && nickName != "" && nickName != firstName) {
    emailOutput.push(formula);
  }
}

// Checks nickInitial for existance and uniqueness against firstInitial
// when deciding whether or not to make email permutations with it.
function checkNI(formula) {
  if (nickInitial && nickInitial != "" && nickInitial != firstInitial) {
    emailOutput.push(formula);
  }
}

// Checks that Middle Initial exists
function checkMidIn(formula) {
  if (middleInitial && middleInitial != "") {
    emailOutput.push(formula);
  }
}

// Checks that Middle Name Exists
function checkMidNam(formula) {
  if (middleName != "" && middleName != middleInitial) {
    emailOutput.push(formula);
  }
}

// Checks that nickInitial exists and != firstInitial, and that Middle Initial exists
function checkNIandMI(formula) {
  if (
    nickInitial &&
    nickInitial &&
    nickInitial != "" &&
    nickInitial != firstInitial &&
    middleInitial != ""
  ) {
    emailOutput.push(formula);
  }
}

// Checks that nickName exists and != firstName, and that Middle Initial Exists
function checkNNandMI(formula) {
  if (
    nickName &&
    nickName != "" &&
    nickName != firstName &&
    middleInitial != ""
  ) {
    emailOutput.push(formula);
  }
}

// Checks that nickName exists and != firstName, and that Middle Name Exists and != middleInitial
function checkNNandMN(formula) {
  if (
    nickName &&
    nickName != "" &&
    nickName != firstName &&
    middleName != "" &&
    middleName != middleInitial
  ) {
    emailOutput.push(formula);
  }
}

// Most Common Emails, including nickName and nickInitial Variations
// nickName versions check for existance
// nickInitial versions chck for existance and uniqueness against firstInitial
function commonEmails(theDomain) {
  emailEnder = "@" + theDomain;

  emailOutput.push(firstName + emailEnder); // First Name
  checkNN(nickName + emailEnder); // Nick Name
  emailOutput.push(lastName + emailEnder); // {ln}
  emailOutput.push(firstName + lastName + emailEnder); // {fn}{ln}
  checkNN(nickName + lastName + emailEnder); // {nn}{ln}
  emailOutput.push(firstName + "." + lastName + emailEnder); // {fn}.{ln}
  checkNN(nickName + "." + lastName + emailEnder); // {nn}.{ln}
  emailOutput.push(firstInitial + lastName + emailEnder); // {fi}{ln}
  checkNI(nickInitial + lastName + emailEnder); // {ni}{ln}
  emailOutput.push(firstInitial + "." + lastName + emailEnder); // {fi}.{ln}
  checkNI(nickInitial + "." + lastName + emailEnder); // {ni}.{ln}
  emailOutput.push(firstName + lastInitial + emailEnder); // {fn}{li}
  checkNN(nickName + lastInitial + emailEnder); // {nn}{li}
  emailOutput.push(firstName + "." + lastInitial + emailEnder); // {fn}.{li}
  checkNN(nickName + "." + lastInitial + emailEnder); // {nn}.{li}
  emailOutput.push(firstInitial + lastInitial + emailEnder); // {fi}{li}
  checkNI(nickInitial + lastInitial + emailEnder); // {ni}{li}
  emailOutput.push(firstInitial + "." + lastInitial + emailEnder); // {fi}.{li}
  checkNI(nickInitial + "." + lastInitial + emailEnder); // {ni}.{li}
}

// Emails that contain middle names and initials
function middleEmails(theDomain) {
  emailEnder = "@" + theDomain;

  checkMidIn(firstInitial + middleInitial + lastName + emailEnder); // {fi}{mi}{ln}
  checkNIandMI(nickInitial + middleInitial + lastName + emailEnder); // {ni}{mi}{ln}
  checkMidIn(firstInitial + middleInitial + "." + lastName + emailEnder); // {fi}{mi}.{ln}
  checkNIandMI(nickInitial + middleInitial + "." + lastName + emailEnder); // {ni}{mi}.{ln}
  checkMidIn(firstName + middleInitial + lastName + emailEnder); // {fn}{mi}{ln}
  checkNNandMI(nickName + middleInitial + lastName + emailEnder); // {nn}{mi}{ln}
  checkMidIn(firstName + "." + middleInitial + "." + lastName + emailEnder); // {fn}.{mi}.{ln}
  checkNNandMI(nickName + "." + middleInitial + "." + lastName + emailEnder); // {nn}.{mi}.{ln}
  checkMidNam(firstName + middleName + lastName + emailEnder); // {fn}{mn}{ln}
  checkNNandMN(nickName + middleName + lastName + emailEnder); // {nn}{mn}{ln}
  checkMidNam(firstName + "." + middleName + "." + lastName + emailEnder); // {fn}.{mn}.{ln}
  checkNNandMN(nickName + "." + middleName + "." + lastName + emailEnder); // {nn}.{mn}.{ln}
}

// Emails using Underscores
function underscoreEmails(theDomain) {
  emailEnder = "@" + theDomain;

  emailOutput.push(firstName + "_" + lastName + emailEnder); // {fn}_{ln}
  checkNN(nickName + "_" + lastName + emailEnder); // {nn}_{ln}
  emailOutput.push(firstInitial + "_" + lastName + emailEnder); // {fi}_{ln}
  checkNI(nickInitial + "_" + lastName + emailEnder); // {ni}_{ln}
  emailOutput.push(firstName + "_" + lastInitial + emailEnder); // {fn}_{li}
  checkNN(nickName + "_" + lastInitial + emailEnder); // {nn}_{li}
  emailOutput.push(firstInitial + "_" + lastInitial + emailEnder); // {fi}_{li}
  checkNI(nickInitial + "_" + lastInitial + emailEnder); // {ni}_{li}
  emailOutput.push(lastName + "_" + firstName + emailEnder); // {ln}_{fn}
  checkNN(lastName + "_" + nickName + emailEnder); // {ln}_{nn}
  emailOutput.push(lastName + "_" + firstInitial + emailEnder); // {ln}_{fi}
  checkNI(lastName + "_" + nickInitial + emailEnder); // {ln}_{ni}
  emailOutput.push(lastInitial + "_" + firstName + emailEnder); // {li}_{fn}
  checkNN(lastInitial + "_" + nickName + emailEnder); // {li}_{nn}
  emailOutput.push(lastInitial + "_" + firstInitial + emailEnder); // {li}_{fi}
  checkNI(lastInitial + "_" + nickInitial + emailEnder); // {li}_{ni}
  checkMidIn(firstInitial + middleInitial + "_" + lastName + emailEnder); // {fi}{mi}_{ln}
  checkNIandMI(nickInitial + middleInitial + "_" + lastName + emailEnder); // {ni}{mi}_{ln}
  checkMidIn(firstName + "_" + middleInitial + "_" + lastName + emailEnder); // {fn}_{mi}_{ln}
  checkNNandMI(nickName + "_" + middleInitial + "_" + lastName + emailEnder); // {nn}_{mi}_{ln}
  checkMidNam(firstName + "_" + middleName + "_" + lastName + emailEnder); // {fn}_{mn}_{ln}
  checkNNandMN(nickName + "_" + middleName + "_" + lastName + emailEnder); // {nn}_{mn}_{ln}
}

function permutate() {
  let name = "Monica Urda";
  // let domainName = "smilesciencechicago.com";
  let firstlastname = name.toLowerCase().trim();
  let namesplit = firstlastname.split(" ");
  let firstname = firstName;
  let lastname = lastName;
  let domain = domain1;

  //bob@domain.com
  let p1 = firstname + "@" + domain;

  //bobsmith@domain.com
  let p2 = firstname + lastname + "@" + domain;

  //bob.smith@domain.com
  let p3 = firstname + "." + lastname + "@" + domain;

  //smith@domain.com
  let p4 = lastname + "@" + domain;

  //bsmith@domain.com
  //let p5 = firstname.charAt(0) + lastname + "@" + domain;

  //b.smith@domain.com
  let p6 = firstname.charAt(0) + "." + lastname + "@" + domain;

  //bobs@domain.com
  let p7 = firstname + lastname.charAt(0) + "@" + domain;

  //bob.s@domain.com
  let p8 = firstname + "." + lastname.charAt(0) + "@" + domain;

  //bs@domain.com
  //let p9 = firstname.charAt(0) + lastname.charAt(0) + "@" + domain;

  return [p1, p2, p3, p4, p6, p7, p8];
}

const emailPermutator = async (
  fName = "Monica",
  lName = "Urda",
  domain = "smilesciencechicago.com"
) => {
  emailOutput = [];
  // Put the form field data into variables
  firstName = fName.trim().toLowerCase();
  firstInitial = firstName.charAt(0);
  lastName = lName.trim().toLowerCase();
  lastInitial = lastName.charAt(0);

  domain1 = domain
    .trim()
    .toLowerCase()
    .replace("www.", "");

  commonEmails(domain1);

  middleEmails(domain1);

  underscoreEmails(domain1);
  let permutateV2 = permutate();

  let finalPermutations = _
    .uniq([...emailOutput, ...permutateV2])
    .splice(0, 17);
  passedEmails(finalPermutations);
  return finalPermutations.sort();
};

async function passedEmails(finalPermutations) {
  //console.log("Final Permutations", finalPermutations);
  let passedEmailsArr = [];
  for (let i = 0; i < finalPermutations.length; i++) {
    let verifyEmails = (await bulkEmailChecker(finalPermutations[i])) || "";
    if (verifyEmails === "passed") {
      passedEmailsArr.push([finalPermutations[i]]);
    }
  }
  if (finalPermutations.length > 0) {
    // await postDataToAppsScript(
    //   "https://script.google.com/macros/s/AKfycbwvj6UAhPMaEPb3p-SshlFeJ_Z2jftVeSwh-K2-I9VG9aaCs0Qd/exec",
    //   finalPermutations.map(el => [el]),
    //   "rawEmails" // "rawEmails"
    // );
    await writeEmailsToFile(finalPermutations);
  }
}

module.exports.emailPermutator = emailPermutator;
