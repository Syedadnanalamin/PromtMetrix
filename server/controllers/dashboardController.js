const { allPromtsCollection, savedpromts, reviewsCollection, copiesCollection } = require("../config/db");


const getUserDashboardAnalytics = async (req, res) => {
    const userId = req.params.id;

    const [myPromts, savedPromts, reviewsGiven, totalCopiesPromts] = await Promise.all([
        allPromtsCollection.countDocuments({ userId }),
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

module.exports = {

    postSavedPromts,
    getUserDashboardAnalytics
}