const userCtrl = require('../controllers/cl_group')
const express = require("express");
const router = express.Router();

router.get('/:uid', userCtrl.getGroups)
router.post('/', userCtrl.postGroup)
router.post('/:uid', userCtrl.postGroup)

module.exports = router;
