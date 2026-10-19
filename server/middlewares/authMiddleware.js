
const { session } = require("../config/db");

const verifyToken = async (req, res, next) => {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = headerToken.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // checking is token is valid; 

    const query = {
        token: token
    }

    const user = await session.findOne(query);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user) {
        req.user = user;

        // this is passing the use info to the next middleware; 
    }

    console.log("middleware is working");
    next();
}
module.exports = verifyToken; 