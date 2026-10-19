const { ObjectId } = require("mongodb");
const { allPromtsCollection, savedpromts, reviewsCollection, copiesCollection, subscriberCollection, userCollection, reportsCollection, reportedpromts } = require("../config/db");


const getUserDashboardAnalytics = async (req, res) => {
    const userId = req.params.id;

    if (!userId || userId === "undefined") {
        return res.status(200).json({ success: true, data: { myPromts: 0, savedPromts: 0, reviewsGiven: 0, totalCopiesPromts: 0 } });
    }

    const [myPromts, savedPromts, reviewsGiven, totalCopiesPromts] = await Promise.all([
        allPromtsCollection.countDocuments({
            $or: [
                { "creator.userId": userId },
                { userId }
            ]
        }),
        savedpromts.countDocuments({ userId }),
        reviewsCollection.countDocuments({ userId }),
        copiesCollection.countDocuments({ userId }),
    ]);

    res.status(200).json({ success: true, data: { myPromts, savedPromts, reviewsGiven, totalCopiesPromts } });
}




const postSavedPromts = async (req, res) => {

    const data = req.body;
    try {

        const result = await savedpromts.insertOne(data);
        res.status(201).json({ success: true, message: "you successfully saved the promts", insertedId: result.insertedId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "There is a problem saving the promts", error: error.message });
    }
}

const postSubscriber = async (req, res) => {
    const data = req.body;
    try {
        const result = await subscriberCollection.insertOne(data);

        // update user plan to pro
        await userCollection.updateOne(
            { email: data.email },
            { $set: { plan: "pro", isPremium: true } }
        );

        res.status(201).json({ success: true, message: "subscriber added successfully", insertedId: result.insertedId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "There is a problem saving the subscriber", error: error.message });
    }
}

const getAdminDashboardAnalytics = async (req, res) => {
    try {
        const [
            totalUsers,
            usersCount,
            creatorsCount,
            adminsCount,
            totalPrompts,
            approvedPrompts,
            pendingPrompts,
            pendingList,
            totalCopies,
            subscribersCount
        ] = await Promise.all([
            userCollection.countDocuments({}),
            userCollection.countDocuments({ userType: "user" }),
            userCollection.countDocuments({ userType: "creator" }),
            userCollection.countDocuments({ userType: "admin" }),
            allPromtsCollection.countDocuments({}),
            allPromtsCollection.countDocuments({ status: "approved" }),
            allPromtsCollection.countDocuments({ status: "pending" }),
            allPromtsCollection.find({ status: "pending" }).sort({ _id: -1 }).limit(5).toArray(),
            copiesCollection.countDocuments({}),
            subscriberCollection.countDocuments({})
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                usersCount,
                creatorsCount,
                adminsCount,
                totalPrompts,
                approvedPrompts,
                pendingPrompts,
                pendingList,
                totalCopies,
                subscribersCount,
                totalRevenue: subscribersCount * 5
            }
        });
    } catch (error) {
        console.error("Error getting admin analytics:", error);
        res.status(500).json({ success: false, message: "Failed to fetch admin analytics" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userCollection.find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { userType } = req.body;

        const query = ObjectId.isValid(id)
            ? { $or: [{ _id: new ObjectId(id) }, { id }] }
            : { id };

        const result = await userCollection.updateOne(query, { $set: { userType } });
        res.status(200).json({ success: true, message: "User role updated successfully" });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ success: false, message: "Failed to update user role", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const query = ObjectId.isValid(id)
            ? { $or: [{ _id: new ObjectId(id) }, { id }] }
            : { id };

        await userCollection.deleteOne(query);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
    }
};

const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberCollection.find({}).sort({ _id: -1 }).toArray();
        res.status(200).json(subscribers);
    } catch (error) {
        console.error("Error getting subscribers:", error);
        res.status(500).json({ message: "Failed to fetch subscribers", error: error.message });
    }
};

const postReportPrompt = async (req, res) => {
    try {
        const { userId, promtId, promptId, report, reason, description, promptTitle } = req.body;

        const targetPromptId = promtId || promptId;
        const reportContent = report || description || reason || "Policy violation reported";

        let title = promptTitle;
        if (!title && targetPromptId) {
            try {
                const promptDoc = await allPromtsCollection.findOne(
                    ObjectId.isValid(targetPromptId) ? { _id: new ObjectId(targetPromptId) } : { _id: targetPromptId }
                );
                title = promptDoc?.title || "";
            } catch (e) {
                // ignore
            }
        }

        const reportData = {
            userId: userId || "anonymous",
            promtId: targetPromptId,
            promptId: targetPromptId,
            report: reportContent,
            reason: reason || reportContent,
            promptTitle: title || "",
            createdAt: new Date().toISOString()
        };

        const result = await reportedpromts.insertOne(reportData);
        res.status(201).json({ success: true, message: "Report submitted successfully", result });
    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await reportedpromts.find({}).sort({ _id: -1 }).toArray();
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error getting reports:", error);
        res.status(500).json({ message: "Failed to fetch reports", error: error.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const query = ObjectId.isValid(id)
            ? { $or: [{ _id: new ObjectId(id) }, { id }] }
            : { id };

        await reportedpromts.deleteOne(query);
        res.status(200).json({ success: true, message: "Report resolved" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ success: false, message: "Failed to delete report", error: error.message });
    }
};

const checkUserReported = async (req, res) => {
    try {
        const { userId, promptId } = req.query;
        if (!userId || !promptId) {
            return res.status(200).json({ reported: false });
        }
        const existing = await reportedpromts.findOne({
            userId,
            $or: [{ promtId: promptId }, { promptId }]
        });
        res.status(200).json({ reported: !!existing });
    } catch (error) {
        console.error("Error checking report:", error);
        res.status(200).json({ reported: false });
    }
};

module.exports = {
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
}