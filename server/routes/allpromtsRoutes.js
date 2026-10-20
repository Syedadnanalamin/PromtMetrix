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
const { postReportPrompt } = require('../controllers/dashboardController');


const verifyToken = require("../middlewares/authMiddleware");
const { verifyAdmin, verifyCreator } = require("../middlewares/authUser");

// gettin all promts (public)
router.get("/", getAllpromts);

// public all reviews for homepage/feed
router.get("/reviews/all", getAllReviews);

// top creators for homepage
router.get("/creators/top", getTopCreators);

// getting prompts by user (must be before /:id)
router.get("/byuser/:id", getPromtbyuser);

// user reviews routes (must be before /:id)
router.get("/reviews/byuser/:id", getReviewsByUser);
router.put("/reviews/:id", verifyToken, updateReview);
router.delete("/reviews/:id", verifyToken, deleteReview);

// update prompt status (approve / reject)
router.put("/:id/status", verifyToken, verifyAdmin, updatePromptStatus);

// getting individual promts info
router.get("/:id", getSinglePromt);

// delete single prompt
router.delete("/:id", verifyToken, deleteSinglePromt);

// add new promts
router.post("/add-prompt", verifyToken, postAddPromt);

// adding review to the promt
router.post("/review", verifyToken, postPromtReviews);
router.post("/copycount", saveCopycount);
router.post("/report", postReportPrompt);


module.exports = router;
