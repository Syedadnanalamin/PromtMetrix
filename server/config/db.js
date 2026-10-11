require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDB = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// database and collections references
const db = client.db("AiPromts");
const allPromtsCollection = db.collection("allPromts");
const savedpromts = db.collection("savedPromts");
const reviewsCollection = db.collection("reviews");
const copiesCollection = db.collection("promptCopies");
const subscriberCollection = db.collection("subscribers");
const userCollection = db.collection("user");
const reportsCollection = db.collection("reports");

module.exports = {
  connectDB,
  client,
  db,
  allPromtsCollection,
  savedpromts,
  reviewsCollection,
  copiesCollection,
  subscriberCollection,
  userCollection,
  reportsCollection
};
