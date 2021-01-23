const router = require("express").Router();
const uploadImage = require("../middleware/uploadImage")
const auth = require("../middleware/auth")
const uploadCtrl = require('../controllers/uploadCtrl')

router.post("/upload_avatar",uploadImage,auth,uploadCtrl.uploadAvatar)

module.exports = router