import config from "#/config";
import mongoose from "mongoose";
import { logger } from "#/utils/logging";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        logger.info("MongoDB connected");
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};