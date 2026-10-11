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
    deleteReport
} = require("../controllers/dashboardController");

// user dashboard analytics
router.get("/user/analytics/:id", getUserDashboardAnalytics);

// admin dashboard analytics
router.get("/admin/analytics", getAdminDashboardAnalytics);

// admin users management
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// admin subscribers / payments
router.get("/subscribers", getAllSubscribers);

// admin reports
router.get("/reports", getAllReports);
router.delete("/reports/:id", deleteReport);




router.post("/savedpromts", postSavedPromts);

// subscriber purchase route
router.post("/subscriber", postSubscriber);



module.exports = router;
