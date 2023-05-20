
import admin from 'firebase-admin';

const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://CHANGE_ME.firebaseio.com',
});

export default async function (fastify, options) {
    fastify.decorate('db', admin.database());
}
