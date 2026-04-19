import mongoose from "mongoose";

const main = async () => {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
        console.warn("MONGODB_URI is not set. Skipping database connection.");
        return;
    }

    try {
        await mongoose.connect(`${mongoUri}/Attendence-MS`);
        console.log("DB Connection Successful...");
    } catch (err) {
        console.log("MongoDB connection Error:-", err.message);
    }
};

export default main;