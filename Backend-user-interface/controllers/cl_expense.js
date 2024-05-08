const {db} = require('../db.js');

exports.getExpenses = async (req, res) => {

}

exports.getExpense = async (req, res) => {

}

exports.postExpense = async (req, res) => {
    try {
        const expensesCollection = db.collection(`groups/${req.params.gid}/expenses`);
        console.log(req.body)
        const {...newData} = req.body;

        const docRef = await expensesCollection.add(newData);
        res.status(201).send('Expense created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
