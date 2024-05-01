const {db} = require("../db");


exports.getUserGroups = async (req, res) => {
    try {
        const groupsCollection = db.collection(`users/${req.params.uid}/groups`);

        const snapshot = await groupsCollection.get();

        const groups = [];

        snapshot.forEach((doc) => {
            const groupData = doc.data();
            groups.push({
                groupId: doc.id,
                ...groupData
            });
        });

        res.status(200).json(groups);
    } catch (error) {
        console.error('Error :', error);
        res.status(500).send('Internal Server Error');
    }

}