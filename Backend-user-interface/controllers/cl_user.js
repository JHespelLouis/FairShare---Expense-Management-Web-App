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

exports.joinGroup = async (req, res) => {
    try {
        const groupDocument = db.doc(`groups/${req.body.groupId}`);
        const snapshot = await groupDocument.get();

        if (!snapshot.exists) {
            res.status(404).send('Group not found');
        } else {
            const groupData = snapshot.data();
            const updatedData = {...groupData, ...req.body};

            await groupDocument.set(updatedData);
        }
        try{
            const userCollection = db.collection(`users/${req.params.uid}/groups`);
            await userCollection.doc(req.body.groupId).set({
                title: req.body.title,
                description: req.body.description
            });
        } catch (error) {
            console.error('Error :', error);
            res.status(500).send('Internal Server Error');
        }
        res.status(200).end();
    } catch (error) {
        console.error('Error :', error);
        res.status(500).send('Internal Server Error');
    }
}