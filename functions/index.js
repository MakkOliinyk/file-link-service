const functions = require('firebase-functions');
const fastify = require('fastify');

const { getFirestoreInstance } = require('./config/dbconnector');
const links = require('./routes/file-links');
const getFileLinkUtils = require('./utils');

let requestHandler = null;

const app = fastify({
    logger: true,
    serverFactory: (handler) => {
        requestHandler = handler;
        return require('http').createServer();
    },
});

app.addContentTypeParser('application/json', {}, (req, body, done) => {
    done(null, body.body);
});

app.decorate('db', getFirestoreInstance());
app.decorate('FileLinks', getFileLinkUtils(app.db));
app.register(links, { db: app.db });

exports.app = functions.https.onRequest((req, res) => {
    app.ready((err) => {
        if (err) throw err;
        requestHandler(req, res);
    });
});
