const { v4 } = require('uuid');

const FileLinkUtils = (db) => {
    return {
        collection: db.collection('links'),
        getFileId: async function(linkId) {
            const { collection } = this;

            const snapshot = await collection.doc(linkId).get();
            const fileLink = snapshot.data();

            if (!fileLink) return null;

            return { fileId: fileLink.fileId };
        },
        getFileLink: async function(fileId, ownerId) {
            const { collection } = this;

            const querySnapshot = await collection.where('fileId', '==', fileId).get();
            const fileLinks = [];

            querySnapshot.forEach(doc => {
                fileLinks.push(doc.data());
            });

            if (fileLinks.length > 0) return fileLinks[0];

            const link = generateLinkId();
            await db.collection('links').doc(link).set({ link, fileId, ownerId });

            return { link };
        },
        generateLinkId: function() {
            return v4();
        }
    };
}

module.exports = FileLinkUtils;
