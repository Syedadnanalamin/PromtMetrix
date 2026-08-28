const express = require("express");
const router = express.Router();

const { postSavedPromts, getUserDashboardAnalytics } = require("../controllers/dashboardController");


// user dashboard analytics

router.get("/user/analytics/:id", getUserDashboardAnalytics);




router.post("/savedpromts", postSavedPromts);



module.exports = router;
