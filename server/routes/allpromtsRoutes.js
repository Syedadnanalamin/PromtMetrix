const express = require("express");
const router = express.Router();
const {
    getAllpromts,
    getSinglePromt,
    postAddPromt,
    postPromtReviews,
    saveCopycount,
    getPromtbyuser,
    deleteSinglePromt,
    getReviewsByUser,
    updateReview,
    deleteReview,
    updatePromptStatus,
    getAllReviews,
    getTopCreators
} = require('../controllers/allPromtsController');

// gettin all promts
router.get("/", getAllpromts);

// public all reviews for homepage/feed
router.get("/reviews/all", getAllReviews);

// top creators for homepage
router.get("/creators/top", getTopCreators);

// getting prompts by user (must be before /:id)
router.get("/byuser/:id", getPromtbyuser);

// user reviews routes (must be before /:id)
router.get("/reviews/byuser/:id", getReviewsByUser);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// update prompt status (approve / reject)
router.put("/:id/status", updatePromptStatus);

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
