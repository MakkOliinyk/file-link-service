const admin = require('firebase-admin');

const serviceAccount = require("./serviceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://file-links-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = {
    getFirestoreInstance: () => db
};
