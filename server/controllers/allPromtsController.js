const { ObjectId } = require("mongodb");
const { allPromtsCollection, reviewsCollection } = require("../config/db.js");

const getAllpromts = async (req, res) => {

    try {

        const allPromts = await allPromtsCollection.find({}).toArray();
        res.status(200).json(allPromts);
    } catch (error) {
        console.error("Error getting prompts:", error);
        res.status(500).json({ message: "Failed to fetch prompts", error: error.message });
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


module.exports = {
    getAllpromts,
    getSinglePromt,
    postAddPromt,
    postPromtReviews
}