const functions = require('firebase-functions');
const fastify = require('fastify');
const files = require('./routes/file-links');
const { getFirestoreInstance } = require('./config/dbconnector');

const app = fastify({ logger: true });

app.decorate('db', getFirestoreInstance());
app.register(files, { db: app.db });

const handler = async (req, res) => {
    try {
        await app.ready();
        app.server.emit('request', req, res);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.app = functions.https.onRequest(handler);
