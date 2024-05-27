const userCtrl = require('../controllers/cl_group')
const express = require("express");
const router = express.Router();

router.get('/:gid', userCtrl.getGroup)
router.post('/', userCtrl.postGroup)
router.put('/:gid', userCtrl.updateGroup)
router.delete('/:gid', userCtrl.deleteGroup)

module.exports = router;
