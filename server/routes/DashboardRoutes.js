const express = require("express");
const router = express.Router();

const {
    postSavedPromts,
    getUserDashboardAnalytics,
    getAdminDashboardAnalytics,
    postSubscriber,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllSubscribers,
    getAllReports,
    deleteReport,
    postReportPrompt,
    checkUserReported
} = require("../controllers/dashboardController");
const verifyToken = require("../middlewares/authMiddleware");
const { verifyUser, verifyAdmin } = require("../middlewares/authUser");

// user dashboard analytics
router.get("/user/analytics/:id", verifyToken, verifyUser, getUserDashboardAnalytics);

// admin dashboard analytics
router.get("/admin/analytics", getAdminDashboardAnalytics);

// admin users management
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/users/:id/role", verifyToken, verifyAdmin, updateUserRole);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

// admin subscribers / payments
router.get("/subscribers", verifyToken, verifyAdmin, getAllSubscribers);

// admin reports
router.get("/reports/check", checkUserReported);
router.get("/reports", verifyToken, verifyAdmin, getAllReports);
router.post("/reports", postReportPrompt);
router.delete("/reports/:id", verifyToken, verifyAdmin, deleteReport);




router.post("/savedpromts", verifyToken, postSavedPromts);

// subscriber purchase route
router.post("/subscriber", verifyToken, postSubscriber);



module.exports = router;
