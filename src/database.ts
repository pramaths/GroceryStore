import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import winston from "winston";
dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const db = async () => {
    try {
      const mongo = process.env.MONGO_URI;
  
      if (!mongo) {
        throw new Error('MongoDB URI is missing in the .env file');
      }
  
      await mongoose.connect(mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
  
      logger.info('MongoDB connected');
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  };

export default db;
