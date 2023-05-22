import { v4 as uuidv4 } from 'uuid';

async function getFileId(linkId) {
    const { db } = this;

    const snapshot = await db.ref('fileLinks').child(linkId).once('value');
    const fileLink = snapshot.val();

    if (!fileLink) return null;

    return { fileId: fileLink.fileId };
}

async function getFileLink(fileId) {
    const { db } = this;

    const snapshot = await db.ref('fileLinks').orderByChild('fileId').equalTo(fileId).once('value');
    const fileLink = snapshot.val();

    if (fileLink) return fileLink;

    const linkId = generateLinkId();
    await db.ref('fileLinks').child(linkId).set({ id: linkId, fileId });

    return { linkId };
}

function generateLinkId() {
    return uuidv4();
}

const routes = async (fastify) => {
    fastify.post('/links', async (request, reply) => {
        const { fileId } = request.query; // move to body

        if (!fileId) return reply.code(400).send('File ID is required');

        const fileLink = await getFileLink.call(fastify, fileId);

        reply.send(fileLink);
    });

    fastify.get('/links/:linkId', async (request, reply) => {
        const { linkId } = request.params;

        if (!linkId) return reply.code(400).send('Link ID is required');

        const { fileId } = await getFileId.call(fastify, linkId);

        if (!fileId) return reply.code(404).send('File not found');

        reply.send({ fileId });
    });
}

export default routes;


