const router = require("express").Router();
const upload = require("../config/multer");

router.post("/upload", upload.single("video"), (req, res) => {
  return res.json({ url: req.file.path });
});

module.exports = router;
