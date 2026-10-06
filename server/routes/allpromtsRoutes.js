const express = require("express");
const router = express.Router();
const { getAllpromts, getSinglePromt, postAddPromt, postPromtReviews, saveCopycount, getPromtbyuser, deleteSinglePromt } = require('../controllers/allPromtsController');

// gettin all promts
router.get("/", getAllpromts);

// getting prompts by user (must be before /:id)
router.get("/byuser/:id", getPromtbyuser);

// getting individual promts info
router.get("/:id", getSinglePromt);

// delete single prompt
router.delete("/:id", deleteSinglePromt);

// add new promts
router.post("/add-prompt", postAddPromt);

// adding review to the promt
router.post("/review", postPromtReviews);
router.post("/copycount", saveCopycount);


module.exports = router;
