const express = require("express");
const router = express.Router();

const { postSavedPromts } = require("../controllers/dashboardController");

router.post("/savedpromts", postSavedPromts);


module.exports = router;
