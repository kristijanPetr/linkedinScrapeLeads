const firebase = require("firebase");

var config = {
  apiKey: "AIzaSyDpBdCGR-LPoQgEnMcObbUn5k4WU6pOV-A",
  authDomain: "data-scraping-cd97c.firebaseapp.com",
  databaseURL: "https://data-scraping-cd97c.firebaseio.com",
  projectId: "data-scraping-cd97c",
  storageBucket: "",
  messagingSenderId: "494564601702"
};
firebase.initializeApp(config);

const fbUsers = firebase.database().ref("/users/");
const fbEmails = (userId, userIdTimestamp) =>
  firebase.database().ref(`/users/${userId}/${userIdTimestamp}/emails`);
const fbLinkedinUsers = (userId, userIdTimestamp) =>
  firebase.database().ref(`/users//${userId}/${userIdTimestamp}/linkedinusers`);
const fbYelp = (userId, userIdTimestamp) =>
  firebase.database().ref(`/users/${userId}/${userIdTimestamp}/yelp`);
const fbPlaces = (userId, userIdTimestamp) =>
  firebase.database().ref(`/users/${userId}/${userIdTimestamp}/places`);
const fbZip = (userId, userIdTimestamp) =>
  firebase.database().ref(`/users/${userId}/${userIdTimestamp}/ziplocations`);

module.exports = {
  fbEmails,
  fbLinkedinUsers,
  fbYelp,
  fbPlaces,
  fbZip,
  fbUsers
};
