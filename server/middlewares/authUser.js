const { users } = require("../config/db");

const verifyUser = async (req, res, next) => {

    const user = await users.findOne({ _id: req.user.userId });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.userType !== "user") {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("user checking is working ");

    next();


}
const verifyCreator = async (req, res, next) => {

    const user = await users.findOne({ _id: req.user.userId });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.userType !== "creator") {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("creator checking is working ");

    next();


}
const verifyAdmin = async (req, res, next) => {

    const user = await users.findOne({ _id: req.user.userId });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.userType !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("admin checking is working ");

    next();
}


module.exports = { verifyUser, verifyCreator, verifyAdmin };
