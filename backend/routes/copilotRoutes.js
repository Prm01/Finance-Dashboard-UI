const express = require("express");
const { polish } = require("../controllers/copilotController");

const router = express.Router();

router.post("/polish", polish);

module.exports = router;
