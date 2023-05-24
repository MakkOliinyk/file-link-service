const routes = async (fastify) => {
    fastify.post('/links', async (request, reply) => {
        const { fileId, ownerId } = request.body;

        if (!fileId) return reply.code(400).send('File ID is required');

        const fileLink = await fastify.FileLinks.getFileLink(fileId, ownerId);

        reply.send(fileLink);
    });

    fastify.get('/links/:linkId', async (request, reply) => {
        const { linkId } = request.params;

        if (!linkId) return reply.code(400).send('Link ID is required');

        const { fileId } = await fastify.FileLinks.getFileId(linkId);

        if (!fileId) return reply.code(404).send('File not found');

        reply.send({ fileId });
    });
};

module.exports = routes;
