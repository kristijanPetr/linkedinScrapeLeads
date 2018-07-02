const _ = require("lodash");
const {
  verifierEmailsFromHunter,
  verifierEmailsFromKickBox
} = require("./index");

var firstName;
var firstInitial;
var lastName;
var lastInitial;
var middleName;
var middleInitial;
var nickName;
var nickInitial;
var domain1;
// var domain2;
// var domain3;
var emailOutput = new Array();
// var $copyButton = $("#copy-permutations");

// FOR ZEROCLIPBOARD
// var clip = new ZeroClipboard($("#copy-permutations"));

// Checks nickName for existance and uniqueness against firstName
// When deciding whether or not to make email permutations with it.
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

// Email Permutations that begin with last names
function lessCommonEmails(theDomain) {
  emailEnder = "@" + theDomain;

  emailOutput.push(lastName + firstName + emailEnder); // {ln}{fn}
  checkNN(lastName + nickName + emailEnder); // {ln}{nn}
  emailOutput.push(lastName + "." + firstName + emailEnder); // {ln}.{fn}
  checkNN(lastName + "." + nickName + emailEnder); // {ln}.{nn}
  emailOutput.push(lastName + firstInitial + emailEnder); // {ln}{fi}
  checkNI(lastName + nickInitial + emailEnder); // {ln}{ni}
  emailOutput.push(lastName + "." + firstInitial + emailEnder); // {ln}.{fi}
  checkNI(lastName + "." + nickInitial + emailEnder); // {ln}.{ni}
  emailOutput.push(lastInitial + firstName + emailEnder); // {li}{fn}
  checkNN(lastInitial + nickName + emailEnder); // {li}{nn}
  emailOutput.push(lastInitial + "." + firstName + emailEnder); // {li}.{fn}
  checkNN(lastInitial + "." + nickName + emailEnder); // {li}.{nn}
  emailOutput.push(lastInitial + firstInitial + emailEnder); // {li}{fi}
  checkNI(lastInitial + nickInitial + emailEnder); // {li}{ni}
  emailOutput.push(lastInitial + "." + firstInitial + emailEnder); // {li}.{fi}
  checkNI(lastInitial + "." + nickInitial + emailEnder); // {li}.{ni}
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

// Emails using dashes
function dashEmails(theDomain) {
  emailEnder = "@" + theDomain;

  emailOutput.push(firstName + "-" + lastName + emailEnder); // {fn}-{ln}
  checkNN(nickName + "-" + lastName + emailEnder); // {nn}-{ln}
  emailOutput.push(firstInitial + "-" + lastName + emailEnder); // {fi}-{ln}
  checkNI(nickInitial + "-" + lastName + emailEnder); // {ni}-{ln}
  emailOutput.push(firstName + "-" + lastInitial + emailEnder); // {fn}-{li}
  checkNN(nickName + "-" + lastInitial + emailEnder); // {nn}-{li}
  emailOutput.push(firstInitial + "-" + lastInitial + emailEnder); // {fi}-{li}
  checkNI(nickInitial + "-" + lastInitial + emailEnder); // {ni}-{li}
  emailOutput.push(lastName + "-" + firstName + emailEnder); // {ln}-{fn}
  checkNN(lastName + "-" + nickName + emailEnder); // {ln}-{nn}
  emailOutput.push(lastName + "-" + firstInitial + emailEnder); // {ln}-{fi}
  checkNI(lastName + "-" + nickInitial + emailEnder); // {ln}-{ni}
  emailOutput.push(lastInitial + "-" + firstName + emailEnder); // {li}-{fn}
  checkNN(lastInitial + "-" + nickName + emailEnder); // {li}-{nn}
  emailOutput.push(lastInitial + "-" + firstInitial + emailEnder); // {li}-{fi}
  checkNI(lastInitial + "-" + nickInitial + emailEnder); // {li}-{ni}
  checkMidIn(firstInitial + middleInitial + "-" + lastName + emailEnder); // {fi}{mi}-{ln}
  checkNIandMI(nickInitial + middleInitial + "-" + lastName + emailEnder); // {ni}{mi}-{ln}
  checkMidIn(firstName + "-" + middleInitial + "-" + lastName + emailEnder); // {fn}-{mi}-{ln}
  checkNNandMI(nickName + "-" + middleInitial + "-" + lastName + emailEnder); // {nn}-{mi}-{ln}
  checkMidNam(firstName + "-" + middleName + "-" + lastName + emailEnder); // {fn}-{mn}-{ln}
  checkNNandMN(nickName + "-" + middleName + "-" + lastName + emailEnder); // {nn}-{mn}-{ln}
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

function permutate(data) {
  var name = "Monica Urda";
  var domainName = "smilesciencechicago.com";
  var firstlastname = name.toLowerCase().trim();
  var namesplit = firstlastname.split(" ");
  var firstname = namesplit[0];
  var lastname = namesplit[1];
  var domain = domainName.toLowerCase().trim();

  //bob@domain.com
  var p1 = firstname + "@" + domain;

  //bobsmith@domain.com
  var p2 = firstname + lastname + "@" + domain;

  //bob.smith@domain.com
  var p3 = firstname + "." + lastname + "@" + domain;

  //smith@domain.com
  var p4 = lastname + "@" + domain;

  //bsmith@domain.com
  var p5 = firstname.charAt(0) + lastname + "@" + domain;

  //b.smith@domain.com
  var p6 = firstname.charAt(0) + "." + lastname + "@" + domain;

  //bobs@domain.com
  var p7 = firstname + lastname.charAt(0) + "@" + domain;

  //bob.s@domain.com
  var p8 = firstname + "." + lastname.charAt(0) + "@" + domain;

  //bs@domain.com
  var p9 = firstname.charAt(0) + lastname.charAt(0) + "@" + domain;

  return [p1, p2, p3, p4, p5, p6, p7, p8, p9];
}

// Triggers all the Calculatons to Happen
// $("#permutateBtn").click(function() {
// Make sure the Array is empty, in case this is run multiple times
emailOutput = [];

// Put the form field data into variables
firstName = "Monica" //$("#firstName")

  .trim()
  .toLowerCase();
firstInitial = firstName.charAt(0);
lastName = "Urda" //$("#lastName")

  .trim()
  .toLowerCase();
lastInitial = lastName.charAt(0);

domain1 = "smilesciencechicago.com" //$("#domain1")

  .trim()
  .toLowerCase();

// Run each category of email permutation for each domain
commonEmails(domain1);

lessCommonEmails(domain1);

middleEmails(domain1);

dashEmails(domain1);

underscoreEmails(domain1);

let permutateV2 = permutate();
console.log(emailOutput);
let finalPermutations = _.uniq([...emailOutput, ...permutateV2]);
asyncEmailChecker(finalPermutations);

function asyncEmailChecker(emails) {
  emails.map(async email => {
    let checkerHunter = await verifierEmailsFromHunter(email);
    let checkerKickBox = await verifierEmailsFromKickBox(email);

    console.log(
      "CHECKER HUNTER : " +
        JSON.stringify(checkerHunter) +
        "CHECKER KICKBOX : " +
        JSON.stringify(checkerKickBox)
    );
  });
}
