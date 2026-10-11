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
        if (!review.createdAt) {
            review.createdAt = new Date().toISOString();
        }
        const result = await reviewsCollection.insertOne(review);
        res.status(201).json({ success: true, message: "Review added successfully", reviewId: result.insertedId });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
    }
}

const getReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || userId === "undefined") {
            return res.status(200).json([]);
        }

        const reviews = await reviewsCollection
            .find({ userId })
            .sort({ _id: -1 })
            .toArray();

        // Collect all prompt IDs to fetch their details in one query
        const promptIds = reviews.map((r) => r.promptId).filter(Boolean);
        const validObjectIds = promptIds
            .filter((id) => ObjectId.isValid(id))
            .map((id) => new ObjectId(id));

        let prompts = [];
        if (promptIds.length > 0 && (validObjectIds.length > 0 || promptIds.length > 0)) {
            const queryConditions = [];
            if (validObjectIds.length > 0) queryConditions.push({ _id: { $in: validObjectIds } });
            if (promptIds.length > 0) queryConditions.push({ id: { $in: promptIds } });

            prompts = await allPromtsCollection
                .find({ $or: queryConditions })
                .toArray();
        }

        const promptMap = {};
        prompts.forEach((p) => {
            promptMap[p._id.toString()] = p;
            if (p.id) promptMap[p.id] = p;
        });

        // Merge prompt details and normalize review fields
        const formattedReviews = reviews.map((rev) => {
            const prompt = promptMap[rev.promptId] || null;
            return {
                ...rev,
                _id: rev._id.toString(),
                prompt,
                rating: rev.rating !== undefined ? Number(rev.rating) : 5,
                comment: rev.comment || rev.message || "",
                title: rev.title || (rev.message ? (rev.message.length > 50 ? rev.message.slice(0, 47) + "..." : rev.message) : "Prompt Review"),
                createdAt: rev.createdAt || rev.date || rev._id.getTimestamp().toISOString()
            };
        });

        res.status(200).json(formattedReviews);
    } catch (error) {
        console.error("Error getting user reviews:", error);
        res.status(500).json({ message: "Failed to fetch user reviews", error: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const id = req.params.id;
        const { message, comment, rating, title } = req.body;

        const updateData = {};
        if (message !== undefined) updateData.message = message;
        if (comment !== undefined) updateData.comment = comment;
        if (comment !== undefined && message === undefined) updateData.message = comment;
        if (message !== undefined && comment === undefined) updateData.comment = message;
        if (rating !== undefined) updateData.rating = Number(rating);
        if (title !== undefined) updateData.title = title;
        updateData.updatedAt = new Date().toISOString();

        const result = await reviewsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({ success: true, message: "Review updated successfully" });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ success: false, message: "Failed to update review", error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ success: false, message: "Failed to delete review", error: error.message });
    }
};

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

const updatePromptStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const result = await allPromtsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );
        res.status(200).json({ success: true, message: `Prompt status updated to ${status}` });
    } catch (error) {
        console.error("Error updating prompt status:", error);
        res.status(500).json({ success: false, message: "Failed to update prompt status", error: error.message });
    }
}

module.exports = {
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
    updatePromptStatus
}