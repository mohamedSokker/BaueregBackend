const express = require("express");
const router = express.Router();
const { renameFile } = require("../../../controllers/web/OilSamples/rename");

router.post("/", renameFile);

module.exports = router;
