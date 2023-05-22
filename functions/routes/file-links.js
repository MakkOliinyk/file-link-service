const { v4 } = require('uuid');

async function getFileId(linkId) {
    const { db } = this;

    const snapshot = await db.collection('links').doc(linkId).get();
    const fileLink = snapshot.data();

    if (!fileLink) return null;

    return { fileId: fileLink.fileId };
}

async function getFileLink(fileId, ownerId) {
    const { db } = this;

    const querySnapshot = await db.collection('links').where('fileId', '==', fileId).get();
    const fileLinks = [];

    querySnapshot.forEach(doc => {
        fileLinks.push(doc.data());
    });

    if (fileLinks.length > 0) return fileLinks[0];

    const link = generateLinkId();
    await db.collection('links').doc(link).set({ link, fileId, ownerId });

    return { link };
}

function generateLinkId() {
    return v4();
}

const routes = async (fastify) => {
    fastify.post('/links', async (request, reply) => {
        const { fileId, ownerId } = request.body;

        if (!fileId) return reply.code(400).send('File ID is required');

        const fileLink = await getFileLink.call(fastify, fileId, ownerId);

        reply.send(fileLink);
    });

    fastify.get('/links/:linkId', async (request, reply) => {
        const { linkId } = request.params;

        if (!linkId) return reply.code(400).send('Link ID is required');

        const { fileId } = await getFileId.call(fastify, linkId);

        if (!fileId) return reply.code(404).send('File not found');

        reply.send({ fileId });
    });
};

module.exports = routes;
