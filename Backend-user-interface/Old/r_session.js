const userCtrl = require('./cl_session')
const express = require("express");
const router = express.Router();

router.get('/:sessId', userCtrl.getSession)
router.post('/', userCtrl.createSessions)

module.exports = router;