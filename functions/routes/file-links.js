const routes = async (fastify) => {
    fastify.post('/links', async (request, reply) => {
        try {
            const { fileId, ownerId } = request.body;

            if (!fileId) return reply.code(400).send('File ID is required');

            const fileLink = await fastify.FileLinks.getFileLink(fileId, ownerId);

            reply.send({ fileLink });
        } catch (error) {
            reply.send(error);
        }
    });

    fastify.get('/links/:linkId', async (request, reply) => {
        try {
            const { linkId } = request.params;

            if (!linkId) return reply.code(400).send('Link ID is required');

            const { fileId } = await fastify.FileLinks.getFileId(linkId);

            if (!fileId) return reply.code(404).send('File not found');

            reply.send({ fileId });
        } catch (error) {
            reply.send(error);
        }
    });
};

module.exports = routes;
