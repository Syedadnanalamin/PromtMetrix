const { ObjectId } = require("mongodb");
const { allPromtsCollection, reviewsCollection, copiesCollection, userCollection } = require("../config/db.js");

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

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewsCollection
            .find({})
            .sort({ _id: -1 })
            .limit(12)
            .toArray();

        const promptIds = reviews.map((r) => r.promptId).filter(Boolean);
        const userIds = reviews.map((r) => r.userId).filter(Boolean);

        const validPromptObjectIds = promptIds
            .filter((id) => ObjectId.isValid(id))
            .map((id) => new ObjectId(id));
        const validUserObjectIds = userIds
            .filter((id) => ObjectId.isValid(id))
            .map((id) => new ObjectId(id));

        const [prompts, users] = await Promise.all([
            validPromptObjectIds.length > 0 || promptIds.length > 0
                ? allPromtsCollection.find({
                    $or: [
                        ...(validPromptObjectIds.length > 0 ? [{ _id: { $in: validPromptObjectIds } }] : []),
                        { id: { $in: promptIds } }
                    ]
                }).toArray()
                : [],
            validUserObjectIds.length > 0 || userIds.length > 0
                ? userCollection.find({
                    $or: [
                        ...(validUserObjectIds.length > 0 ? [{ _id: { $in: validUserObjectIds } }] : []),
                        { id: { $in: userIds } }
                    ]
                }).toArray()
                : []
        ]);

        const promptMap = {};
        prompts.forEach((p) => {
            promptMap[p._id.toString()] = p;
            if (p.id) promptMap[p.id] = p;
        });

        const userMap = {};
        users.forEach((u) => {
            userMap[u._id.toString()] = u;
            if (u.id) userMap[u.id] = u;
        });

        const formatted = reviews.map((rev) => {
            const prompt = promptMap[rev.promptId] || null;
            const user = userMap[rev.userId] || null;
            return {
                id: rev._id.toString(),
                _id: rev._id.toString(),
                author: rev.name || user?.name || "Verified Engineer",
                role: user?.userType === "creator" ? "Top AI Creator" : (user?.role || "Prompt Engineer"),
                company: prompt?.category || "PromptMatrix Community",
                avatar: user?.image || rev.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                rating: rev.rating !== undefined ? Number(rev.rating) : 5,
                date: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || "Recently"),
                promptUsed: prompt?.title || rev.title || "AI Workflow Generator",
                quote: rev.comment || rev.message || "Exceptional consistency and high-value prompt structure."
            };
        });

        res.status(200).json(formatted);
    } catch (error) {
        console.error("Error getting all reviews:", error);
        res.status(500).json({ message: "Failed to fetch all reviews", error: error.message });
    }
};

const getTopCreators = async (req, res) => {
    try {
        const [users, prompts] = await Promise.all([
            userCollection.find({}).toArray(),
            allPromtsCollection.find({}).toArray()
        ]);

        const userMap = {};
        users.forEach((u) => {
            userMap[u._id.toString()] = u;
            if (u.id) userMap[u.id] = u;
        });

        const creatorStats = {};
        prompts.forEach((p) => {
            const uid = p.userId || p.creator?.userId;
            if (uid) {
                if (!creatorStats[uid]) {
                    creatorStats[uid] = {
                        count: 0,
                        copies: 0,
                        tools: new Set(),
                        categories: new Set()
                    };
                }
                creatorStats[uid].count++;
                creatorStats[uid].copies += (p.copyCount || 0);
                if (p.aiTool) creatorStats[uid].tools.add(p.aiTool);
                if (p.category) creatorStats[uid].categories.add(p.category);
            }
        });

        const creators = [];
        const seenNames = new Set();

        Object.entries(creatorStats).forEach(([uid, stat]) => {
            const user = userMap[uid];
            if (user) {
                const name = user.name || "Prompt Engineer";
                if (!seenNames.has(name.toLowerCase())) {
                    seenNames.add(name.toLowerCase());
                    const toolsList = Array.from(stat.tools);
                    const catsList = Array.from(stat.categories);
                    creators.push({
                        id: uid,
                        name: name,
                        role: user.userType === "creator" ? "Senior AI Creator" : (user.role || "Prompt Specialist"),
                        avatar: user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                        specialty: toolsList[0] ? `${toolsList[0]} & ${catsList[0] || "Architecture"}` : "Multi-Model Engineering",
                        promptsCount: stat.count,
                        totalCopies: stat.copies > 0 ? (stat.copies > 1000 ? `${(stat.copies / 1000).toFixed(1)}K` : `${stat.copies}`) : `${stat.count * 12 + 15}`,
                        rating: 4.96,
                        badge: stat.count >= 10 ? "Top Seller" : "Verified"
                    });
                }
            }
        });

        users.filter((u) => u.userType === "creator" || u.role === "creator").forEach((u) => {
            const name = u.name || "AI Specialist";
            if (!seenNames.has(name.toLowerCase()) && creators.length < 4) {
                seenNames.add(name.toLowerCase());
                creators.push({
                    id: u._id.toString(),
                    name: name,
                    role: "AI Creator & Engineer",
                    avatar: u.image || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
                    specialty: "System Architecture & Prompts",
                    promptsCount: 8,
                    totalCopies: "14.2K",
                    rating: 4.92,
                    badge: "Prompt Master"
                });
            }
        });

        creators.sort((a, b) => b.promptsCount - a.promptsCount);

        res.status(200).json(creators);
    } catch (error) {
        console.error("Error getting top creators:", error);
        res.status(500).json({ message: "Failed to fetch top creators", error: error.message });
    }
};

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
    updatePromptStatus,
    getAllReviews,
    getTopCreators
};