const { savedpromts } = require("../config/db");
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

    postSavedPromts
}