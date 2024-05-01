const userCtrl = require('../controllers/cl_user')
const express = require("express");
const router = express.Router();

router.get('/:uid', userCtrl.getUserGroups)


module.exports = router;
