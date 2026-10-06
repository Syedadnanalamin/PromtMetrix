const { ObjectId } = require("mongodb");
const { allPromtsCollection, reviewsCollection, copiesCollection } = require("../config/db.js");

const getAllpromts = async (req, res) => {

    try {

        const allPromts = await allPromtsCollection.find({}).toArray();
        console.log(allPromts);
        res.status(200).json(allPromts);
    } catch (error) {
        console.error("Error getting prompts:", error);
        res.status(500).json({ message: "Failed to fetch prompts", error: error.message });

    }


}

const getPromtbyuser = async (req, res) => {
    try {
        const userid = req.params.id;
        if (!userid || userid === "undefined") {
            return res.status(200).json([]);
        }

        const userpromts = await allPromtsCollection.find({
            $or: [
                { "creator.userId": userid },
                { userId: userid }
            ]
        }).toArray();

        res.status(200).json(userpromts);
    } catch (error) {
        console.error("Error getting user prompts:", error);
        res.status(500).json({ message: "Failed to fetch user prompts", error: error.message });
    }
}


const getSinglePromt = async (req, res) => {
    const id = req.params.id;


    try {
        const singlePromt = await allPromtsCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(singlePromt);
    } catch (error) {
        console.error("Error getting prompt:", error);
        res.status(500).json({ message: "Failed to fetch prompt", error: error.message });
    }
}

const postAddPromt = async (req, res) => {
    try {
        const newPrompt = req.body;

        const result = await allPromtsCollection.insertOne(newPrompt);
        res.status(201).json({ success: true, message: "Prompt added successfully", promptId: result.insertedId });
    } catch (error) {
        console.error("Error adding prompt:", error);
        res.status(500).json({ success: false, message: "Failed to add prompt", error: error.message });
    }
}


const postPromtReviews = async (req, res) => {
    try {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.status(201).json({ success: true, message: "Review added successfully", reviewId: result.insertedId });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
    }
}

const saveCopycount = async (req, res) => {
    try {

        const data = req.body;
        const result = await copiesCollection.insertOne(data);
        res.status(201).json({ success: true, message: "copy promt data stored" });
    }

    catch (error) {

        console.error("Error in saving copy promt data");
        res.status(500).json({ success: false, message: "copy promt data saving failed" });
    }
}

const deleteSinglePromt = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await allPromtsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Prompt not found" });
        }
        res.status(200).json({ success: true, message: "Prompt deleted successfully" });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        res.status(500).json({ success: false, message: "Failed to delete prompt", error: error.message });
    }
}


module.exports = {
    getAllpromts,
    getSinglePromt,
    postAddPromt,
    postPromtReviews,
    saveCopycount,
    getPromtbyuser,
    deleteSinglePromt
}