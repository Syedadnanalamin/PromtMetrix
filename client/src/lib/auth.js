import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("AiPromts");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),

    user: {
        additionalFields: {
            userType: {
                type: "string",
                required: false,
                defaultValue: "user"
            },
            plan: {
                type: "string",
                required: false
            }
        }
    },

    emailAndPassword: {
        enabled: true,
    },
});
