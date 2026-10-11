const express = require("express");
const router = express.Router();

const { postSavedPromts, getUserDashboardAnalytics, postSubscriber } = require("../controllers/dashboardController");


// user dashboard analytics

router.get("/user/analytics/:id", getUserDashboardAnalytics);




router.post("/savedpromts", postSavedPromts);

// subscriber purchase route
router.post("/subscriber", postSubscriber);



module.exports = router;
