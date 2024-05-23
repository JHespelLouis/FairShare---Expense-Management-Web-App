const {db} = require('../db.js');

exports.getExpenses = async (req, res) => {

}

exports.getExpense = async (req, res) => {

}

exports.postExpense = async (req, res) => {
    try {
        const expensesCollection = db.collection(`groups/${req.params.gid}/expenses`);
        const {...newData} = req.body;

        const docRef = await expensesCollection.add(newData);
        res.status(201).send('Expense created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.putExpense = async (req, res) => {
    try {
        const expensesCollection = db.collection(`groups/${req.params.gid}/expenses`);
        const {...newData} = req.body;

        await expensesCollection.doc(req.params.eid).set(newData);
        res.status(200).send('Expense updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const expensesCollection = db.collection(`groups/${req.params.gid}/expenses`);

        await expensesCollection.doc(req.params.eid).delete();
        res.status(200).send('Expense deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}