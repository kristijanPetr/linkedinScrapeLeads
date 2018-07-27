const { fbEmails, fbUsers, fbPlaces } = require("./firebase");
let userId = "WFJxhIpusSPS4ux6uSJvunJ6bWx2";
let timestamp = new Date().getTime();
let userNewDate = `${userId}-${timestamp}`;
fbEmails(userId, timestamp).push({ email: "test@gmail.com" });
fbPlaces(userId, timestamp).push({ place: "New York", website: "google.com" });
fbPlaces(userId, timestamp).push({ place: "Texas", website: "google.com" });
console.log("return ID to user", timestamp);
// fbEmails(userId, timestamp).push({ email: "test@gmail.com" });
