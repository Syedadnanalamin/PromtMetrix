const express = require("express");
const router = express.Router();
const { getAllpromts, getSinglePromt, postAddPromt, postPromtReviews } = require('../controllers/allPromtsController');

// gettin all promts
router.get("/", getAllpromts);

// getting individual promts info;

router.get("/:id", getSinglePromt);

// add new promts

router.post("/add-prompt", postAddPromt);
// adding review to the promt

router.post("/review", postPromtReviews);


module.exports = router;
