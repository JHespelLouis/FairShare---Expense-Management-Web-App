const {db} = require('../db.js');

exports.getGroups = async (req, res) => {
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

exports.getGroup = async (req, res) => {

}

exports.postGroup = async (req, res) => {
    try {
        const groupCollection = db.collection('groups');
        const {...newData} = req.body;

        const docRef = await groupCollection.add(newData);
        const newDocId = docRef.id; // ID du nouveau document créé

        try {
            const userCollection = db.collection(`users/${req.body.userId}/groups`);

            await userCollection.doc(newDocId).set({
                title: req.body.title,
                description: req.body.description
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Group created with ID: ' + newDocId);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

