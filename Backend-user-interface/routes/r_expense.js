const userCtrl = require('../controllers/cl_expense')
const express = require("express");
const router = express.Router();

router.get('/:gid', userCtrl.getExpenses)
router.get('/:gid/:eid', userCtrl.getExpense)
router.post('/', userCtrl.postExpense)

module.exports = router;
