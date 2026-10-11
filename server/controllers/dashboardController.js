const { allPromtsCollection, savedpromts, reviewsCollection, copiesCollection, subscriberCollection, userCollection } = require("../config/db");


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

module.exports = {
    postSavedPromts,
    getUserDashboardAnalytics,
    postSubscriber
}