const express = require("express");
const router = express.Router();
const {
  deleteFile,
} = require("../../../controllers/web/OilSamples/deleteFiles");

router.post("/", deleteFile);

module.exports = router;
